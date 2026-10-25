# Vioverse

**Current release: v1.3.0 — Royal Responsive Polish**

Vioverse is a gothic-purple fantasy gathering and exploration game featuring Seraphine, Moonwood Legacy progression, expeditions, discoveries, a save journal, and an interactive Forest Skill Tree.

## Run locally

1. Clone this repository with GitHub Desktop.
2. Open the clone with **Repository → Show in Explorer**.
3. Double-click `server.bat` (Python 3 is required).
4. Use the local URL printed by the launcher. If port 3000 is occupied, it will try port 3001.

The local launcher serves files from its own repository folder, watches for file changes, and checks `origin/main` about every five seconds. Automatic Git sync is fast-forward-only and pauses if tracked local edits are present; it will not force-overwrite those edits. If syncing is paused, use GitHub Desktop to review and pull changes.

You can also open `index.html` directly, but the local server is recommended for updater and live-reload behavior.

## Saves

Progress is stored in browser local storage under `moonveil_legacy_v02`. Use the same browser profile and same local address/port to keep using that save. Switching from `localhost:3000` to `localhost:3001` creates a separate browser storage origin. The Journal includes save export/import tools for backups.

## Current release highlights

- Compact responsive HUD and gothic-purple visual system.
- Interactive circular Moonwood constellation with selectable skill nodes.
- Forest Mastery upgrades and refunds.
- Home, Characters, Skill Tree, Expeditions, Discoveries, Gathering, Inventory, Missions, Legacy, Journal, Gacha, Shop, Patch Notes, and Update Game screens.
- Existing five-second version/update checks and save compatibility.

## Deploy to GitHub Pages

Publish the repository root in **Settings → Pages**. The online updater checks the published `version.json`; local auto-sync is handled by `server.bat` and `live_server.py`.
