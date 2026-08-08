# RNG RPG

A browser-based RNG RPG inspired by Roblox RNG games. Roll for auras, fight enemies, hatch pets, enchant gear, and chase impossibly rare drops.

## Play Now

Open `index.html` in any modern browser. No server, no install, no dependencies. Everything saves to localStorage.


## Features

### Rolling
- 220 auras across 7 zones + global pool
- 18 rarity tiers from Common (1 in 2) to REALITY (1 in 100 trillion)
- 10 modifiers (Shiny through Divine, up to 100x power multiplier)
- Spinning reel animation on manual rolls
- Multi-roll (up to x10 per click, upgradeable)
- Auto-roll (upgradeable speed)
- Pity system (guaranteed rare+ after threshold)
- Zone-specific aura pools
- Lucky Aura rotation (3x chance for a random rare+ aura)
- Seasonal limited auras
- Dry streak counter

### Combat
- 7 zones with escalating enemies (Plains through Celestial Realm)
- Elite enemies (5 types: Enraged, Armored, Swift, Glowing, Cursed)
- 6 combat skills with cooldowns
- Auto-fight (shop upgrade)
- Lifesteal, crit, defense mechanics
- Gear drops from enemies

### Collection
- 220 auras, 50 pets, 60 gear pieces
- Aura Index / Pet Index / Gear Index with completion tracking
- Claimable milestones at discovery thresholds
- Each aura has a unique passive ability
- Modifiers multiply power and add stat bonuses

### Pets
- 50 pets across all rarity tiers (up to Reality)
- Hatch from 8 egg types
- Level up pets by feeding duplicates (+25% per level)
- 3 active pet slots with passive bonuses
- Send pets on expeditions for idle rewards

### Gear
- 60 gear pieces across 7 zones
- 7 set bonuses (equip 3 from same zone)
- Gear upgrading (3 copies = +1 level, +20% power)
- Enchanting system (5 tiers, success/fail, enchant stones)

### Dungeons
- 7 multi-room roguelike dungeon runs
- Room types: Combat, Elite, Treasure, Trap, Healing, Boss
- Random modifiers per run (Normal, Cursed, Blessed, Chaotic, Wealthy, Nightmare, Armored)
- Guaranteed gear rewards on completion

### Tower
- Endless scaling floors
- Milestone rewards at floors 5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 300, 500, 1000

### World Boss
- 3 rotating bosses (World Titan, Elder Wyrm, Fallen God)
- Phases with increasing difficulty
- Enrage timer (kill before time runs out)
- DPS tracking and damage milestones
- Auto-attack option

### Workshop
- Enchanting (5 tiers: Normal 90% to Legendary 10%)
- Crafting (3 identical auras = 1 next rarity)
- Aura Fusion (2 different auras = unique hybrid with both abilities)
- Selling (auras for Dust currency)
- Pet leveling
- Potions (6 types, craftable with Dust)
- Gear upgrading
- Bulk craft/sell with rarity filters

### Progression
- Player leveling with XP curve
- Rebirth (reset for permanent multipliers, keeps gems/pets/shop/unlocks)
- Ascension (prestige layer 2, resets everything for massive bonuses)
- Progression-locked features (unlock mechanics as you level)
- 20 quests (manual claim)
- 17+ achievements
- 18 titles
- Collection milestones

### Economy
- Gold (combat, offline)
- Gems (rare rolls, bosses, milestones)
- Dust (selling auras, expeditions)
- Enchant Stones (elite drops, milestones)

### Quality of Life
- Offline progress (gold + XP while away)
- Auto-sell (filter by rarity)
- Settings (sound, animations, notifications, export/import save)
- Tutorial for new players
- Inventory capacity (upgradeable)
- Server events (rotating buffs every 10 min)
- Daily rewards (7-day streak)
- Lucky wheel (gem gamble)
- Fake server announcements for hype
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
data.js      - Game constants (auras, gear, pets, zones, etc.)
engine.js    - Core engine (state, save/load, stat calculations)
systems.js   - Game systems (rolling, combat, eggs, dungeons, etc.)
ui.js        - All rendering functions
game.js      - Event listeners, initialization, dungeon runs
```

## Codes

Redeem in Store > Daily tab:

| Code | Reward |
|------|--------|
| LAUNCH2026 | 5,000 Gold + 50 Gems |
| FREEGEMS | 100 Gems |
| LUCKYDAY | 500 Dust |
| RNGGOD | 200 Gems + 1,000 Dust |
| TOWER | 10,000 Gold + 50 Gems |
| BIGUPDATE | 500 Gems + 2,000 Dust + 5 Enchant Stones |
| PETLOVER | 300 Gems + 1,000 Dust + Free Legendary Pet |
| LUCKY10X | 100 Gems + 10x Luck for 10 minutes |
| GODMODE | 50,000 Gold + 1,000 Gems + 5,000 Dust |
| ENCHANTME | 10 Enchant Stones + 3,000 Dust |
| NEWZONES | 20,000 Gold + 200 Gems |
| CELESTIAL | 500 Gems + 5,000 Dust + 3 Enchant Stones |
| UNDERWORLD | 30,000 Gold + 300 Gems + 2,000 Dust |
| LUCK5MIN | 50 Gems + 5x Luck for 5 minutes |
| MEGADUST | 10,000 Dust |

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
