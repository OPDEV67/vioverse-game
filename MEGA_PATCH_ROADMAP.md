# The Forest Remembers — Mega Patch v1.7.0

This release turns several previously decorative systems into a connected gameplay loop while preserving the `moonveil_legacy_v02` browser save.

## Playable in v1.7.0

- **Working:** Seraphine continues automatic Woodcutting, while manual **Mining (Player Lv. 5)**, **Fishing (Lv. 10)**, and **Herbalism (Lv. 15)** award separate materials and profession XP. Cooldowns are 35, 40, and 45 seconds respectively and do not grant main player XP.
- **Inventory & crafting:** Three new resources (Moonstone, Silverscale, Moonpetals) and four unique recipes (Whisperlight Lantern, Forest Talisman, Silver Fishing Hook, Starwater Charm). Items are crafted once per save. Only one equipped item may be active; the Forest Talisman has a modest +2% Wood boost, and the Hook shortens the fishing work cooldown by five seconds.
- **The Living Moonwood:** After the existing Ancient Tree restoration, players may permanently restore three resource-gated sites: Whisperlight Grove, Silverleaf Bridge, and Moonpetal Garden. Home shows the evolving world, restored landmark symbols, story choices already made, and a cosmetic moon phase.
- **Character memories:** All five story companions offer unlock-level-gated optional conversations, five memories each. A character can share one new memory every 12 hours. These do not award XP, materials, stat boosts, or mandatory daily login streaks.
- **Achievements:** Eight tracked cosmetic milestones, visible in Missions.
- **Audio:** The original Web Audio synthesizer reliably plays an in-browser Moonwood tune and forest ambience without trying to load the six currently absent MP3 files. Open Sound → Enable Audio → Play Moonwood Theme to satisfy browser autoplay restrictions. The composed MP3 soundtrack is not yet deployed.
- **Save reliability:** Existing saves remain valid. Export/import now preserves new materials, crafting, restoration state, bonds, companion ownership, and gacha history. The existing save key has not changed.
- **Testing:** Run `node scripts/check-mega-patch.mjs` locally, or use the automated Mega Patch GitHub Actions workflow.

## Outstanding checklist items — not represented as completed

- Original full-resolution portraits and expression sheets for Elowen, Lira, Nyx and Ciel; the game still uses its existing small portrait SVGs.
- Production MP3 soundtrack / high-fidelity Foley instead of procedural Web Audio.
- Deep branching talent paths for every profession, crafting recipe expansion, character animation, and more story chapters.
- Secure server-side mailbox claims, full cloud save sync with merge/conflict resolution and account deletion workflows.
- Truly shared cooperative projects, online social events and push notifications (these require backend implementation and permissions).
- Full cross-browser/mobile and accessibility playtesting, performance profiling, and anti-tampering guarantees for locally saved rewards.
- A more complete itemized inventory with multiple equipment slots, expanded expeditions and additional discoverable regions.
- Large-scale events and seasonal content built with persistent server-side delivery.

## Balance and preservation guarantees

- **No acceleration for new players:** The Welcome Mail remains 3 Stardust plus cosmetic keepsakes. Working materials do not award player XP, and companion conversations have cosmetic effects only.
- Existing story unlock milestones at Player Levels 1, 5, 10, 15 and 30 remain unchanged.
- The local-save model does not securely prevent user-controlled resets, edits or clock changes; do not market rewards or cooldowns as server-verified.
- Back up your save via the Journal before importing a backup. Imported files should only be trusted if they come from the game.

