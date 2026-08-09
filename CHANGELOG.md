# Changelog

## v4.0 - Economy Rebalance & QoL Update

### Economy Rebalance

**Zone Combat Rewards**
- Increased gold and XP rewards across all 7 zones to properly scale with power requirements
- Plains: 8-22g per kill (was 5-12g)
- Volcanic: 35-85g per kill (was 20-50g)
- Ocean: 120-350g per kill (was 60-200g)
- Void: 500-1,800g per kill (was 250-1,000g)
- Cosmos: 2,500-12,000g per kill (was 1,500-8,000g)
- Underworld: 8,000-40,000g per kill (was 5,000-20,000g)
- Celestial: 25,000-120,000g per kill (was 15,000-60,000g)
- Boss kills now give 3-4x normal mob rewards
- Slightly reduced power requirements on some zones to smooth progression curve

**Shop Upgrades**
- Lowered base costs by 40-60% across the board
- Reduced cost multipliers from 1.8-2.5x down to 1.5-1.7x per level
- Auto Battle now costs 500g (was 3,000g)
- Auto Roll starts at 800g (was 2,000g)
- Gem upgrades start at 25-50 gems (was 80-200 gems)
- Auto Sell unlock reduced to 1,500g (was 5,000g)

**Dungeons**
- Power requirements aligned to zone progression tiers
- Rewards now equal roughly 3-5 minutes of farming in the corresponding zone
- Boss HP tuned to be killable with expected DPS at each tier
- D1 (Goblin Lair): 800g + 10 gems (was 500g + 10 gems)
- D7 (Heaven's Trial): 15M gold + 12K gems (was 10M gold + 15K gems)

**Tower**
- Gold and XP rewards now scale exponentially (1.35x and 1.3x per floor)
- Previously used linear scaling (50g * floor) which made late floors worthless
- Difficulty curve slightly smoothed (1.45x HP per floor, was 1.5x)

**World Bosses**
- Reduced HP slightly to be more killable
- Buffed milestone rewards with mixed currencies (gems + dust)
- Kill rewards increased 50-150%
- World Titan: 150K gold + 400 gems + 3K dust (was 100K + 500 + 2K)
- Elder Wyrm: 800K gold + 1.5K gems + 15K dust (was 500K + 2K + 10K)
- Fallen God: 5M gold + 5K gems + 80K dust (was 2M + 5K + 50K)

**Rebirth Requirements**
- Smoothed the gold requirement curve into a cleaner exponential
- Reduced level gaps between rebirths for later tiers
- Rebirth 5: Lv65 + 15M gold (was Lv65 + 25M)
- Rebirth 6: Lv75 + 60M gold (was Lv80 + 100M)

**Potions**
- Duration doubled: 60s -> 120s (90s for Power Potion)
- Costs reduced ~30% across the board
- Speed Potion: 50 dust (was 80 dust)
- Mega Luck: 300 dust for 60s (was 500 dust for 30s)

**Eggs**
- Gem costs reduced 30-50%
- Hatch times shortened 25-50%
- Epic Egg: 30 gems (was 50 gems)
- Legend Egg: 120 gems (was 200 gems)
- Ultra Egg: 25K gems (was 50K gems)
- Dust Egg: 1,000 dust (was 2,000 dust)

**Daily Rewards**
- Increased rewards across all 7 days
- Added mixed reward types (gold + gems + dust)
- Day 7 now gives 200 gems + 5K dust + 5 enchant stones

**Quests**
- All quests now reward mixed currencies appropriate to progression stage
- Added gold and dust to quests that previously only gave gems
- Late-game quests give significantly more dust

**Achievements**
- Now give mixed rewards (gems + dust + gold) instead of just gems
- Buffed reward amounts across the board

**Other Economy**
- Trading post costs reduced 25-35%
- Enchant base cost reduced (120 dust, was 200)
- Wheel prizes buffed (higher gold/gem/dust amounts, less "nothing")
- Challenge rewards now give mixed currencies
- Minigame rewards increased
- Gem income from Epic+ rolls slightly buffed (power/8, was power/10, minimum 2)

---

### Quality of Life Features

**Equip Best / Unequip All**
- Single "Equip Best" button fills all empty aura, gear, and pet slots with your strongest options
- Properly handles duplicate gear (equips multiple copies of the same item if they're your best)
- Single "Unequip All" button strips everything at once

**Inventory Sorting**
- New sort dropdown on Collection panel: Power, Rarity, Name, or Count

**Bulk Selling Improvements**
- "Sell All" dropdown now includes all 18 rarity tiers (was only up to Legendary)
- New "Keep 1" button: sells all duplicates of selected rarity but keeps 1 copy of each
- New "Sell Below" feature: pick a rarity threshold and sell everything below it in one click

**Auto-Sell Threshold**
- Quick-set buttons: "Below Uncommon", "Below Rare", "Below Epic", "Below Legendary"
- One click checks all the right boxes instead of toggling them individually
- "Clear All" button to reset

**Crafting Improvements**
- Craft All dropdown now includes all 17 craftable rarities (was only up to Legendary)
- New "Chain All" button: crafts through every rarity tier in one click (common -> uncommon -> rare -> ... -> glitched)

**Bulk Buy Eggs**
- Each egg type now has "Buy 1" and "Fill" buttons
- "Fill" purchases as many as you can afford to fill all empty slots

**DPS & Income Tracker**
- Live DPS and gold-per-minute display in the combat panel
- Resets when changing zones

**Session Stats**
- Stats panel now shows a "This Session" section
- Tracks: time played, gold earned, kills, rolls, dust earned, gold/min

**Auto-Hatch Eggs**
- New setting: "Auto-hatch eggs when ready"
- Automatically hatches completed eggs every second

**Gem Spend Confirmation**
- New setting (on by default): prompts before spending 25+ gems
- Protects against accidental wheel spins and expensive purchases

**Dungeon Cooldowns**
- Cooldown timers now display in mm:ss format (was raw seconds)

**Auto-Sell All Rarities**
- Auto-sell checkboxes now include all 18 rarities (was only 8)

---

### Bug Fixes
- Fixed sell-all dropdown missing higher rarities
- Fixed auto-sell checkboxes not showing Ethereal through Reality tiers

---

### Codes
- Removed: FREEGEMS, LUCKYDAY, GODMODE
- Added: **BIGQOL** — 10K gold, 300 gems, 2K dust, 3 enchant stones
- Rebalanced all remaining code rewards to be meaningful without being overpowered
