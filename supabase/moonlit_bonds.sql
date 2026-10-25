-- Vioverse v1.5.0 Moonlit Bonds. Server-owned friendships, daily hearts, and capped bonuses.
create table if not exists public.vv_profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 username text not null unique,
 display_name text not null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint vv_username_format check (username ~ '^[a-z0-9_]{3,20}$'),
 constraint vv_display_length check (char_length(display_name) between 2 and 20)
);
create table if not exists public.vv_friendships (
 id uuid primary key default gen_random_uuid(),
 requester uuid not null references auth.users(id) on delete cascade,
 recipient uuid not null references auth.users(id) on delete cascade,
 status text not null default 'pending' check (status in ('pending','accepted')),
 created_at timestamptz not null default now(),
 accepted_at timestamptz,
 constraint vv_not_self check (requester <> recipient)
);
create unique index if not exists vv_friendship_unique_pair on public.vv_friendships (least(requester,recipient),greatest(requester,recipient));
create index if not exists vv_friendships_requester_idx on public.vv_friendships(requester,status);
create index if not exists vv_friendships_recipient_idx on public.vv_friendships(recipient,status);
create table if not exists public.vv_hearts (
 id bigint generated always as identity primary key,
 sender uuid not null references auth.users(id) on delete cascade,
 recipient uuid not null references auth.users(id) on delete cascade,
 sent_on date not null default ((now() at time zone 'UTC')::date),
 created_at timestamptz not null default now(),
 constraint vv_heart_not_self check (sender <> recipient),
 constraint vv_one_heart_daily unique (sender,recipient,sent_on)
);
create index if not exists vv_hearts_receiver_day_idx on public.vv_hearts(recipient,sent_on);
alter table public.vv_profiles enable row level security;
alter table public.vv_friendships enable row level security;
alter table public.vv_hearts enable row level security;
revoke all on public.vv_profiles, public.vv_friendships, public.vv_hearts from anon, authenticated;
revoke all on sequence public.vv_hearts_id_seq from anon, authenticated;

create or replace function public.vv_set_profile(p_username text,p_display_name text default null)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare v_id uuid := auth.uid(); v_name text; v_display text; v_row public.vv_profiles%rowtype;
begin
 if v_id is null then raise exception 'Sign in to create your player profile'; end if;
 v_name:=lower(btrim(coalesce(p_username,'')));
 v_display:=btrim(coalesce(nullif(p_display_name,''),v_name));
 if v_name !~ '^[a-z0-9_]{3,20}$' then raise exception 'Username must be 3-20 letters, numbers or underscores'; end if;
 if char_length(v_display) not between 2 and 20 or v_display ~ '[[:cntrl:]]' then raise exception 'Display name must be 2-20 characters'; end if;
 insert into public.vv_profiles(id,username,display_name) values(v_id,v_name,v_display)
 on conflict(id) do update set username=excluded.username,display_name=excluded.display_name,updated_at=now()
 returning * into v_row;
 return jsonb_build_object('id',v_row.id,'username',v_row.username,'display_name',v_row.display_name);
exception when unique_violation then
 raise exception 'That username is already taken';
end $$;

create or replace function public.vv_search_players(p_query text)
returns table(id uuid,username text,display_name text)
language plpgsql security definer set search_path = ''
as $$
declare v_id uuid:=auth.uid(); v_query text:=lower(btrim(coalesce(p_query,'')));
begin
 if v_id is null then raise exception 'Sign in to search players'; end if;
 if char_length(v_query)<2 or char_length(v_query)>20 or v_query !~ '^[a-z0-9_]+$' then
  raise exception 'Search 2-20 username characters';
 end if;
 return query select p.id,p.username,p.display_name from public.vv_profiles p
 where p.id<>v_id and p.username like v_query||'%' order by p.username limit 12;
end $$;

create or replace function public.vv_request_friend(p_target uuid)
returns text language plpgsql security definer set search_path = ''
as $$
declare v_id uuid:=auth.uid(); v_count integer;
begin
 if v_id is null then raise exception 'Sign in first'; end if;
 if p_target is null or p_target=v_id then raise exception 'Choose another player'; end if;
 if not exists(select 1 from public.vv_profiles where id=v_id) then raise exception 'Create your player profile first'; end if;
 if not exists(select 1 from public.vv_profiles where id=p_target) then raise exception 'Player not found'; end if;
 perform pg_advisory_xact_lock(hashtextextended(v_id::text,1));
 select count(*) into v_count from public.vv_friendships where requester=v_id and status='pending';
 if v_count>=50 then raise exception 'You have 50 outgoing requests. Cancel one first'; end if;
 select count(*) into v_count from public.vv_friendships where (requester=v_id or recipient=v_id) and status='accepted';
 if v_count>=50 then raise exception 'Your friend list is full (50/50)'; end if;
 insert into public.vv_friendships(requester,recipient) values(v_id,p_target);
 return 'Friend request sent';
exception when unique_violation then
 raise exception 'A friend request or friendship already exists';
end $$;

