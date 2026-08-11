# RNG RPG

A browser-based RNG RPG inspired by Roblox RNG games. Roll for auras, fight enemies, hatch pets, enchant gear, craft artifacts, awaken auras, and chase impossibly rare drops.

## Play Now

Open `index.html` in any modern browser. No server, no install, no dependencies. Everything saves to localStorage.


## Features

### Rolling
- 230+ auras across 8 zones + global pool
- 18 rarity tiers from Common (1 in 2) to REALITY (1 in 100 trillion)
- 10 modifiers (Shiny through Divine, up to 100x power multiplier)
- Spinning reel animation on manual rolls
- Multi-roll (up to x10 per click, upgradeable) — auto-roll uses full multi-roll count
- Auto-roll (upgradeable speed)
- Pity system (guaranteed rare+ after threshold)
- Zone-specific aura pools
- Lucky Aura rotation (3x chance for a random rare+ aura)
- Seasonal limited auras
- Dry streak counter

### Combat
- 8 zones with escalating enemies (Plains through The Rift)
- The Rift: endgame zone where all enemies always have random modifiers
- Elite enemies (5 types: Enraged, Armored, Swift, Glowing, Cursed)
- 6 combat skills with cooldowns
- Auto-fight (shop upgrade)
- Lifesteal, crit, defense mechanics
- Gear drops from enemies
- DPS and gold/min live tracker

### Artifacts
- 15 unique artifacts with passive proc effects
- Combat procs: Echo Strike, Shatter, Critical Mass, Blood Pact, Soul Siphon, Midas Touch, Treasure Hunter
- Rolling procs: Lucky Charm, Pity Breaker
- Passive procs: Golden Hour, Void Lens, Time Dilation, Dust Devil, Fortune's Favor, Overflow
- Crafted from Artifact Shards (dropped by bosses, world bosses, dungeons, tower)
- 3 rarity tiers with scaling shard costs (20/50/150)
- Level up to 5 for stronger effects
- 1-3 equip slots (upgradeable via shop)
- Unlocks at level 15

### Aura Awakening
- Feed duplicate auras into equipped ones to power them up
- 3 tiers: Awakened (1.5x), Enlightened (2x), Transcended (3x)
- Multiplies both ability value and power stat
- Stars display on awakened auras
- Unlocks at level 12

### Battle Pass
- 30 levels with free and premium reward tracks
- Premium costs 500 gems to unlock
- 3 daily challenges (reset every 24h, 50-80 XP each)
- 4 weekly challenges (reset every 7 days, 300-400 XP each)
- Rewards: gold, gems, dust, enchant stones, artifact shards

### Boss Rush
- 10-wave gauntlet of escalating bosses
- No healing between waves
- Per-wave gold doubles each wave
- Milestone rewards at waves 3, 5, 7, and 10
- Best wave tracked permanently
- 10-minute cooldown between attempts
- Unlocks at level 20

### Tower
- Infinite scaling floors with real-time combat
- Attack button, auto-climb, full heal between floors
- Exponentially scaling gold, XP, and difficulty
- Gems every 5 floors, artifact shards every 10 floors
- Milestone rewards at key floors (5 through 1000)
- Unlocks at level 8

### Collection
- 230+ auras, 50 pets, 65+ gear pieces
- Aura Index / Pet Index / Gear Index with completion tracking
- Claimable milestones at discovery thresholds
- Each aura has a unique passive ability
- Equip Best / Unequip All buttons
- Sort by: Power, Rarity, Name, Count

### Pets
- 50 pets across all rarity tiers (up to Reality)
- Hatch from 8 egg types (bulk buy to fill slots)
- Auto-hatch setting
- Level up pets by feeding duplicates (+25% per level)
- 3 active pet slots with passive bonuses
- Send pets on expeditions for idle rewards

### Gear
- 65+ gear pieces across 8 zones
- 8 set bonuses (equip 3 from same zone) including Rift set
- Gear upgrading (3 copies = +1 level, +20% power)
- Enchanting system (5 tiers, success/fail, enchant stones)

### Dungeons
- 8 multi-room roguelike dungeon runs (including The Rift Tear)
- Room types: Combat, Elite, Treasure, Trap, Healing, Boss
- Random modifiers per run (Normal, Cursed, Blessed, Chaotic, Wealthy, Nightmare, Armored)
- Guaranteed gear + artifact shard rewards on completion

### World Boss
- 3 rotating bosses (World Titan, Elder Wyrm, Fallen God)
- Phases with increasing difficulty
- Enrage timer (kill before time runs out)
- DPS tracking and damage milestones
- Artifact shard drops (5-15 per kill)
- Auto-attack option

