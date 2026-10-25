# Vioverse

Vioverse v0.7 — Moonlit Companions.

Open `index.html` locally to play. Host the repository root on GitHub Pages for online updates. Keep `assets/` and `version.json` next to `index.html`.

## Deployment
Copy the extracted files into the GitHub Desktop clone of `vioverse-game`, commit, and push to `main`. GitHub Pages will deploy automatically when configured.

## Saves
Uses the existing `moonveil_legacy_v02` browser localStorage key for continuity. Do not clear site data. Local file saves and GitHub Pages saves are separate origins.


### Auto-updates
GitHub Pages deploys committed changes. Open tabs check version.json every 5 seconds while visible and reload when a new build is published. Increment both version and build in version.json for every release. Saves are local to the same browser and origin.