create or replace function public.vv_respond_friend(p_friendship uuid,p_accept boolean)
returns text language plpgsql security definer set search_path = ''
as $$
declare v_id uuid:=auth.uid(); v_requester uuid; v_recipient uuid; v_status text; v_count integer;
begin
 if v_id is null then raise exception 'Sign in first'; end if;
 select requester,recipient,status into v_requester,v_recipient,v_status
 from public.vv_friendships where id=p_friendship for update;
 if not found or v_recipient<>v_id or v_status<>'pending' then raise exception 'Friend request not found'; end if;
 if not coalesce(p_accept,false) then
  delete from public.vv_friendships where id=p_friendship;
  return 'Friend request declined';
 end if;
 perform pg_advisory_xact_lock(hashtextextended(least(v_requester,v_recipient)::text,1));
 perform pg_advisory_xact_lock(hashtextextended(greatest(v_requester,v_recipient)::text,1));
 select count(*) into v_count from public.vv_friendships
 where (requester=v_requester or recipient=v_requester) and status='accepted';
 if v_count>=50 then raise exception 'Sender has reached the 50-friend limit'; end if;
 select count(*) into v_count from public.vv_friendships
 where (requester=v_recipient or recipient=v_recipient) and status='accepted';
 if v_count>=50 then raise exception 'Your friend list is full (50/50)'; end if;
 update public.vv_friendships set status='accepted',accepted_at=now() where id=p_friendship;
 return 'Friend request accepted';
end $$;

create or replace function public.vv_remove_friend(p_friendship uuid)
returns text language plpgsql security definer set search_path = ''
as $$
declare v_id uuid:=auth.uid(); v_count integer;
begin
 if v_id is null then raise exception 'Sign in first'; end if;
 delete from public.vv_friendships where id=p_friendship and (requester=v_id or recipient=v_id);
 get diagnostics v_count=row_count;
 if v_count=0 then raise exception 'Friendship or request not found'; end if;
 return 'Friend removed or request cancelled';
end $$;

create or replace function public.vv_send_heart(p_friend uuid)
returns text language plpgsql security definer set search_path = ''
as $$
declare v_id uuid:=auth.uid(); v_today date:=(now() at time zone 'UTC')::date;
begin
 if v_id is null then raise exception 'Sign in first'; end if;
 if p_friend is null or p_friend=v_id then raise exception 'Choose a friend'; end if;
 if not exists(select 1 from public.vv_friendships where status='accepted'
  and ((requester=v_id and recipient=p_friend) or (requester=p_friend and recipient=v_id)))
 then raise exception 'You can only send hearts to accepted friends'; end if;
 insert into public.vv_hearts(sender,recipient,sent_on) values(v_id,p_friend,v_today);
 return 'Heart sent! Come back after midnight UTC';
exception when unique_violation then
 raise exception 'You already sent this friend a heart today';
end $$;

create or replace function public.vv_get_hub()
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare v_id uuid:=auth.uid(); v_profile jsonb; v_rows jsonb; v_count integer; v_sent integer; v_received integer; v_today date:=(now() at time zone 'UTC')::date;
begin
 if v_id is null then raise exception 'Sign in first'; end if;
 select jsonb_build_object('id',id,'username',username,'display_name',display_name)
 into v_profile from public.vv_profiles where id=v_id;
 select count(*) into v_count from public.vv_friendships where status='accepted' and (requester=v_id or recipient=v_id);
 select count(*) into v_sent from public.vv_hearts where sender=v_id and sent_on=v_today;
 select count(*) into v_received from public.vv_hearts where recipient=v_id and sent_on=v_today;
 select coalesce(jsonb_agg(jsonb_build_object(
  'id',f.id,'status',f.status,'requester',f.requester,'recipient',f.recipient,
  'friend_id',p.id,'username',p.username,'display_name',p.display_name,
  'sent_today',exists(select 1 from public.vv_hearts h where h.sender=v_id and h.recipient=p.id and h.sent_on=v_today),
  'received_today',exists(select 1 from public.vv_hearts h where h.sender=p.id and h.recipient=v_id and h.sent_on=v_today)
 ) order by case f.status when 'accepted' then 0 else 1 end,p.username),'[]'::jsonb)
 into v_rows from public.vv_friendships f join public.vv_profiles p
 on p.id=(case when f.requester=v_id then f.recipient else f.requester end)
 where f.requester=v_id or f.recipient=v_id;
 return jsonb_build_object('profile',v_profile,'rows',v_rows,'friend_count',v_count,
 'bonus_pct',least(50,v_count)*0.5,'hearts_sent_today',v_sent,'hearts_received_today',v_received,
 'reset','00:00 UTC','limit',50);
end $$;

revoke all on function public.vv_set_profile(text,text), public.vv_search_players(text),
 public.vv_request_friend(uuid), public.vv_respond_friend(uuid,boolean),
 public.vv_remove_friend(uuid), public.vv_send_heart(uuid), public.vv_get_hub()
 from public,anon;
grant execute on function public.vv_set_profile(text,text), public.vv_search_players(text),
 public.vv_request_friend(uuid), public.vv_respond_friend(uuid,boolean),
 public.vv_remove_friend(uuid), public.vv_send_heart(uuid), public.vv_get_hub()
 to authenticated;
