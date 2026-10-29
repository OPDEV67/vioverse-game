/* Vioverse Magic Effects v1.0.0 — cosmetic spellbook, no progression changes. */
(() => {
  'use strict';
  if (window.vvMagic) return;
  const KEY = 'vioverse_magic_loadout_v1';
  const SPELLS = [
    ['ice_spear','Ice Spear','Cryo Lance','#3ee8ff','#6390ff','❄'],
    ['prism_nova','Prism Nova','Crystal Explosion','#e64cff','#31e8ff','✦'],
    ['sakura_slash','Sakura Slash','Blossom Crescent','#ff68a6','#ffcc85','🌸'],
    ['void_helix','Void Helix','Umbral Spiral','#a240eb','#552aaf','☾'],
    ['phoenix_flare','Phoenix Flare','Firestorm','#ff682b','#ffdb5d','🔥'],
    ['solar_sigil','Solar Sigil','Golden Radiance','#ffc86c','#fff4ba','☀'],
    ['storm_arc','Storm Arc','Azure Thunder','#37aeff','#95e7ff','⚡'],
    ['verdant_bloom','Verdant Bloom','Forest Wind','#59d676','#d0f7a4','🌿'],
    ['tidal_vortex','Tidal Vortex','Ocean Whorl','#2a98ff','#90e8ff','💧'],
    ['nebula_waltz','Nebula Waltz','Starry Cosmos','#6e49eb','#fabdff','✧'],
    ['blood_moon','Blood Moon','Crimson Eclipse','#ec345c','#81256b','☽'],
    ['fae_dream','Fae Dream','Butterfly Reverie','#ee9bfc','#fff1ae','🦋'],
    ['celestial_lotus','Celestial Lotus','Sacred Blossom','#9dfc88','#fce08d','✿']
  ].map(([id,name,title,a,b,glyph]) => ({id,name,title,a,b,glyph}));
  const CHARACTERS = [
    ['Seraphine',1,'sakura_slash'],['Elowen',5,'verdant_bloom'],
    ['Lira',10,'fae_dream'],['Nyx',15,'void_helix'],['Ciel',30,'ice_spear']
  ];
  const defaultLoadout = Object.fromEntries(CHARACTERS.map(([name,,spell]) => [name,spell]));
  let loadout = {...defaultLoadout};
  try { const x=JSON.parse(localStorage.getItem(KEY)||'{}');
    if(x&&typeof x==='object') for(const name of Object.keys(defaultLoadout))
      if(SPELLS.some(sp=>sp.id===x[name])) loadout[name]=x[name];
  } catch (_) { /* Private browsing may block storage. */ }
  let selectedCharacter = 'Seraphine';
  let selectedSpell = loadout[selectedCharacter];
  let castingTimeout = 0;
  const find = id => SPELLS.find(sp=>sp.id===id) || SPELLS[0];
  const currentLevel = () => {
    try { return typeof level==='function' && typeof s!=='undefined' && s ? level(s.xp) : 1; }
    catch (_) { return 1; }
  };
  const canUse = name => {
    const c=CHARACTERS.find(x=>x[0]===name);return c && currentLevel()>=c[1];
  };
  const image = (id,cl='') => `<img class="${cl}" data-vv-spell-image="${id}" src="assets/spells/${id}.webp" alt="" decoding="async" loading="lazy" draggable="false">`;
  // A lightweight procedural fallback keeps the spellbook functional before artwork finishes downloading.
  function fallback(sp) {
    const pieces = Array.from({length:15},(_,i)=>{
      const theta=i*Math.PI*2/15,rad=61+(i%3)*18;
      const x=150+Math.cos(theta)*rad,y=150+Math.sin(theta)*rad;
      return `<path d="M${x.toFixed(1)} ${(y-16).toFixed(1)}l7 16 -7 16 -7 -16z" fill="${i%2?sp.a:sp.b}" opacity=".8"/>`;
    }).join('');
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><radialGradient id="g"><stop stop-color="${sp.b}" stop-opacity=".6"/><stop offset="1" stop-color="${sp.a}" stop-opacity="0"/></radialGradient><linearGradient id="c" x2="1" y2="1"><stop stop-color="${sp.a}"/><stop offset="1" stop-color="${sp.b}"/></linearGradient></defs><circle cx="150" cy="150" r="132" fill="url(#g)"/><g fill="none" stroke="url(#c)" stroke-width="5" opacity=".8"><ellipse cx="150" cy="150" rx="115" ry="42" transform="rotate(-28 150 150)"/><ellipse cx="150" cy="150" rx="112" ry="43" transform="rotate(42 150 150)"/></g>${pieces}<path d="M150 28L187 111 271 150 187 189 150 271 113 189 29 150 113 111Z" fill="url(#c)" opacity=".85"/><path d="M150 58L178 125 242 150 178 175 150 242 122 175 58 150 122 125Z" fill="#fff" opacity=".6"/><circle cx="150" cy="150" r="26" fill="#fff" opacity=".9"/></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
  document.addEventListener('error',e=>{
    const img=e.target;
    if(img?.dataset?.vvSpellImage && !img.dataset.vvMagicFallback){
      img.dataset.vvMagicFallback='1'; img.src=fallback(find(img.dataset.vvSpellImage));
    }
  },true);
  const css = `
  #vv-magic-open{position:fixed;right:19px;bottom:84px;z-index:94;border:1px solid #e3b1ff;border-radius:999px;background:linear-gradient(125deg,#3b1a63,#15102e);color:#ffe7ff;padding:12px 17px;font:600 13px system-ui;box-shadow:0 0 20px #ba71ff7a;cursor:pointer;letter-spacing:.04em}
  #vv-magic-open:hover{filter:brightness(1.22)}
  #vv-magic-dialog[hidden]{display:none!important}
  #vv-magic-dialog{position:fixed;inset:0;z-index:130;display:grid;place-items:center;background:#05030bdc;padding:16px;backdrop-filter:blur(9px)}
  .vv-magic-panel{width:min(940px,100%);max-height:min(92vh,990px);overflow:auto;border:1px solid #c68cf5;border-radius:18px;background:radial-gradient(circle at 75% 0%,#392251,#130d22 65%);color:#f9eafd;box-shadow:0 18px 80px #000c;padding:20px}
  .vv-magic-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
  .vv-magic-heading h2{font-size:clamp(19px,4vw,29px);margin:0 0 5px;color:#fff4ff}
  .vv-magic-heading p{margin:0 0 14px;color:#d7c2e5;font-size:13px}
  .vv-magic-close{border:1px solid #b78adf;background:#392550;color:white;border-radius:8px;min-width:39px;height:39px;cursor:pointer}
  .vv-magic-hero{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:12px 14px;border:1px solid #71518e;border-radius:12px;background:#170d2c;margin-bottom:16px}
  .vv-magic-hero label{font-size:13px;color:#e5caef}.vv-magic-hero select{background:#27123e;color:#fff;border:1px solid #a672d4;border-radius:8px;padding:9px;margin-left:9px;max-width:200px}
  .vv-magic-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(146px,1fr));gap:10px}
  .vv-magic-card{display:flex;flex-direction:column;gap:5px;align-items:center;background:linear-gradient(135deg,#2d1948,#150c29);border:1px solid #735597;color:#eee2fa;border-radius:12px;padding:8px 8px 11px;text-align:center;cursor:pointer;min-width:0}
  .vv-magic-card[aria-pressed="true"]{border:2px solid #f3b5fc;background:linear-gradient(135deg,#513173,#1e1039);box-shadow:0 0 14px #b157e25e;padding:7px 7px 10px}
  .vv-magic-card img{display:block;object-fit:contain;width:100%;height:109px;filter:drop-shadow(0 0 13px #bf87ff66)}
  .vv-magic-card strong{font-size:13px}.vv-magic-card small{color:#bca2d0;font-size:11px}
  .vv-magic-actions{position:sticky;bottom:-20px;display:flex;align-items:center;justify-content:flex-end;gap:9px;flex-wrap:wrap;padding:16px 0 0;margin-top:14px;background:linear-gradient(transparent,#150d25 15%)}
  .vv-magic-btn{border:1px solid #b37ee2;background:linear-gradient(#8142ad,#4b247d);padding:10px 14px;border-radius:9px;font-weight:600;color:white;cursor:pointer}
  .vv-magic-btn:disabled{opacity:.5;cursor:not-allowed}.vv-magic-btn.alt{background:#302344}
  .vv-magic-caption{font-size:11px;color:#bca2d0;margin-right:auto}
  .vv-magic-portrait-aura{position:absolute!important;inset:0!important;display:flex;justify-content:center;align-items:center;pointer-events:none;overflow:hidden;z-index:1;opacity:.45;mix-blend-mode:screen}
  .vv-magic-portrait-aura img{position:relative!important;width:90%!important;height:90%!important;object-fit:contain!important;opacity:.75;filter:drop-shadow(0 0 10px var(--vv-magic-glow,#bb7cff));animation:vv-magic-breathe 5s ease-in-out infinite}
  .vv-archive-art{position:relative}
  #vv-magic-cast{position:fixed;inset:0;z-index:125;display:grid;place-items:center;pointer-events:none;isolation:isolate}
  #vv-magic-cast[hidden]{display:none}
  #vv-magic-cast:before{content:'';position:absolute;inset:0;background:radial-gradient(circle,#ab7aff23,transparent 62%)}
  #vv-magic-cast img{position:relative;object-fit:contain;width:min(70vmin,720px);height:min(70vmin,720px);filter:drop-shadow(0 0 30px var(--vv-magic-glow,#b888ff));animation:vv-magic-burst 1.08s cubic-bezier(.14,.7,.13,1) both}
  #vv-magic-cast span{position:absolute;bottom:12%;font:700 clamp(16px,4vw,32px) Georgia,serif;color:white;text-shadow:0 0 13px var(--vv-magic-glow,#b888ff)}
  @keyframes vv-magic-burst{0%{opacity:0;transform:scale(.35) rotate(-18deg)}29%{opacity:1}70%{opacity:1;transform:scale(1.09) rotate(7deg)}100%{opacity:0;transform:scale(1.32) rotate(12deg)}}
  @keyframes vv-magic-breathe{50%{opacity:1;transform:scale(1.08)}}
  .vv-reduce-motion .vv-magic-portrait-aura img,.vv-reduce-motion #vv-magic-cast img{animation:none!important}
  .vv-hide-particles .vv-magic-portrait-aura{display:none!important}
  @media(prefers-reduced-motion:reduce){.vv-magic-portrait-aura img,#vv-magic-cast img{animation:none!important}}
  @media(max-width:640px){#vv-magic-open{right:12px;bottom:82px;padding:10px 12px;font-size:12px}.vv-magic-panel{padding:13px}.vv-magic-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.vv-magic-card img{height:92px}}
  `;
  const style=document.createElement('style');style.id='vv-magic-css';style.textContent=css;document.head.appendChild(style);
  const dock=document.createElement('button');dock.type='button';dock.id='vv-magic-open';dock.textContent='✦ Spellbook';dock.setAttribute('aria-haspopup','dialog');document.body.appendChild(dock);
  const dialog=document.createElement('div');dialog.id='vv-magic-dialog';dialog.hidden=true;dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','Character Spellbook');document.body.appendChild(dialog);
  const cast=document.createElement('div');cast.id='vv-magic-cast';cast.hidden=true;cast.setAttribute('aria-hidden','true');document.body.appendChild(cast);
  function setModal(open) {
    dialog.hidden=!open;dock.setAttribute('aria-expanded',String(open));
    if(open) {renderDialog();dialog.querySelector('.vv-magic-close')?.focus();}
    else dock.focus();
  }
  function renderDialog(){
    const lvl=currentLevel();
    const options=CHARACTERS.map(([name,min])=>`<option value="${name}" ${name===selectedCharacter?'selected':''} ${min>lvl?'disabled':''}>${name}${min>lvl?` (Lv. ${min})`:''}</option>`).join('');
    const current=loadout[selectedCharacter],chosen=find(selectedSpell);
    dialog.innerHTML=`<section class="vv-magic-panel"><div class="vv-magic-heading"><div><h2>✦ Character Spellbook</h2><p>Choose a magical aura and cast a spectacular preview. All effects are cosmetic.</p></div><button type="button" class="vv-magic-close" aria-label="Close spellbook">✕</button></div><div class="vv-magic-hero"><label>Character <select id="vv-magic-character">${options}</select></label><span style="font-size:12px;color:#d6bae8">Equipped: <strong>${find(current).name}</strong></span></div><div class="vv-magic-grid">${SPELLS.map(sp=>`<button class="vv-magic-card" type="button" data-vv-pick="${sp.id}" aria-pressed="${sp.id===selectedSpell}">${image(sp.id)}<strong>${sp.glyph} ${sp.name}</strong><small>${sp.title}</small></button>`).join('')}</div><footer class="vv-magic-actions"><span class="vv-magic-caption">Cosmetic only · Saves separately</span><button type="button" class="vv-magic-btn alt" id="vv-magic-preview">✧ Cast ${chosen.name}</button><button type="button" class="vv-magic-btn" id="vv-magic-equip" ${current===selectedSpell?'disabled':''}>${current===selectedSpell?'✓ Equipped':'✦ Equip for '+selectedCharacter}</button></footer></section>`;
  }
  function persist() {try{localStorage.setItem(KEY,JSON.stringify(loadout))}catch(_) {}}
  function syncPortraits(){
    const main=document.getElementById('main');if(!main)return;
    const lvl=currentLevel();
    const all=[...main.querySelectorAll('.vv-archive-art,.vv-story-collection .vv-archive-art')];
    for(const wrapper of all){
      const owner=wrapper.closest('.vv-story-collection');
      if(!owner)continue;
      const art=wrapper.querySelector('img[src*="assets/"]');if(!art)continue;
      const character=CHARACTERS.find(([name])=>art.getAttribute('src').toLowerCase().includes('/'+name.toLowerCase()+'.'))?.[0];
      if(!character||!canUse(character))continue;
      const spell=find(loadout[character]);
      let overlay=wrapper.querySelector('.vv-magic-portrait-aura');
      if(!overlay){overlay=document.createElement('span');overlay.className='vv-magic-portrait-aura';overlay.setAttribute('aria-hidden','true');wrapper.appendChild(overlay)}
      if(overlay.dataset.spell!==spell.id){overlay.dataset.spell=spell.id;overlay.style.setProperty('--vv-magic-glow',spell.a);overlay.innerHTML=image(spell.id);}
    }
  }
  function play(id){
    const sp=find(id);window.clearTimeout(castingTimeout);cast.hidden=false;cast.style.setProperty('--vv-magic-glow',sp.a);
    cast.innerHTML=`${image(sp.id)}<span>${sp.name}</span>`;
    cast.querySelector('img').style.animation='none';
    void cast.offsetWidth; cast.querySelector('img').style.animation='';
    castingTimeout=window.setTimeout(()=>{cast.hidden=true;cast.replaceChildren()},1120);
    if(window.vvAudio?.effect) try{window.vvAudio.effect('quest')}catch(_){}
  }
  dock.addEventListener('click',()=>setModal(true));
  dialog.addEventListener('click',e=>{
    if(e.target===dialog||e.target.closest('.vv-magic-close')){setModal(false);return}
    const pick=e.target.closest('[data-vv-pick]');
    if(pick){selectedSpell=pick.dataset.vvPick;renderDialog();return}
    if(e.target.closest('#vv-magic-preview')){play(selectedSpell);return}
    if(e.target.closest('#vv-magic-equip')){
      if(!canUse(selectedCharacter))return;
      loadout[selectedCharacter]=selectedSpell;persist();renderDialog();syncPortraits();play(selectedSpell);
    }
  });
  dialog.addEventListener('change',e=>{
    if(e.target.id==='vv-magic-character' && canUse(e.target.value)){
      selectedCharacter=e.target.value;selectedSpell=loadout[selectedCharacter];renderDialog();
    }
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!dialog.hidden)setModal(false)});
  const main=document.getElementById('main');
  if(main){const observer=new MutationObserver(syncPortraits);observer.observe(main,{childList:true});syncPortraits()}
  window.vvMagic={spells:SPELLS.map(({id,name})=>({id,name})),cast:play,open:()=>setModal(true),getLoadout:()=>({...loadout})};
})();