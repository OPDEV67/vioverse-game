# Moonlit Mastery & Starwater Expanse — v1.8.0

This patch first fixes a startup regression introduced during skill-point normalization: startup and imported-save calculations now derive the profession level directly, without reading the `level` constant before its initialization. The original `moonveil_legacy_v02` save key is unchanged.

## Implemented in v1.8.0

- **Moonlit Mastery:** Nine permanent talents in three prerequisite-linked branches: Gatherer, Wayfinder and Artisan. Each talent costs one Skill Point, shows its level/prerequisite lock, and has a real gameplay effect. A 10 Moon Essence respec refunds these new talents without resetting older Forest Mastery speed ranks.
- **Gatherer:** +5% Wood, +5% Essence, and Lunar Butterfly discoveries every 30 cycles.
- **Wayfinder:** Discoveries every 16 cycles, +1 Essence on discoveries, and an optional +1 Star Shard on the first Starfall Ridge mine choice.
- **Artisan:** +1 material every third manual profession job and one-unit discounts for recipe ingredients whose base cost is at least five. Starforged also improves selected keepsake bonuses and the fishing-hook cooldown.
- **Starwater Expanse:** World Map unlocks after Silverleaf Bridge restoration. Three one-time exploration choices offer different material/story outcomes at Starfall Ridge, Whispering Marsh and Prism Pool.
- **Astral Beacon finale:** Chart all three locations and spend 4 Star Shards, 4 Glowcaps and 1 Prism Crystal to restore the Beacon. Completion is persisted and shown in Home, Missions and Journal.
- **Crafting expansion:** Adds Star Shards, Glowcaps and Prism Crystals plus the Astral Compass, Starfall Pick and Glowcap Lantern keepsakes. Existing one-item equipment rules remain.
- **Persistence and checks:** Sanitizes new materials, equipment IDs, route choices and talent IDs; save import recalculates remaining Skill Points. The dependency-free regression script now checks startup ordering, talent prerequisites and accounting, discounts, map gating, rewards, sanitization and Beacon completion.

## Remaining work — not represented as complete

- Full-resolution original portraits and expression sheets for Elowen, Lira, Nyx and Ciel; existing smaller portrait assets remain.
- Production MP3 soundtrack / high-fidelity Foley beyond the procedural Web Audio soundtrack.
- Profession-specific mastery trees beyond the nine shared Moonlit Mastery talents; additional crafting recipes, equipment slots and deeper region chapters.
- Secure server-side mailbox claims, full cloud-save sync with merge/conflict resolution, and account-deletion workflows.
- Truly shared cooperative projects, online social events and push notifications (these require backend implementation and permissions).
- Full hands-on cross-browser/mobile and accessibility playtesting, performance profiling, and anti-tampering guarantees for locally saved rewards.
- Large-scale events and seasonal content with persistent server-side delivery.

## Balance and preservation guarantees

- The existing save key remains `moonveil_legacy_v02`; the patch does not intentionally reset existing player progress.
- New Mastery points use the existing profession-level Skill Point pool. New talents and old Forest Mastery ranks are accounted for separately so spending a point cannot duplicate it.
- The Astral Beacon is a one-time resource-gated story restoration. Each Starwater location can be explored only once per save.
- The local-save model does not securely prevent user-controlled resets, edits or clock changes; rewards and cooldowns are not server-verified.

---

# The Forest Remembers — Mega Patch v1.7.0 (previous release)

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
- Profession-specific mastery trees beyond the shared nine-node Moonlit Mastery, crafting recipes beyond the three new keepsakes, character animation, and deeper story chapters.
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

