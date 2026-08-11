# Changelog

## v5.0 - Content Drop Update

### New Systems

**Artifacts**
- 15 unique artifacts with passive proc effects (Echo Strike, Shatter, Midas Touch, Critical Mass, Soul Siphon, Blood Pact, Treasure Hunter, Dust Devil, Lucky Charm, Pity Breaker, Golden Hour, Void Lens, Time Dilation, Fortune's Favor, Overflow)
- 3 rarity tiers: Rare (20 shards), Epic (50 shards), Legendary (150 shards)
- Level up artifacts to level 5 for stronger effects
- 1 artifact slot by default, upgradeable to 3 via shop
- Shards drop from: boss kills (1-2), world bosses (5-15), dungeon clears (3-12), tower every 10 floors
- Unlocks at level 15

**Aura Awakening**
- Feed duplicate auras into equipped ones to power them up
- 3 tiers: Awakened (1.5x, 3 dupes + 100 dust), Enlightened (2x, 5 dupes + 500 dust), Transcended (3x, 10 dupes + 2K dust)
- Both ability value and power stat are multiplied
- Stars display on awakened auras in inventory
- Dedicated panel in Workshop tab
- Unlocks at level 12

**Battle Pass**
- 30 levels, 500 XP per level
- Free and Premium reward tracks (premium costs 500 gems)
- 3 daily challenges (reset every 24h): 50-80 XP each
- 4 weekly challenges (reset every 7 days): 300-400 XP each
- Rewards include: gold, gems, dust, enchant stones, artifact shards
- Level 30 premium reward: 500 gems, 15K dust, 15 enchant stones, 30 artifact shards

**Boss Rush**
- 10 waves of escalating bosses in the Battle tab
- HP scales from 50K to 25M, damage from 5K to 125K
- Per-wave gold doubles each wave (10K → 5.12M total)
- Milestone rewards at waves 3, 5, 7, and 10
- Best wave tracked permanently
- 10-minute cooldown between attempts
- Auto-attack and flee options
- Unlocks at level 20

### New Content

**Zone 8: The Rift**
- Endgame zone requiring 750K power
- 4 enemies: Rift Spawn, Void Wraith, Reality Shard, THE ANOMALY (boss)
- Unique mechanic: all enemies always spawn with a random modifier
- 16 exclusive auras (common through legendary)
- 6 exclusive gear pieces (legendary through cosmic)
- Rift gear set bonus: +60% All, +8 Luck, +10% Crit
- New dungeon: The Rift Tear (750K power, 100M HP boss, 50M gold + 30K gems reward)

### Reworked

**Tower**
- Now features real-time combat with HP bars, attack button, and auto-climb
- Full heal between every floor (idle RPG tower style)
- If you die, you stay at your floor and try again
- Artifact shards drop every 10 floors
- Gems every 5 floors as before

### Bug Fixes
- Fixed old dungeon system dead code referencing missing HTML elements
- Fixed duplicate ascend button event listener (was firing twice)
- Fixed inconsistent artifact proc guard in engine
- Auto-roll now uses full multi-roll count with multi-card display
- Dungeon completion toast now shows artifact shard drops
- World boss kill toast now shows artifact shard drops
- All shard drops properly tracked for Battle Pass challenges
