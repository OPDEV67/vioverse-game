# Vioverse Patch Notes

## v1.5.1 — Continue with Google
- Added a one-click Google account sign-in option to Moonlit Bonds alongside existing email/password login.
- Uses Supabase OAuth with a return redirect to the current Vioverse game URL.
- Google OAuth requires enabling Google under Supabase Authentication → Providers and configuring Google Cloud OAuth Client ID/Secret and the Supabase callback URI. This provider setup is not yet confirmed, so the button will not complete sign-in until configured.


## v1.5.0 — Moonlit Bonds
- Created a separate Vioverse Supabase project in eu-north-1 with a server-protected friends and hearts schema.
- Added email/password signup and sign-in, unique online usernames, username search, friend requests, acceptance/decline, removal, and friend list.
- Added daily hearts: one heart to each accepted friend per UTC day, with received/sent indicators and totals.
- Added a +0.5% passive boost per accepted friend (50 friends maximum = +25%) to Wood, Moon Essence, gathering speed, and character/profession XP.
- The accepted-friend count and hearts are loaded from Supabase; client-side saves cannot add online friends or hearts.
- Existing local browser saves remain under moonveil_legacy_v02; account login does not sync gameplay progress yet.
- Important setup: configure Supabase Authentication URL Configuration to use https://opdev67.github.io/vioverse-game/ as the Site URL and allow this redirect before public email confirmation testing.

## v1.4.3 — Player Identity & UI Polish
- Added an editable player name (2–20 characters) to the Friends tab, with validation and persistence in the existing browser save.
- Added the player name to the HUD as a shortcut to Friends, and personalized the Home greeting.
- Polished profile cards, HUD hover states, buttons, panel borders, and subtle screen entrance motion.
- Added a restrained Gacha glow and reduced-motion accessibility rules; avoided flashing or continuous page redraws.
- Player names are local display names, not globally unique usernames or online accounts.

## v1.4.2 — Friends & Invitations
- Added a Friends tab to the desktop sidebar and the mobile More menu.
- Added Share invitation, using native sharing on supported phones, and Copy game link with fallback.
- Friends tab explains that real friend requests and online presence require accounts and a backend, and are not yet active.
- Existing saves, Gacha, gathering, and responsive mobile navigation are preserved.

## v1.4.1 — Automatic Mobile Experience
- Automatically adapts layout to narrow screens; no separate mobile-mode switch required.
- Adds fixed five-tab mobile navigation (Home, Gathering, Gacha, Characters, More) and a More menu for all remaining screens.
- Adds safe-area padding for iPhone home indicator and compact horizontal resource HUD.
- Stacks Skill Tree, Gacha, Shop, and companion cards into touch-friendly mobile layouts.
- Preserves all existing gameplay, local save key, and automatic update checks.

## v1.4.0 — Spirit Gacha & Stardust
- Added the playable Moonlit Exchange: exchange 250 Wood for 1 Stardust using fixed, optional amounts. No sell-all action and no real-money currency.
- Added single summons (10 Stardust) and discounted ten-pulls (90 Stardust).
- Added four summonable companions across Common, Rare, Epic, and Legendary rarities, with persistent ownership and an equipable support slot.
- Added working passive bonuses for Wood rewards, Moon Essence rewards, and gathering cycle speed.
- Added transparent 60% / 28% / 10% / 2% rarity odds, persistent pity counters (Rare+ within 10, Epic+ within 20, Legendary within 50), and +3 Stardust duplicate compensation.
- Added summon results, companion collection UI, exchange history, Stardust HUD, and save-compatible migration for existing `moonveil_legacy_v02` saves.
- Existing automatic five-second version checks and the interactive Forest Skill Tree remain intact.

## v1.3.0 — Royal Responsive Polish
- Refined the header into a compact single row on laptop and tablet widths.
- Rebalanced the companion profile and constellation layout to reduce wasted vertical space.
- Improved skill-node label contrast, selected-node clarity, button focus states, and small-screen spacing.
- Made the skill-points badge a shortcut to Forest Mastery details.
- Preserved the existing `moonveil_legacy_v02` save format and five-second update checks.
- No looping animations were added; interactions remain deliberate and responsive.

## v1.2.0 — Stable Unified Game
- Consolidated the primary game interface into a single `index.html` entry point.
- Preserved the 14 game screens, interactive Forest Skill Tree, skill upgrades/refunds, expeditions, gathering, and the existing save key.
- Removed runtime dependencies on separate interface JavaScript/CSS files.

## v0.9 — Living Journal & Save Backups
- New Moonveil Journal screen, with story milestones and discovery entries.
- Journal displays recent decisions and memories.
- Export current progress as a JSON save backup.
- Import a Vioverse save backup with confirmation and data validation.
- Existing gathering, expeditions, Awakening I, Moonwood restoration, and five-second update checks retained.

## v0.8 — Seamless Auto Updates
- Automatic version checks every five seconds when the tab is active.