### Workshop
- Enchanting (5 tiers: Normal 90% to Legendary 10%)
- Artifacts (craft, equip, level up)
- Aura Awakening (feed dupes to boost equipped auras)
- Crafting (3 identical auras = 1 next rarity)
- Craft All Chain (crafts through every rarity in one click)
- Aura Fusion (2 different auras = unique hybrid with both abilities)
- Selling (auras for Dust currency)
- Sell All Below rarity, Keep 1 option
- Auto-sell with quick threshold buttons
- Pet leveling
- Potions (6 types, craftable with Dust)
- Gear upgrading
- Bulk craft/sell with full rarity filters

### Progression
- Player leveling with XP curve
- Rebirth (reset for permanent multipliers, keeps gems/pets/shop/unlocks)
- Ascension (prestige layer 2, resets everything for massive bonuses)
- Progression-locked features (unlock mechanics as you level)
- 20 quests (manual claim)
- 17+ achievements
- 18 titles
- Collection milestones
- Battle Pass (30 levels, daily + weekly challenges)
- Session stats (gold earned, kills, rolls, dust, gold/min)

### Economy
- Gold (combat, offline, tower, dungeons, boss rush)
- Gems (rare rolls, bosses, milestones, battle pass, tower)
- Dust (selling auras, expeditions, battle pass)
- Enchant Stones (elite drops, milestones, battle pass)
- Artifact Shards (bosses, world bosses, dungeons, tower, boss rush, battle pass)

### Quality of Life
- Equip Best / Unequip All (single button for all slots)
- Inventory sort (power, rarity, name, count)
- Sell All Below rarity threshold
- Keep 1 (sell duplicates, keep one copy)
- Craft All Chain (all rarities in one click)
- Auto-hatch eggs setting
- Gem spend confirmation (25+ gems)
- DPS and gold/min live display
- Bulk buy eggs (Fill button)
- Auto-sell quick threshold buttons
- Dungeon cooldowns in mm:ss format
- Offline progress (gold + XP while away)
- Settings (sound, animations, notifications, export/import save)
- Tutorial for new players
- Inventory capacity (upgradeable)
- Server events (rotating buffs every 10 min)
- Daily rewards (7-day streak)
- Lucky wheel (gem gamble)
- Fake server announcements
- Tab notification badges

## How to Run Locally

1. Download or clone the repo
2. Open `index.html` in a browser
3. That's it

No build tools, no npm, no server needed. Pure HTML/CSS/JS.

## File Structure

```
index.html   - Main page structure
style.css    - All styling
data.js      - Game constants (auras, gear, pets, zones, artifacts, etc.)
engine.js    - Core engine (state, save/load, stat calculations)
systems.js   - Game systems (rolling, combat, tower, artifacts, awakening, etc.)
ui.js        - All rendering functions
game.js      - Event listeners, initialization, dungeon runs, battle pass
```

## Codes

Redeem in Store > Daily tab:

| Code | Reward |
|------|--------|
| LAUNCH2026 | 5,000 Gold + 50 Gems |
| RNGGOD | 150 Gems + 800 Dust |
| TOWER | 8,000 Gold + 40 Gems + 300 Dust |
| BIGUPDATE | 400 Gems + 1,500 Dust + 4 Enchant Stones |
| PETLOVER | 250 Gems + 800 Dust + Free Legendary Pet |
| LUCKY10X | 80 Gems + 500 Dust + 10x Luck for 10 min |
| ENCHANTME | 8 Enchant Stones + 2,000 Dust |
| NEWZONES | 15,000 Gold + 150 Gems + 500 Dust |
| CELESTIAL | 400 Gems + 3,000 Dust + 3 Enchant Stones |
| UNDERWORLD | 20,000 Gold + 250 Gems + 1,500 Dust |
| LUCK5MIN | 60 Gems + 300 Dust + 5x Luck for 5 min |
| MEGADUST | 8,000 Dust + 50 Gems |
| BIGQOL | 10,000 Gold + 300 Gems + 2,000 Dust + 3 Enchant Stones |

## Rarity Tiers

| Rarity | Chance | Power |
|--------|--------|-------|
| Common | 1 in 2 | 1 |
| Uncommon | 1 in 5 | 3 |
| Rare | 1 in 15 | 8 |
| Epic | 1 in 50 | 20 |
| Legendary | 1 in 200 | 60 |
| Mythic | 1 in 1K | 200 |
| Divine | 1 in 5K | 750 |
| Cosmic | 1 in 25K | 3,000 |
| Ethereal | 1 in 100K | 15,000 |
| IMPOSSIBLE | 1 in 1M | 100,000 |
| GODLY | 1 in 10M | 750,000 |
| PRIMORDIAL | 1 in 100M | 5,000,000 |
| ETERNAL | 1 in 1B | 40,000,000 |
| OMEGA | 1 in 10B | 300,000,000 |
| INFINITY | 1 in 100B | 2,500,000,000 |
| TRANSCENDENT | 1 in 1T | 20,000,000,000 |
| GLITCHED | 1 in 10T | 150,000,000,000 |
| REALITY | 1 in 100T | 1,000,000,000,000 |

## License

Do whatever you want with it.
