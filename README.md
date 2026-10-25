## v1.6.0 — Moonlit Atelier UI

The interface now uses the repository's original **Seraphine** portrait (`assets/seraphine.webp`), **Moonwood** scenery (`assets/moonforest.svg` and `assets/world.webp`), and decorative elements to create a coherent midnight-blue / moon-gold fantasy HUD. Home has a new dashboard with live level progress and upcoming character unlocks. Navigation, resources, collection cards, gacha, panels and mobile layouts have been restyled. Elowen, Lira, Nyx and Ciel currently use low-resolution placeholder SVG portraits; replacing them with original high-resolution character art will further improve visual fidelity. Existing local saves remain compatible.

## Vioverse Audio (v1.5.3)

Use **♫ Sound** to enable audio and adjust music, forest ambience and SFX volumes. Settings persist per browser. Music starts only with player consent and pauses in hidden tabs. The audio player expects six MP3 files in `assets/audio/`. The GitHub Actions workflow `.github/workflows/build-audio.yml` generates them with `scripts/generate_audio.py` and commits them to the repository. If the workflow has not yet published the MP3s, the game plays lightweight Web Audio synthesizer fallbacks instead. The source music and sound effects are original procedural compositions, not ElevenLabs output.

# Vioverse

**Current release: v1.5.2 — Character & Spirit Collection**

Vioverse is a gothic-purple fantasy gathering and exploration game featuring Seraphine, Moonwood Legacy progression, expeditions, discoveries, a persistent companion collection, and an interactive Forest Skill Tree.

## Run locally

1. Clone this repository with GitHub Desktop.
2. Open the clone with **Repository → Show in Explorer**.
3. Double-click `server.bat` (Python 3 is required).
4. Use the local URL printed by the launcher. If port 3000 is occupied, it will try port 3001.

The local launcher serves files from its own repository folder, watches for file changes, and checks `origin/main` about every five seconds. Automatic Git sync is fast-forward-only and pauses if tracked local edits are present; it will not force-overwrite those edits. If syncing is paused, use GitHub Desktop to review and pull changes.

You can also open `index.html` directly, but the local server is recommended for updater and live-reload behavior.

## Saves

Progress is stored in browser local storage under `moonveil_legacy_v02`. This release adds Stardust, summon pity, owned companions, equipped companion passives, and exchange history to the existing save without changing the key. Use the same browser profile and local address/port to keep using that save. Switching from `localhost:3000` to `localhost:3001` creates a separate browser storage origin. The Journal includes save export/import tools.

## Mobile layout

On iPhone and Android, Vioverse automatically shows a compact HUD and a bottom navigation bar with Home, Gathering, Gacha, Characters, and More. The More menu contains the other game screens. The layout responds to screen width; there is no separate mobile build or switch. Desktop keeps the original sidebar.

## Character & Spirit Collection

Use the new **Collection** tab (or mobile **More → Collection**) to browse all story characters and summonable spirits, read their lore, inspect specials and bonuses, see unlock requirements and equip discovered spirits. Elowen, Lira, Nyx and Ciel unlock automatically at Player Levels 5, 10, 15 and 30. Only Seraphine currently has active story-character bonuses; the others' traits are previews. Collection titles progress Starter → Apprentice → Adept → Expert → Master → Legendary based on collected entries, and are cosmetic only.

## Google Sign-In setup

The Friends login now includes **Continue with Google**. To activate it, open the [Vioverse Supabase Google provider](https://supabase.com/dashboard/project/vjyoaxgmubunodxldzmj/auth/providers) and enable Google. Create a **Web application** OAuth client in [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Under **Authorized redirect URIs**, add `https://vjyoaxgmubunodxldzmj.supabase.co/auth/v1/callback`. Copy the OAuth Client ID and Client Secret into Supabase's Google provider settings and save. Google OAuth consent-screen configuration and testing/publishing requirements also apply. The app return URL remains `https://opdev67.github.io/vioverse-game/` under Supabase Auth → URL Configuration. Do not share your Google Client Secret or put it in the game's public GitHub repository.

## Moonlit Bonds — Online Friends and Hearts

Vioverse has a separate Supabase project for its online social system. Open **Friends** to create an account (email and password), sign in, claim a unique username, search players, send and accept friend requests, and exchange one heart per accepted friend per UTC day. You can have up to **50 accepted friends**. Each accepted friend grants **+0.5%** to Wood, Moon Essence, gathering speed and XP earned, up to **+25%**. The backend enforces friendships and hearts using authenticated RPC functions, uniqueness constraints, and table RLS. Hearts are social gifts, not currency yet.

**Required Auth setup before email verification works on the public site:** In the Vioverse Supabase project dashboard, open Authentication → URL Configuration, set **Site URL** to `https://opdev67.github.io/vioverse-game/`, and add the same URL to the **Redirect URLs** allowlist. The code supplies `emailRedirectTo` on signup, but the allowlist is managed in the Supabase dashboard. Test registration and confirmation on the public URL after configuring this.

The game still stores Wood, summons, and story progress locally using the original `moonveil_legacy_v02` save key. Logging into a Vioverse account does **not** sync those saves across devices yet. Online friend data is separate and server-backed.

Backend SQL: [`supabase/moonlit_bonds.sql`](supabase/moonlit_bonds.sql).

## Player name and UI polish

Open **Friends** to choose a local display name (2–20 characters). It appears in the header and Home greeting, and is stored with your existing save. This is not an online username or account. The UI includes subtle transitions, responsive profile cards, and reduced-motion support.

## Friends and invitations

Open **Friends** from the desktop sidebar or the mobile **More** menu to share the public Vioverse game link. The Share invitation button uses your device's share sheet where available, with Copy game link as a fallback. Friends lists, friend requests, and online status are not yet implemented; they will require player accounts and an online backend.

## Current release highlights

- Responsive gothic-purple HUD and interactive circular Moonwood constellation.
- Forest Mastery upgrades and refunds.
- Exchange 250 Wood for 1 Stardust using fixed exchange amounts; no sell-all button.
- Single summons cost 10 Stardust; ten summons cost 90.
- Four summonable companions with persistent ownership and working passive effects.
- Published summon odds: Common 60%, Rare 28%, Epic 10%, Legendary 2%.
- Pity guarantees: Rare+ within 10 pulls, Epic+ within 20, Legendary within 50; duplicates return 3 Stardust.
- Home, Characters, Skill Tree, Expeditions, Discoveries, Gathering, Inventory, Missions, Legacy, Journal, Gacha, Shop, Patch Notes, and Update Game screens.
- Five-second published-version checks and save compatibility.

## Deploy to GitHub Pages

Publish the repository root in **Settings → Pages**. The online updater checks the published `version.json`; local auto-sync is handled by `server.bat` and `live_server.py`.
