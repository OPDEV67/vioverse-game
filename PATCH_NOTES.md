# Vioverse Patch Notes

## v1.6.2 — Moonlit Companion Gallery
- Redesigned the four story companion cards on Home with ornate moonlit filigree frames, character portraits, circular avatars, rarity colors, lore, and unlock indicators.
- Characters unlock automatically at existing level milestones (5, 10, 15, 30), and unlocked characters appear in full color; locked cards are dimmed.
- Collection displays uncollected story characters in grayscale with clear NOT OBTAINED badges and level requirements. Obtained characters appear in full color with framed portraits and avatars.
- Uses the existing portrait assets and shared `assets/filigree-frame.svg`. The newly generated character-sheet illustration is a visual design reference, not yet shipped as separate full-resolution portrait files.
- No save changes or altered progression.


## v1.6.1 — Moonveil Settings & Mailbox
- Added separate Settings and Mailbox pages in desktop navigation and mobile More menu, with top-HUD shortcuts and unread mail indicator.
- Settings: Audio mixer shortcut, visual accessibility, compact mode, summon confirmations, offline summary and in-game notice preferences, plus account/save links and About.
- Added a welcome letter from Seraphine: claim 3 Stardust (less than one 10-Stardust summon), a Moonborn cosmetic title and a welcome badge. No XP, levels, skill points or stat bonuses.
- Mail has Inbox, Rewards and Archive categories. The welcome reward is tracked in the existing local save and appears in exported backups.
- **Limitation:** The welcome gift is only once per local save, not securely once per account; server-side claim verification will be needed before cross-device or anti-abuse rewards.
- No existing player progress is reset.


## v1.6.0 — Moonlit Atelier UI
- Replaced the old flat purple presentation with a cohesive midnight-blue, silver and moon-gold dark-fantasy interface across the game.
- New Moonwood home dashboard featuring the existing forest illustration, original Seraphine portrait, live player / Woodcutting progress and next character unlock.
- Redesigned top resource HUD with readable labels, refined navigation, ornate panels, clearer progress bars and polished action buttons.
- Improved companion cards, story character gallery and Collection artwork framing, preserving the original Seraphine image.
- Retained existing assets and game saves; no replacement or re-creation of original character art. Other four portraits are small placeholder assets and may need future high-resolution originals.
- Sound settings remain accessible on mobile. Collector rank starts at Starter.


## v1.5.3 — Moonwood Audio
- Added in-game audio settings with a Sound button, music / ambience / SFX volume sliders, mute control, and saved preferences.
- Audio begins only after player opt-in and pauses when the tab is hidden.
- Original Whispers of Moonwood theme, forest ambience, quest, level-up, discovery and friend-accepted sound effects are wired to gameplay.
- Added reproducible GitHub Actions workflow to synthesize and publish the six original MP3s; a Web Audio fallback works before the assets are available.
- Existing local saves remain compatible.


## v1.5.2 — Character & Spirit Collection
- New Collection tab on desktop and mobile More menu: all five story characters and four summonable spirits in one archive.
- Named story companions unlock automatically at Player Levels 5, 10, 15 and 30; collection cards show their stories and special abilities.
- Active spirit bonuses and equip buttons are visible; future character specials are clearly marked as previews, not active gameplay bonuses.
- Collector titles: Starter → Apprentice → Adept → Expert → Master → Legendary. Cosmetic progression based on number of collected entries.
- Existing saves remain compatible.


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
