// ==========================================
// RNG RPG v3 - Full Roblox RNG Style
// ==========================================
const RARITIES=[
{id:'common',name:'Common',chance:2,color:'#9ca3af',power:1},
{id:'uncommon',name:'Uncommon',chance:5,color:'#22c55e',power:3},
{id:'rare',name:'Rare',chance:15,color:'#3b82f6',power:8},
{id:'epic',name:'Epic',chance:50,color:'#a855f7',power:20},
{id:'legendary',name:'Legendary',chance:200,color:'#f59e0b',power:60},
{id:'mythic',name:'Mythic',chance:1000,color:'#ef4444',power:200},
{id:'divine',name:'Divine',chance:5000,color:'#ec4899',power:750},
{id:'cosmic',name:'Cosmic',chance:25000,color:'#06b6d4',power:3000},
{id:'ethereal',name:'Ethereal',chance:100000,color:'#ffffff',power:15000},
{id:'impossible',name:'IMPOSSIBLE',chance:1000000,color:'#ff0080',power:100000},
{id:'godly',name:'GODLY',chance:10000000,color:'#ffd700',power:750000},
{id:'primordial',name:'PRIMORDIAL',chance:100000000,color:'#00ff88',power:5000000},
{id:'eternal',name:'ETERNAL',chance:1000000000,color:'#ff6600',power:40000000},
{id:'omega',name:'OMEGA',chance:10000000000,color:'#ff00ff',power:300000000},
{id:'infinity',name:'INFINITY',chance:100000000000,color:'#00ffff',power:2500000000},
{id:'transcendent',name:'TRANSCENDENT',chance:1000000000000,color:'#ffff00',power:20000000000},
{id:'glitched',name:'GLITCHED',chance:10000000000000,color:'#00ff00',power:150000000000},
{id:'reality',name:'REALITY',chance:100000000000000,color:'#ff0000',power:1000000000000},
];
const MODIFIERS=[
{id:'shiny',name:'Shiny',chance:20,pMult:2,lMult:1.5,dMult:1.2,gMult:1.3,xMult:1,color:'#fde047',css:'mod-shiny'},
{id:'golden',name:'Golden',chance:100,pMult:3,lMult:2,dMult:1.5,gMult:2,xMult:1.5,color:'#f59e0b',css:'mod-golden'},
{id:'void',name:'Void',chance:500,pMult:5,lMult:3,dMult:2,gMult:1.5,xMult:2,color:'#7c3aed',css:'mod-void'},
{id:'cursed',name:'Cursed',chance:1000,pMult:8,lMult:0.5,dMult:4,gMult:0.5,xMult:3,color:'#dc2626',css:'mod-cursed'},
{id:'radiant',name:'Radiant',chance:2000,pMult:10,lMult:4,dMult:2.5,gMult:3,xMult:2,color:'#f0f0ff',css:'mod-radiant'},
{id:'ancient',name:'Ancient',chance:5000,pMult:15,lMult:5,dMult:3,gMult:2,xMult:4,color:'#8b4513',css:'mod-ancient'},
{id:'celestial',name:'Celestial',chance:10000,pMult:20,lMult:8,dMult:4,gMult:4,xMult:5,color:'#e0e7ff',css:'mod-celestial'},
{id:'chromatic',name:'Chromatic',chance:25000,pMult:30,lMult:10,dMult:5,gMult:5,xMult:6,color:'#ff69b4',css:'mod-chromatic'},
{id:'abyssal',name:'Abyssal',chance:50000,pMult:50,lMult:15,dMult:8,gMult:3,xMult:8,color:'#191970',css:'mod-abyssal'},
{id:'divine_mod',name:'Divine',chance:100000,pMult:100,lMult:25,dMult:10,gMult:10,xMult:10,color:'#fff8dc',css:'mod-divine'},
];

// === 100+ AURAS (zone-locked with abilities) ===
// ability types: dmg, hp, def, luck, crit, lifesteal, gold, xp, speed, all
const A=[];
function a(id,name,icon,rarity,zone,aType,aVal,aDesc){A.push({id,name,icon,rarity,zone,ability:{type:aType,value:aVal,desc:aDesc}});}
// ZONE 0 - Plains (15 auras)
a('ember_glow','Ember Glow','🔥','common',0,'dmg',0.05,'+5% DMG');
a('leaf_whisper','Leaf Whisper','🍃','common',0,'hp',10,'+10 HP');
a('stone_pulse','Stone Pulse','🪨','common',0,'def',2,'+2 DEF');
a('wind_drift','Wind Drift','💨','common',0,'speed',0.05,'+5% Speed');
a('mud_shell','Mud Shell','🐚','common',0,'def',3,'+3 DEF');
a('pebble_toss','Pebble Toss','⚪','common',0,'dmg',0.03,'+3% DMG');
a('frost_shard','Frost Shard','❄️','uncommon',0,'dmg',0.1,'+10% DMG');
a('thunder_spark','Thunder Spark','⚡','uncommon',0,'crit',0.03,'+3% Crit');
a('shadow_wisp','Shadow Wisp','🌑','uncommon',0,'luck',0.2,'+0.2 Luck');
a('morning_dew','Morning Dew','💧','uncommon',0,'hp',20,'+20 HP');
a('crystal_vein','Crystal Vein','💎','rare',0,'gold',0.15,'+15% Gold');
a('blood_moon','Blood Moon','🌙','rare',0,'lifesteal',0.05,'5% Lifesteal');
a('neon_flux','Neon Flux','💜','rare',0,'xp',0.2,'+20% XP');
a('void_rift','Void Rift','🕳️','epic',0,'luck',0.8,'+0.8 Luck');
a('solar_flare','Solar Flare','☀️','epic',0,'dmg',0.25,'+25% DMG');
a('dragon_soul','Dragon Soul','🐉','legendary',0,'all',0.1,'+10% All');
a('star_forged','Star Forged','⭐','legendary',0,'luck',2,'+2 Luck');
// ZONE 1 - Volcanic (15 auras)
a('magma_heart','Magma Heart','❤️‍🔥','common',1,'dmg',0.08,'+8% DMG');
a('ash_cloud','Ash Cloud','🌫️','common',1,'def',5,'+5 DEF');
a('cinder_spark','Cinder Spark','✨','common',1,'crit',0.02,'+2% Crit');
a('smoke_ring','Smoke Ring','💨','common',1,'speed',0.06,'+6% Speed');
a('coal_chunk','Coal Chunk','⬛','common',1,'gold',0.08,'+8% Gold');
a('heat_wave','Heat Wave','🌡️','common',1,'dmg',0.06,'+6% DMG');
a('flame_dancer','Flame Dancer','💃','uncommon',1,'speed',0.1,'+10% Speed');
a('lava_flow','Lava Flow','🌊','uncommon',1,'dmg',0.15,'+15% DMG');
a('obsidian_edge','Obsidian Edge','🔪','uncommon',1,'crit',0.05,'+5% Crit');
a('ember_spirit','Ember Spirit','👻','uncommon',1,'xp',0.15,'+15% XP');
a('phoenix_feather','Phoenix Feather','🪶','rare',1,'lifesteal',0.08,'8% Lifesteal');
a('inferno_core','Inferno Core','🔴','rare',1,'dmg',0.3,'+30% DMG');
a('hellfire_crown','Hellfire Crown','👑','epic',1,'all',0.12,'+12% All');
a('volcanic_god','Volcanic God','🌋','epic',1,'dmg',0.4,'+40% DMG');
a('primordial_flame','Primordial Flame','🔥','legendary',1,'all',0.15,'+15% All');

// ZONE 2 - Ocean (14 auras)
a('tidal_pulse','Tidal Pulse','🌊','common',2,'hp',25,'+25 HP');
a('coral_bloom','Coral Bloom','🪸','common',2,'def',6,'+6 DEF');
a('deep_current','Deep Current','💧','common',2,'gold',0.1,'+10% Gold');
a('sea_foam','Sea Foam','🫧','common',2,'speed',0.07,'+7% Speed');
a('shell_guard','Shell Guard','🐚','common',2,'def',8,'+8 DEF');
a('pearl_light','Pearl Light','⚪','uncommon',2,'luck',0.5,'+0.5 Luck');
a('kraken_ink','Kraken Ink','🦑','uncommon',2,'dmg',0.2,'+20% DMG');
a('siren_song','Siren Song','🧜','uncommon',2,'xp',0.25,'+25% XP');
a('tide_walker','Tide Walker','🚶','uncommon',2,'hp',40,'+40 HP');
a('abyssal_eye','Abyssal Eye','👁️','rare',2,'crit',0.08,'+8% Crit');
a('tsunami_force','Tsunami Force','🌀','rare',2,'dmg',0.35,'+35% DMG');
a('ocean_empress','Ocean Empress','👸','epic',2,'all',0.15,'+15% All');
a('depth_charge','Depth Charge','💥','epic',2,'dmg',0.45,'+45% DMG');
a('leviathan_soul','Leviathan Soul','🐋','legendary',2,'all',0.2,'+20% All');
// ZONE 3 - Void (14 auras)
a('null_shard','Null Shard','🔲','common',3,'luck',0.3,'+0.3 Luck');
a('dark_matter','Dark Matter','⚫','common',3,'dmg',0.12,'+12% DMG');
a('void_dust','Void Dust','🌑','common',3,'gold',0.12,'+12% Gold');
a('shadow_pulse','Shadow Pulse','💜','common',3,'crit',0.03,'+3% Crit');
a('rift_echo','Rift Echo','〰️','uncommon',3,'speed',0.15,'+15% Speed');
a('void_tendril','Void Tendril','🦠','uncommon',3,'lifesteal',0.1,'10% Lifesteal');
a('dark_nova','Dark Nova','🌑','uncommon',3,'dmg',0.25,'+25% DMG');
a('null_field','Null Field','🔳','uncommon',3,'def',30,'+30 DEF');
a('singularity','Singularity','⚪','rare',3,'luck',1.5,'+1.5 Luck');
a('event_horizon','Event Horizon','🕳️','rare',3,'all',0.12,'+12% All');
a('dimension_tear','Dimension Tear','🌌','epic',3,'luck',3,'+3 Luck');
a('void_colossus','Void Colossus','🗿','epic',3,'dmg',0.6,'+60% DMG');
a('void_emperor','Void Emperor','👤','legendary',3,'all',0.25,'+25% All');
a('null_king','Null King','♟️','legendary',3,'luck',5,'+5 Luck');

// ZONE 4 - Cosmos (14 auras)
a('star_dust_c','Star Dust','✨','common',4,'xp',0.15,'+15% XP');
a('nebula_wisp','Nebula Wisp','☁️','common',4,'luck',0.5,'+0.5 Luck');
a('comet_trail','Comet Trail','☄️','common',4,'speed',0.1,'+10% Speed');
a('moon_glow','Moon Glow','🌙','common',4,'gold',0.15,'+15% Gold');
a('solar_wind','Solar Wind','🌞','uncommon',4,'speed',0.2,'+20% Speed');
a('black_hole','Black Hole','🕳️','uncommon',4,'dmg',0.3,'+30% DMG');
a('asteroid_belt','Asteroid Belt','🪨','uncommon',4,'def',40,'+40 DEF');
a('nova_burst','Nova Burst','💥','uncommon',4,'crit',0.06,'+6% Crit');
a('quasar_beam','Quasar Beam','💫','rare',4,'crit',0.12,'+12% Crit');
a('supernova','Supernova','💥','rare',4,'dmg',0.5,'+50% DMG');
a('pulsar','Pulsar','⭐','rare',4,'speed',0.25,'+25% Speed');
a('galaxy_core','Galaxy Core','🌀','epic',4,'all',0.2,'+20% All');
a('big_bang','Big Bang','💫','epic',4,'dmg',0.7,'+70% DMG');
a('cosmic_creator','Cosmic Creator','🌌','legendary',4,'all',0.3,'+30% All');
// GLOBAL (zone -1) - Mythic through Impossible (15 auras)
a('death_bringer','Death Bringer','💀','mythic',-1,'dmg',0.6,'+60% DMG');
a('celestial_wrath','Celestial Wrath','🌟','mythic',-1,'all',0.3,'+30% All');
a('time_lord','Time Lord','⏰','mythic',-1,'speed',0.4,'+40% Speed');
a('blood_god','Blood God','🩸','mythic',-1,'lifesteal',0.2,'20% Lifesteal');
a('fortune_king','Fortune King','👑','mythic',-1,'gold',0.8,'+80% Gold');
a('god_slayer','God Slayer','⚔️','divine',-1,'dmg',1,'+100% DMG');
a('eternal_flame','Eternal Flame','🔮','divine',-1,'all',0.4,'+40% All');
a('fate_weaver','Fate Weaver','🕸️','divine',-1,'luck',8,'+8 Luck');
a('world_ender','World Ender','🌍','divine',-1,'dmg',1.2,'+120% DMG');
a('galaxy_born','Galaxy Born','🌌','cosmic',-1,'all',0.6,'+60% All');
a('time_warp','Time Warp','⏳','cosmic',-1,'luck',20,'+20 Luck');
a('infinity','Infinity','♾️','cosmic',-1,'all',0.8,'+80% All');
a('reality_break','Reality Break','🌀','ethereal',-1,'all',1,'+100% All');
a('transcendence','Transcendence','🔆','ethereal',-1,'luck',50,'+50 Luck');
a('the_one','THE ONE','👁️','impossible',-1,'all',5,'+500% All');
// GODLY (1 in 10M)
a('soul_devourer','Soul Devourer','💀','godly',-1,'dmg',3,'+300% DMG');
a('luck_incarnate','Luck Incarnate','🍀','godly',-1,'luck',100,'+100 Luck');
a('golden_god','Golden God','👑','godly',-1,'gold',5,'+500% Gold');
a('time_breaker','Time Breaker','⌛','godly',-1,'speed',2,'+200% Speed');
a('life_eternal','Life Eternal','💖','godly',-1,'all',8,'+800% All');
a('god_of_war','God of War','⚔️','godly',-1,'dmg',4,'+400% DMG');
a('fortune_deity','Fortune Deity','🎰','godly',-1,'gold',8,'+800% Gold');
// PRIMORDIAL (1 in 100M)
a('big_bang','Big Bang','💥','primordial',-1,'all',15,'+1500% All');
a('void_mother','Void Mother','🕳️','primordial',-1,'luck',500,'+500 Luck');
a('genesis_flame','Genesis Flame','🔥','primordial',-1,'dmg',10,'+1000% DMG');
a('world_seed','World Seed','🌱','primordial',-1,'all',12,'+1200% All');
a('first_light','First Light','💡','primordial',-1,'speed',5,'+500% Speed');
a('primordial_chaos','Primordial Chaos','🌪️','primordial',-1,'all',14,'+1400% All');
// ETERNAL (1 in 1B)
a('alpha_omega','Alpha & Omega','♾️','eternal',-1,'all',30,'+3000% All');
a('dimension_god','Dimension God','🌐','eternal',-1,'luck',2000,'+2K Luck');
a('chaos_engine','Chaos Engine','⚙️','eternal',-1,'all',25,'+2500% All');
a('eternity_flame','Eternity Flame','🕯️','eternal',-1,'dmg',20,'+2000% DMG');
a('time_weaver','Time Weaver','🧵','eternal',-1,'speed',10,'+1000% Speed');
// OMEGA (1 in 10B)
a('universe_heart','Universe Heart','💜','omega',-1,'all',60,'+6000% All');
a('fate_itself','Fate Itself','🎭','omega',-1,'luck',10000,'+10K Luck');
a('omega_force','Omega Force','💪','omega',-1,'dmg',50,'+5000% DMG');
a('endless_gold','Endless Gold','🏆','omega',-1,'gold',30,'+3000% Gold');
// INFINITY (1 in 100B)
a('beyond_infinity','Beyond Infinity','∞','infinity',-1,'all',150,'+15000% All');
a('source_code','Source Code','💻','infinity',-1,'all',120,'+12000% All');
a('infinite_luck','Infinite Luck','🎲','infinity',-1,'luck',50000,'+50K Luck');
a('endless_power','Endless Power','⚡','infinity',-1,'dmg',100,'+10000% DMG');
// TRANSCENDENT (1 in 1T)
a('the_answer','The Answer','42','transcendent',-1,'all',400,'+40000% All');
a('beyond_all','Beyond All','🔮','transcendent',-1,'all',350,'+35000% All');
a('transcendent_luck','Transcendent Luck','☘️','transcendent',-1,'luck',200000,'+200K Luck');
// GLITCHED (1 in 10T)
a('error_404','ERROR 404','⚠️','glitched',-1,'all',1000,'+100000% All');
a('null_pointer','NULL POINTER','🚫','glitched',-1,'dmg',800,'+80000% DMG');
a('stack_overflow','STACK OVERFLOW','📚','glitched',-1,'all',900,'+90000% All');
// REALITY (1 in 100T)
a('i_am','I AM','✦','reality',-1,'all',10000,'+1000000% All');
a('the_creator','THE CREATOR','🌟','reality',-1,'all',8000,'+800000% All');
a('existence','EXISTENCE','🫀','reality',-1,'all',12000,'+1200000% All');
a('final_truth','FINAL TRUTH','🔑','reality',-1,'luck',1000000,'+1M Luck');
// === MORE ZONE AURAS ===
// PLAINS extras
a('dandelion','Dandelion','🌼','common',0,'gold',0.04,'+4% Gold');
a('river_stone','River Stone','🏔️','common',0,'def',4,'+4 DEF');
a('sunny_ray','Sunny Ray','🌤️','common',0,'hp',15,'+15 HP');
a('beetle_shell','Beetle Shell','🪲','uncommon',0,'def',6,'+6 DEF');
a('hawk_eye','Hawk Eye','🦅','uncommon',0,'crit',0.04,'+4% Crit');
a('wild_rose','Wild Rose','🌹','uncommon',0,'hp',30,'+30 HP');
a('thunder_clap','Thunder Clap','🌩️','rare',0,'dmg',0.2,'+20% DMG');
a('ancient_oak','Ancient Oak','🌳','rare',0,'def',15,'+15 DEF');
a('spirit_fox','Spirit Fox','🦊','epic',0,'speed',0.15,'+15% Speed');
a('storm_lord','Storm Lord','⛈️','epic',0,'crit',0.1,'+10% Crit');
a('nature_titan','Nature Titan','🧌','legendary',0,'all',0.12,'+12% All');
// VOLCANIC extras
a('sulfur_vent','Sulfur Vent','💛','common',1,'gold',0.06,'+6% Gold');
a('basalt_armor','Basalt Armor','🧱','common',1,'def',7,'+7 DEF');
a('fire_ant','Fire Ant','🐜','uncommon',1,'dmg',0.12,'+12% DMG');
a('eruption','Eruption','🌡️','uncommon',1,'crit',0.04,'+4% Crit');
a('dragon_breath','Dragon Breath','🐲','rare',1,'dmg',0.28,'+28% DMG');
a('forge_master','Forge Master','⚒️','rare',1,'all',0.08,'+8% All');
a('caldera_beast','Caldera Beast','🦬','epic',1,'hp',80,'+80 HP');
a('lava_titan','Lava Titan','🏔️','epic',1,'def',35,'+35 DEF');
a('core_dweller','Core Dweller','🫀','legendary',1,'dmg',0.5,'+50% DMG');
// OCEAN extras
a('starfish','Starfish','⭐','common',2,'luck',0.1,'+0.1 Luck');
a('whale_song','Whale Song','🐳','common',2,'xp',0.08,'+8% XP');
a('anchor_soul','Anchor Soul','⚓','uncommon',2,'def',12,'+12 DEF');
a('riptide','Riptide','🌀','uncommon',2,'speed',0.08,'+8% Speed');
a('depth_lurker','Depth Lurker','🦈','rare',2,'dmg',0.3,'+30% DMG');
a('bioluminescence','Bioluminescence','✨','rare',2,'luck',0.8,'+0.8 Luck');
a('trench_horror','Trench Horror','👾','epic',2,'dmg',0.5,'+50% DMG');
a('poseidon','Poseidon','🔱','epic',2,'all',0.18,'+18% All');
a('deep_one','Deep One','🐙','legendary',2,'lifesteal',0.12,'12% Lifesteal');
// VOID extras
a('entropy','Entropy','🌀','common',3,'dmg',0.1,'+10% DMG');
a('null_zone','Null Zone','⬜','common',3,'def',10,'+10 DEF');
a('phantom_grip','Phantom Grip','🫳','uncommon',3,'crit',0.06,'+6% Crit');
a('shadow_realm','Shadow Realm','🌑','uncommon',3,'dmg',0.22,'+22% DMG');
a('dark_star','Dark Star','🌟','rare',3,'all',0.1,'+10% All');
a('oblivion','Oblivion','⚫','rare',3,'dmg',0.4,'+40% DMG');
a('reality_fracture','Reality Fracture','💔','epic',3,'luck',2.5,'+2.5 Luck');
a('nihil','Nihil','☠️','epic',3,'all',0.2,'+20% All');
a('abyss_lord','Abyss Lord','👁️','legendary',3,'all',0.28,'+28% All');
// COSMOS extras
a('stardust_rain','Stardust Rain','🌠','common',4,'gold',0.12,'+12% Gold');
a('gravity_well','Gravity Well','🕳️','common',4,'def',15,'+15 DEF');
a('plasma_bolt','Plasma Bolt','⚡','uncommon',4,'dmg',0.25,'+25% DMG');
a('cosmic_dust','Cosmic Dust','🌫️','uncommon',4,'luck',0.7,'+0.7 Luck');
a('red_giant','Red Giant','🔴','rare',4,'hp',100,'+100 HP');
a('neutron_star','Neutron Star','💫','rare',4,'all',0.12,'+12% All');
a('dark_energy','Dark Energy','⚫','epic',4,'dmg',0.6,'+60% DMG');
a('multiverse','Multiverse','🌐','epic',4,'all',0.22,'+22% All');
a('big_crunch','Big Crunch','🫸','legendary',4,'all',0.35,'+35% All');
// MORE GLOBAL (high rarities)
a('void_king','Void King','🫅','mythic',-1,'all',0.35,'+35% All');
a('plague_lord','Plague Lord','🦠','mythic',-1,'lifesteal',0.15,'15% Lifesteal');
a('star_slayer','Star Slayer','💫','divine',-1,'dmg',1.2,'+120% DMG');
a('dream_walker','Dream Walker','😴','divine',-1,'luck',10,'+10 Luck');
a('cosmic_horror','Cosmic Horror','🐙','cosmic',-1,'all',0.7,'+70% All');
a('entropy_god','Entropy God','☠️','cosmic',-1,'dmg',2,'+200% DMG');
a('absolute_zero','Absolute Zero','🥶','ethereal',-1,'all',1.2,'+120% All');
a('antimatter','Antimatter','⚛️','impossible',-1,'all',6,'+600% All');
a('singularity_prime','Singularity Prime','⚪','godly',-1,'all',10,'+1000% All');
a('origin_point','Origin Point','📍','primordial',-1,'luck',1000,'+1000 Luck');
// ZONE 5 - Underworld
a('soul_ember','Soul Ember','🕯️','common',5,'dmg',0.15,'+15% DMG');
a('bone_dust','Bone Dust','🦴','common',5,'def',12,'+12 DEF');
a('hellfire_wisp','Hellfire Wisp','👻','common',5,'gold',0.15,'+15% Gold');
a('demon_eye','Demon Eye','👁️','common',5,'crit',0.03,'+3% Crit');
a('grave_moss','Grave Moss','🌿','common',5,'hp',40,'+40 HP');
a('wraith_touch','Wraith Touch','🫳','common',5,'lifesteal',0.04,'4% Lifesteal');
a('blood_pact','Blood Pact','🩸','uncommon',5,'dmg',0.25,'+25% DMG');
a('skull_crown','Skull Crown','💀','uncommon',5,'crit',0.06,'+6% Crit');
a('phantom_cloak','Phantom Cloak','🧥','uncommon',5,'def',25,'+25 DEF');
a('death_rattle','Death Rattle','☠️','uncommon',5,'all',0.08,'+8% All');
a('infernal_pyre','Infernal Pyre','🔥','rare',5,'dmg',0.4,'+40% DMG');
a('lich_wisdom','Lich Wisdom','📚','rare',5,'xp',0.35,'+35% XP');
a('soul_harvest','Soul Harvest','🌾','rare',5,'gold',0.4,'+40% Gold');
a('demon_lord','Demon Lord','😈','epic',5,'all',0.2,'+20% All');
a('underworld_king','Underworld King','👑','epic',5,'dmg',0.6,'+60% DMG');
a('death_incarnate','Death Incarnate','💀','legendary',5,'all',0.3,'+30% All');
a('hell_sovereign','Hell Sovereign','🔥','legendary',5,'dmg',0.8,'+80% DMG');
// ZONE 6 - Celestial
a('angel_feather','Angel Feather','🪶','common',6,'hp',50,'+50 HP');
a('holy_light','Holy Light','💡','common',6,'luck',0.4,'+0.4 Luck');
a('star_prayer','Star Prayer','🙏','common',6,'xp',0.12,'+12% XP');
a('cloud_wisp','Cloud Wisp','☁️','common',6,'speed',0.1,'+10% Speed');
a('divine_tear','Divine Tear','💧','common',6,'gold',0.15,'+15% Gold');
a('halo_glow','Halo Glow','😇','common',6,'all',0.05,'+5% All');
a('seraph_wing','Seraph Wing','🪽','uncommon',6,'speed',0.2,'+20% Speed');
a('celestial_hymn','Celestial Hymn','🎵','uncommon',6,'xp',0.3,'+30% XP');
a('golden_harp','Golden Harp','🎸','uncommon',6,'luck',0.8,'+0.8 Luck');
a('heaven_gate','Heaven Gate','🚪','uncommon',6,'all',0.1,'+10% All');
a('archangel_blade','Archangel Blade','⚔️','rare',6,'dmg',0.5,'+50% DMG');
a('divine_shield','Divine Shield','🛡️','rare',6,'def',40,'+40 DEF');
a('miracle','Miracle','✨','rare',6,'all',0.15,'+15% All');
a('throne_of_light','Throne of Light','🪑','epic',6,'all',0.25,'+25% All');
a('god_hand','God Hand','🖐️','epic',6,'dmg',0.7,'+70% DMG');
a('heaven_ruler','Heaven Ruler','👸','legendary',6,'all',0.35,'+35% All');
a('celestial_origin','Celestial Origin','🌟','legendary',6,'luck',4,'+4 Luck');
// === SEASONAL AURA ===
a('winter_soul','Winter Soul','❄️','legendary',-1,'luck',3,'+3 Luck [SEASONAL]');
a('spring_bloom','Spring Bloom','🌸','legendary',-1,'all',0.18,'+18% All [SEASONAL]');
a('summer_blaze','Summer Blaze','🌅','divine',-1,'dmg',1.5,'+150% DMG [SEASONAL]');
a('autumn_harvest','Autumn Harvest','🍂','mythic',-1,'gold',1,'+100% Gold [SEASONAL]');
const AURAS=A;
const SEASONAL_AURAS=['winter_soul','spring_bloom','summer_blaze','autumn_harvest'];

// === GEAR (sets) ===
const GEAR_SETS={plains:{name:'Plains',bonus:{def:10,hp:50},desc:'+10 DEF +50 HP'},volcanic:{name:'Volcanic',bonus:{dmg:0.3,crit:0.05},desc:'+30% DMG +5% Crit'},ocean:{name:'Ocean',bonus:{hp:150,lifesteal:0.05},desc:'+150 HP +5% LS'},void:{name:'Void',bonus:{luck:3,dmg:0.5},desc:'+3 Luck +50% DMG'},cosmos:{name:'Cosmos',bonus:{all:0.3},desc:'+30% All'},underworld:{name:'Underworld',bonus:{dmg:0.6,lifesteal:0.08},desc:'+60% DMG +8% LS'},celestial:{name:'Celestial',bonus:{all:0.4,luck:5},desc:'+40% All +5 Luck'}};
const GEAR=[
{id:'wooden_sword',name:'Wooden Sword',icon:'🗡️',rarity:'common',power:5,zone:0,set:'plains'},
{id:'leather_armor',name:'Leather Armor',icon:'🛡️',rarity:'common',power:3,defense:2,zone:0,set:'plains'},
{id:'iron_blade',name:'Iron Blade',icon:'⚔️',rarity:'uncommon',power:12,zone:0,set:'plains'},
{id:'chain_mail',name:'Chain Mail',icon:'🦺',rarity:'rare',power:25,defense:10,zone:0,set:'plains'},
{id:'enchanted_staff',name:'Enchanted Staff',icon:'🪄',rarity:'epic',power:55,zone:0,set:'plains'},
{id:'flame_blade',name:'Flame Blade',icon:'🔥',rarity:'uncommon',power:20,zone:1,set:'volcanic'},
{id:'dragon_shield',name:'Dragon Shield',icon:'🛡️',rarity:'rare',power:45,defense:20,zone:1,set:'volcanic'},
{id:'phoenix_staff',name:'Phoenix Staff',icon:'🔱',rarity:'epic',power:100,zone:1,set:'volcanic'},
{id:'inferno_blade',name:'Inferno Blade',icon:'⚔️',rarity:'legendary',power:250,zone:1,set:'volcanic'},
{id:'tidal_spear',name:'Tidal Spear',icon:'🔱',rarity:'rare',power:80,zone:2,set:'ocean'},
{id:'abyssal_armor',name:'Abyssal Armor',icon:'🛡️',rarity:'epic',power:180,defense:50,zone:2,set:'ocean'},
{id:'leviathan_tooth',name:'Leviathan Tooth',icon:'🦷',rarity:'legendary',power:450,zone:2,set:'ocean'},
{id:'ocean_trident',name:"Ocean Trident",icon:'🔱',rarity:'mythic',power:1200,zone:2,set:'ocean'},
{id:'void_blade',name:'Void Blade',icon:'🗡️',rarity:'epic',power:350,zone:3,set:'void'},
{id:'nebula_armor',name:'Nebula Armor',icon:'🛡️',rarity:'legendary',power:800,defense:150,zone:3,set:'void'},
{id:'star_destroyer',name:'Star Destroyer',icon:'⚔️',rarity:'mythic',power:2000,zone:3,set:'void'},
{id:'universe_ender',name:'Universe Ender',icon:'💫',rarity:'divine',power:6000,zone:3,set:'void'},
{id:'reality_slicer',name:'Reality Slicer',icon:'🌀',rarity:'mythic',power:5000,zone:4,set:'cosmos'},
{id:'cosmic_crown',name:'Cosmic Crown',icon:'👑',rarity:'divine',power:12000,defense:500,zone:4,set:'cosmos'},
{id:'infinity_edge',name:'Infinity Edge',icon:'🧤',rarity:'cosmic',power:30000,zone:4,set:'cosmos'},
// More gear
{id:'thorn_whip',name:'Thorn Whip',icon:'🌿',rarity:'uncommon',power:10,zone:0,set:'plains'},
{id:'oak_shield',name:'Oak Shield',icon:'🛡️',rarity:'rare',power:20,defense:15,zone:0,set:'plains'},
{id:'magma_axe',name:'Magma Axe',icon:'🪓',rarity:'rare',power:50,zone:1,set:'volcanic'},
{id:'ember_cloak',name:'Ember Cloak',icon:'🧥',rarity:'epic',power:90,defense:25,zone:1,set:'volcanic'},
{id:'coral_blade',name:'Coral Blade',icon:'🗡️',rarity:'uncommon',power:30,zone:2,set:'ocean'},
{id:'depth_helm',name:'Depth Helm',icon:'⛑️',rarity:'rare',power:60,defense:30,zone:2,set:'ocean'},
{id:'trident_prime',name:'Trident Prime',icon:'🔱',rarity:'epic',power:200,zone:2,set:'ocean'},
{id:'null_gauntlet',name:'Null Gauntlet',icon:'🧤',rarity:'rare',power:100,zone:3,set:'void'},
{id:'void_crown',name:'Void Crown',icon:'👑',rarity:'epic',power:400,defense:80,zone:3,set:'void'},
{id:'event_blade',name:'Event Horizon Blade',icon:'⚔️',rarity:'legendary',power:900,zone:3,set:'void'},
{id:'stellar_bow',name:'Stellar Bow',icon:'🏹',rarity:'rare',power:120,zone:4,set:'cosmos'},
{id:'nebula_staff',name:'Nebula Staff',icon:'🪄',rarity:'epic',power:500,zone:4,set:'cosmos'},
{id:'galaxy_plate',name:'Galaxy Plate',icon:'🛡️',rarity:'legendary',power:1500,defense:200,zone:4,set:'cosmos'},
{id:'reality_blade',name:'Reality Blade',icon:'⚔️',rarity:'divine',power:15000,zone:4,set:'cosmos'},
{id:'god_armor',name:'God Armor',icon:'🛡️',rarity:'mythic',power:3000,defense:400,zone:3,set:'void'},
{id:'omega_sword',name:'Omega Sword',icon:'⚔️',rarity:'cosmic',power:35000,zone:4,set:'cosmos'},
// Underworld gear
{id:'bone_scythe',name:'Bone Scythe',icon:'🗡️',rarity:'rare',power:200,zone:5,set:'underworld'},
{id:'demon_plate',name:'Demon Plate',icon:'🛡️',rarity:'rare',power:150,defense:60,zone:5,set:'underworld'},
{id:'hellfire_staff',name:'Hellfire Staff',icon:'🔥',rarity:'epic',power:600,zone:5,set:'underworld'},
{id:'soul_reaper',name:'Soul Reaper',icon:'⚔️',rarity:'legendary',power:1800,zone:5,set:'underworld'},
{id:'death_crown',name:'Death Crown',icon:'👑',rarity:'mythic',power:5000,defense:300,zone:5,set:'underworld'},
{id:'underworld_blade',name:'Underworld Blade',icon:'🗡️',rarity:'divine',power:18000,zone:5,set:'underworld'},
// Celestial gear
{id:'angel_sword',name:'Angel Sword',icon:'⚔️',rarity:'rare',power:250,zone:6,set:'celestial'},
{id:'divine_robe',name:'Divine Robe',icon:'👘',rarity:'epic',power:700,defense:100,zone:6,set:'celestial'},
{id:'seraph_lance',name:'Seraph Lance',icon:'🔱',rarity:'legendary',power:2200,zone:6,set:'celestial'},
{id:'god_plate',name:'God Plate',icon:'🛡️',rarity:'mythic',power:6000,defense:500,zone:6,set:'celestial'},
{id:'heaven_blade',name:'Heaven Blade',icon:'⚔️',rarity:'divine',power:20000,zone:6,set:'celestial'},
{id:'celestial_edge',name:'Celestial Edge',icon:'💫',rarity:'cosmic',power:50000,zone:6,set:'celestial'},
// Ultra-rare gear
{id:'ethereal_blade',name:'Ethereal Blade',icon:'⚔️',rarity:'ethereal',power:100000,zone:6,set:'celestial'},
{id:'impossible_shield',name:'Impossible Shield',icon:'🛡️',rarity:'impossible',power:200000,defense:5000,zone:6,set:'celestial'},
{id:'godly_sword',name:'Godly Sword',icon:'⚔️',rarity:'godly',power:500000,zone:6,set:'celestial'},
{id:'primordial_staff',name:'Primordial Staff',icon:'🪄',rarity:'primordial',power:2000000,zone:6,set:'celestial'},
{id:'eternal_armor',name:'Eternal Armor',icon:'🛡️',rarity:'eternal',power:5000000,defense:50000,zone:6,set:'celestial'},
{id:'omega_blade',name:'Omega Blade',icon:'⚔️',rarity:'omega',power:20000000,zone:6,set:'celestial'},
{id:'infinity_crown',name:'Infinity Crown',icon:'👑',rarity:'infinity',power:100000000,defense:200000,zone:6,set:'celestial'},
{id:'transcendent_edge',name:'Transcendent Edge',icon:'💫',rarity:'transcendent',power:500000000,zone:6,set:'celestial'},
{id:'glitched_weapon',name:'GLITCHED Weapon',icon:'⚠️',rarity:'glitched',power:2000000000,zone:6,set:'celestial'},
{id:'reality_sword',name:'Reality Sword',icon:'✦',rarity:'reality',power:10000000000,zone:6,set:'celestial'},
{id:'underworld_ring',name:'Underworld Ring',icon:'💍',rarity:'epic',power:500,zone:5,set:'underworld'},
{id:'soul_pendant',name:'Soul Pendant',icon:'📿',rarity:'legendary',power:1500,defense:80,zone:5,set:'underworld'},
{id:'heaven_ring',name:'Heaven Ring',icon:'💍',rarity:'epic',power:600,zone:6,set:'celestial'},
];
// === EGGS & PETS ===
const EGG_TYPES=[
{id:'basic_egg',name:'Basic Egg',icon:'🥚',cost:400,currency:'gold',hatchTime:45,pool:['lucky_cat','speed_bunny','gold_hamster','dust_bunny','shadow_wolf','coin_pig']},
{id:'rare_egg',name:'Rare Egg',icon:'🪺',cost:2000,currency:'gold',hatchTime:120,pool:['crystal_fox','shadow_owl','ember_drake','flame_parrot','ice_wolf','swift_hawk','iron_rhino','mystic_owl']},
{id:'epic_egg',name:'Epic Egg',icon:'🥚',cost:30,currency:'gems',hatchTime:300,pool:['void_serpent','star_phoenix','frost_titan','thunder_bear','ghost_cat','blood_bat','storm_eagle','golden_goose']},
{id:'legend_egg',name:'Legend Egg',icon:'✨',cost:120,currency:'gems',hatchTime:900,pool:['celestial_dragon','time_cat','reality_pup','diamond_turtle','phoenix_pup','ancient_tortoise','phoenix_lord']},
{id:'cosmic_egg',name:'Cosmic Egg',icon:'🌌',cost:600,currency:'gems',hatchTime:1800,pool:['universe_worm','infinity_bird','god_hamster','void_whale','cosmic_jellyfish','shadow_dragon','time_serpent']},
{id:'divine_egg',name:'Divine Egg',icon:'💫',cost:3000,currency:'gems',hatchTime:3600,pool:['void_whale','cosmic_jellyfish','reality_dragon','divine_phoenix','omega_wolf']},
{id:'ultra_egg',name:'Ultra Egg',icon:'🌟',cost:25000,currency:'gems',hatchTime:7200,pool:['ethereal_cat','impossible_bird','godly_hamster','primordial_serpent','eternal_dragon']},
{id:'dust_egg',name:'Dust Egg',icon:'✨',cost:1000,currency:'dust',hatchTime:600,pool:['ghost_cat','thunder_bear','diamond_turtle','phoenix_pup','blood_bat','storm_eagle']},
];
const PETS=[
{id:'lucky_cat',name:'Lucky Cat',icon:'🐱',rarity:'uncommon',bonus:{type:'luck',value:0.3},desc:'+0.3 Luck'},
{id:'speed_bunny',name:'Speed Bunny',icon:'🐰',rarity:'uncommon',bonus:{type:'speed',value:0.2},desc:'+20% Speed'},
{id:'gold_hamster',name:'Gold Hamster',icon:'🐹',rarity:'uncommon',bonus:{type:'gold',value:0.25},desc:'+25% Gold'},
{id:'crystal_fox',name:'Crystal Fox',icon:'🦊',rarity:'rare',bonus:{type:'luck',value:0.8},desc:'+0.8 Luck'},
{id:'shadow_owl',name:'Shadow Owl',icon:'🦉',rarity:'rare',bonus:{type:'crit',value:0.05},desc:'+5% Crit'},
{id:'ember_drake',name:'Ember Drake',icon:'🐲',rarity:'rare',bonus:{type:'dmg',value:0.3},desc:'+30% DMG'},
{id:'void_serpent',name:'Void Serpent',icon:'🐍',rarity:'epic',bonus:{type:'luck',value:2},desc:'+2 Luck'},
{id:'star_phoenix',name:'Star Phoenix',icon:'🦅',rarity:'epic',bonus:{type:'xp',value:0.5},desc:'+50% XP'},
{id:'frost_titan',name:'Frost Titan',icon:'🧊',rarity:'epic',bonus:{type:'def',value:50},desc:'+50 DEF'},
{id:'celestial_dragon',name:'Celestial Dragon',icon:'🐉',rarity:'legendary',bonus:{type:'luck',value:5},desc:'+5 Luck'},
{id:'time_cat',name:'Time Cat',icon:'⏰',rarity:'legendary',bonus:{type:'speed',value:0.5},desc:'+50% Speed'},
{id:'reality_pup',name:'Reality Pup',icon:'🐕',rarity:'legendary',bonus:{type:'all',value:0.2},desc:'+20% All'},
{id:'universe_worm',name:'Universe Worm',icon:'🪱',rarity:'mythic',bonus:{type:'luck',value:15},desc:'+15 Luck'},
{id:'infinity_bird',name:'Infinity Bird',icon:'🕊️',rarity:'mythic',bonus:{type:'dmg',value:1},desc:'+100% DMG'},
{id:'god_hamster',name:'God Hamster',icon:'🐹',rarity:'mythic',bonus:{type:'all',value:0.5},desc:'+50% All'},
// Extra pets
{id:'dust_bunny',name:'Dust Bunny',icon:'🐇',rarity:'uncommon',bonus:{type:'gold',value:0.15},desc:'+15% Gold'},
{id:'flame_parrot',name:'Flame Parrot',icon:'🦜',rarity:'rare',bonus:{type:'xp',value:0.3},desc:'+30% XP'},
{id:'ice_wolf',name:'Ice Wolf',icon:'🐺',rarity:'rare',bonus:{type:'dmg',value:0.2},desc:'+20% DMG'},
{id:'thunder_bear',name:'Thunder Bear',icon:'🐻',rarity:'epic',bonus:{type:'crit',value:0.08},desc:'+8% Crit'},
{id:'ghost_cat',name:'Ghost Cat',icon:'🐈‍⬛',rarity:'epic',bonus:{type:'luck',value:1.5},desc:'+1.5 Luck'},
{id:'diamond_turtle',name:'Diamond Turtle',icon:'🐢',rarity:'legendary',bonus:{type:'def',value:100},desc:'+100 DEF'},
{id:'phoenix_pup',name:'Phoenix Pup',icon:'🐕‍🦺',rarity:'legendary',bonus:{type:'all',value:0.25},desc:'+25% All'},
{id:'void_whale',name:'Void Whale',icon:'🐳',rarity:'divine',bonus:{type:'luck',value:10},desc:'+10 Luck'},
{id:'cosmic_jellyfish',name:'Cosmic Jellyfish',icon:'🪼',rarity:'divine',bonus:{type:'all',value:0.6},desc:'+60% All'},
{id:'reality_dragon',name:'Reality Dragon',icon:'🐲',rarity:'cosmic',bonus:{type:'all',value:1},desc:'+100% All'},
// More pets
{id:'shadow_wolf',name:'Shadow Wolf',icon:'🐺',rarity:'uncommon',bonus:{type:'dmg',value:0.15},desc:'+15% DMG'},
{id:'coin_pig',name:'Coin Pig',icon:'🐷',rarity:'uncommon',bonus:{type:'gold',value:0.2},desc:'+20% Gold'},
{id:'swift_hawk',name:'Swift Hawk',icon:'🦅',rarity:'rare',bonus:{type:'speed',value:0.25},desc:'+25% Speed'},
{id:'iron_rhino',name:'Iron Rhino',icon:'🦏',rarity:'rare',bonus:{type:'def',value:30},desc:'+30 DEF'},
{id:'mystic_owl',name:'Mystic Owl',icon:'🦉',rarity:'rare',bonus:{type:'xp',value:0.25},desc:'+25% XP'},
{id:'blood_bat',name:'Blood Bat',icon:'🦇',rarity:'epic',bonus:{type:'lifesteal',value:0.06},desc:'+6% Lifesteal'},
{id:'storm_eagle',name:'Storm Eagle',icon:'🦅',rarity:'epic',bonus:{type:'crit',value:0.07},desc:'+7% Crit'},
{id:'golden_goose',name:'Golden Goose',icon:'🪿',rarity:'epic',bonus:{type:'gold',value:0.5},desc:'+50% Gold'},
{id:'ancient_tortoise',name:'Ancient Tortoise',icon:'🐢',rarity:'legendary',bonus:{type:'def',value:150},desc:'+150 DEF'},
{id:'phoenix_lord',name:'Phoenix Lord',icon:'🦚',rarity:'legendary',bonus:{type:'all',value:0.3},desc:'+30% All'},
{id:'shadow_dragon',name:'Shadow Dragon',icon:'🐲',rarity:'mythic',bonus:{type:'dmg',value:1.5},desc:'+150% DMG'},
{id:'time_serpent',name:'Time Serpent',icon:'🐍',rarity:'mythic',bonus:{type:'speed',value:0.8},desc:'+80% Speed'},
{id:'divine_phoenix',name:'Divine Phoenix',icon:'🔥',rarity:'divine',bonus:{type:'all',value:0.8},desc:'+80% All'},
{id:'omega_wolf',name:'Omega Wolf',icon:'🐺',rarity:'cosmic',bonus:{type:'all',value:1.5},desc:'+150% All'},
// Ultra-rare pets
{id:'ethereal_cat',name:'Ethereal Cat',icon:'🐱',rarity:'ethereal',bonus:{type:'all',value:2},desc:'+200% All'},
{id:'impossible_bird',name:'Impossible Bird',icon:'🦅',rarity:'impossible',bonus:{type:'all',value:4},desc:'+400% All'},
{id:'godly_hamster',name:'Godly Hamster',icon:'🐹',rarity:'godly',bonus:{type:'all',value:8},desc:'+800% All'},
{id:'primordial_serpent',name:'Primordial Serpent',icon:'🐍',rarity:'primordial',bonus:{type:'luck',value:500},desc:'+500 Luck'},
{id:'eternal_dragon',name:'Eternal Dragon',icon:'🐉',rarity:'eternal',bonus:{type:'all',value:25},desc:'+2500% All'},
{id:'omega_phoenix',name:'Omega Phoenix',icon:'🔥',rarity:'omega',bonus:{type:'all',value:50},desc:'+5000% All'},
{id:'infinity_turtle',name:'Infinity Turtle',icon:'🐢',rarity:'infinity',bonus:{type:'def',value:10000},desc:'+10K DEF'},
{id:'transcendent_fox',name:'Transcendent Fox',icon:'🦊',rarity:'transcendent',bonus:{type:'all',value:300},desc:'+30000% All'},
{id:'glitched_bug',name:'Glitched Bug',icon:'🪲',rarity:'glitched',bonus:{type:'all',value:800},desc:'+80000% All'},
{id:'reality_god',name:'Reality God',icon:'👑',rarity:'reality',bonus:{type:'all',value:5000},desc:'+500000% All'},
{id:'lucky_clover',name:'Lucky Clover',icon:'☘️',rarity:'uncommon',bonus:{type:'luck',value:0.25},desc:'+0.25 Luck'},
];

// === SKILLS, ZONES, DUNGEONS ===
const SKILLS=[
{id:'power_strike',name:'Power Strike',icon:'💥',desc:'3x dmg hit',cd:10,lvl:3,fx:'dmgX',val:3},
{id:'heal',name:'Heal',icon:'💚',desc:'Heal 30%',cd:15,lvl:5,fx:'heal',val:0.3},
{id:'crit_surge',name:'Crit Surge',icon:'⚡',desc:'5 crits',cd:20,lvl:8,fx:'critB',val:5},
{id:'gold_rush',name:'Gold Rush',icon:'🪙',desc:'5x gold 10s',cd:30,lvl:12,fx:'goldB',val:5},
{id:'lucky_star',name:'Lucky Star',icon:'🍀',desc:'3x luck 30s',cd:60,lvl:15,fx:'luckB',val:3},
{id:'nuke',name:'Nuke',icon:'💣',desc:'Instakill',cd:45,lvl:20,fx:'nuke',val:1},
];
const ELITE_MODS=['Enraged','Armored','Swift','Glowing','Cursed'];
const ZONES=[
{id:'plains',name:'Green Plains',icon:'🌿',desc:'Starter zone.',reqPower:0,enemies:[{name:'Slime',icon:'🟢',hp:40,dmg:4,gold:8,xp:5},{name:'Goblin',icon:'👺',hp:70,dmg:7,gold:14,xp:8},{name:'Wolf',icon:'🐺',hp:110,dmg:11,gold:22,xp:12},{name:'Bandit Chief',icon:'🥷',hp:250,dmg:20,gold:60,xp:35,boss:true}],gearDrop:0.12},
{id:'volcanic',name:'Volcanic Depths',icon:'🌋',desc:'Scorching caves.',reqPower:80,enemies:[{name:'Fire Imp',icon:'😈',hp:180,dmg:22,gold:35,xp:20},{name:'Lava Golem',icon:'🗿',hp:350,dmg:35,gold:55,xp:32},{name:'Flame Wyrm',icon:'🐲',hp:550,dmg:50,gold:85,xp:50},{name:'Inferno Lord',icon:'👹',hp:1200,dmg:75,gold:250,xp:120,boss:true}],gearDrop:0.10},
{id:'ocean',name:'Abyssal Ocean',icon:'🌊',desc:'Crushing depths.',reqPower:400,enemies:[{name:'Angler',icon:'🐟',hp:700,dmg:60,gold:120,xp:65},{name:'Kraken',icon:'🐙',hp:1400,dmg:90,gold:200,xp:100},{name:'Leviathan',icon:'🐋',hp:2800,dmg:140,gold:350,xp:180},{name:'Abyssal King',icon:'🔱',hp:6000,dmg:220,gold:900,xp:450,boss:true}],gearDrop:0.08},
{id:'void',name:'Void Realm',icon:'🕳️',desc:'Reality bends.',reqPower:2000,enemies:[{name:'Void Walker',icon:'👤',hp:4500,dmg:280,gold:500,xp:300},{name:'Nebula Beast',icon:'🌌',hp:10000,dmg:450,gold:900,xp:500},{name:'Star Eater',icon:'⭐',hp:22000,dmg:750,gold:1800,xp:900},{name:'Void God',icon:'🌑',hp:50000,dmg:1200,gold:5000,xp:2500,boss:true}],gearDrop:0.07},
{id:'cosmos',name:'Reality Core',icon:'🌀',desc:'Center of existence.',reqPower:12000,enemies:[{name:'Shard',icon:'💠',hp:28000,dmg:900,gold:2500,xp:1400},{name:'Paradox',icon:'⏳',hp:70000,dmg:2000,gold:5000,xp:2800},{name:'Entity',icon:'🌟',hp:160000,dmg:3500,gold:12000,xp:6000},{name:'CREATOR',icon:'👁️',hp:500000,dmg:6500,gold:50000,xp:25000,boss:true}],gearDrop:0.06},
{id:'underworld',name:'Underworld',icon:'💀',desc:'Realm of the dead.',reqPower:45000,enemies:[{name:'Lost Soul',icon:'👻',hp:90000,dmg:4500,gold:8000,xp:4500},{name:'Demon Knight',icon:'😈',hp:220000,dmg:7500,gold:18000,xp:9000},{name:'Lich',icon:'☠️',hp:450000,dmg:11000,gold:40000,xp:18000},{name:'Death God',icon:'💀',hp:1300000,dmg:18000,gold:120000,xp:60000,boss:true}],gearDrop:0.06},
{id:'celestial',name:'Celestial Realm',icon:'😇',desc:'Domain of the gods.',reqPower:180000,enemies:[{name:'Cherub',icon:'👼',hp:350000,dmg:14000,gold:25000,xp:12000},{name:'Seraph',icon:'🪽',hp:900000,dmg:23000,gold:55000,xp:25000},{name:'Archangel',icon:'⚔️',hp:2500000,dmg:38000,gold:120000,xp:55000},{name:'GOD',icon:'✦',hp:8000000,dmg:75000,gold:400000,xp:150000,boss:true}],gearDrop:0.05},
];
const DUNGEONS=[
{id:'d1',name:"Goblin Lair",icon:'👑',reqPower:25,boss:{name:'Goblin King',icon:'👺',hp:1500},time:30,rewards:{gold:800,gems:10,gear:'chain_mail'}},
{id:'d2',name:"Dragon Nest",icon:'🐉',reqPower:120,boss:{name:'Dragon',icon:'🐲',hp:8000},time:45,rewards:{gold:4000,gems:40,gear:'inferno_blade'}},
{id:'d3',name:"Kraken Deep",icon:'🐙',reqPower:500,boss:{name:'Kraken',icon:'🐙',hp:40000},time:60,rewards:{gold:20000,gems:120,gear:'ocean_trident'}},
{id:'d4',name:"Void Throne",icon:'🌑',reqPower:2500,boss:{name:'Void Emperor',icon:'👁️',hp:180000},time:75,rewards:{gold:100000,gems:400,gear:'universe_ender'}},
{id:'d5',name:"Reality Fracture",icon:'🌀',reqPower:12000,boss:{name:'Reality',icon:'🌀',hp:800000},time:90,rewards:{gold:600000,gems:1500,gear:'infinity_edge'}},
{id:'d6',name:"Hell's Gate",icon:'💀',reqPower:45000,boss:{name:'Hell Lord',icon:'😈',hp:4000000},time:100,rewards:{gold:3000000,gems:4000,gear:'death_crown'}},
{id:'d7',name:"Heaven's Trial",icon:'😇',reqPower:180000,boss:{name:'Supreme Angel',icon:'👼',hp:20000000},time:120,rewards:{gold:15000000,gems:12000,gear:'celestial_edge'}},
];

// === POTIONS ===
const POTIONS=[
{id:'luck_pot',name:'Luck Potion',icon:'🍀',desc:'2x Luck for 120s',cost:60,currency:'dust',duration:120,effect:{type:'luck',value:2}},
{id:'gold_pot',name:'Gold Potion',icon:'🪙',desc:'3x Gold for 120s',cost:80,currency:'dust',duration:120,effect:{type:'gold',value:3}},
{id:'xp_pot',name:'XP Potion',icon:'📖',desc:'2x XP for 120s',cost:70,currency:'dust',duration:120,effect:{type:'xp',value:2}},
{id:'dmg_pot',name:'Power Potion',icon:'⚔️',desc:'2x DMG for 90s',cost:100,currency:'dust',duration:90,effect:{type:'dmg',value:2}},
{id:'speed_pot',name:'Speed Potion',icon:'⚡',desc:'2x Roll Speed for 120s',cost:50,currency:'dust',duration:120,effect:{type:'speed',value:2}},
{id:'mega_luck',name:'Mega Luck',icon:'☘️',desc:'5x Luck for 60s',cost:300,currency:'dust',duration:60,effect:{type:'luck',value:5}},
];

// === DAILY REWARDS ===
const DAILY_REWARDS=[
{day:1,reward:{gold:1500,gems:5}},
{day:2,reward:{gold:3000,dust:150}},
{day:3,reward:{gems:25,dust:300}},
{day:4,reward:{gold:8000,gems:20,dust:500}},
{day:5,reward:{gems:50,dust:800,enchantStones:2}},
{day:6,reward:{gold:20000,gems:75,dust:1500}},
{day:7,reward:{gems:200,dust:5000,enchantStones:5}},
];

// === CODES ===
const CODES={
'LAUNCH2026':{gold:5000,gems:50,used:false},
'RNGGOD':{gems:150,dust:800,used:false},
'TOWER':{gold:8000,gems:40,dust:300,used:false},
'BIGUPDATE':{gems:400,dust:1500,enchantStones:4,used:false},
'PETLOVER':{gems:250,dust:800,used:false,special:'egg'},
'LUCKY10X':{gems:80,dust:500,used:false,special:'luck10x'},
'ENCHANTME':{enchantStones:8,dust:2000,used:false},
'NEWZONES':{gold:15000,gems:150,dust:500,used:false},
'CELESTIAL':{gems:400,dust:3000,enchantStones:3,used:false},
'UNDERWORLD':{gold:20000,gems:250,dust:1500,used:false},
'LUCK5MIN':{gems:60,dust:300,used:false,special:'luck5x'},
'MEGADUST':{dust:8000,gems:50,used:false},
'BIGQOL':{gold:10000,gems:300,dust:2000,enchantStones:3,used:false},
};

// === QUESTS ===
const QUESTS=[
{id:'q1',name:'First Steps',desc:'Roll 10 times',check:s=>s.totalRolls>=10,reward:{gold:200},next:'q2'},
{id:'q2',name:'Fighter',desc:'Kill 5 enemies',check:s=>s.killCount>=5,reward:{gold:300},next:'q3'},
{id:'q3',name:'Rare Find',desc:'Get a Rare aura',check:s=>ri(s.bestRarity)>=2,reward:{gems:10,gold:500},next:'q4'},
{id:'q4',name:'Level 5',desc:'Reach Lv.5',check:s=>s.level>=5,reward:{gold:800,gems:5},next:'q5'},
{id:'q5',name:'Pet Owner',desc:'Hatch a pet',check:s=>Object.keys(s.pets).length>=1,reward:{gems:20,dust:50},next:'q6'},
{id:'q6',name:'Epic!',desc:'Get an Epic aura',check:s=>ri(s.bestRarity)>=3,reward:{gems:30,gold:1500},next:'q7'},
{id:'q7',name:'Explorer',desc:'Enter Zone 2',check:s=>s.currentZone>=1,reward:{gold:2000,gems:15},next:'q8'},
{id:'q8',name:'Boss Kill',desc:'Defeat a boss',check:s=>s.bossKills>=1,reward:{gems:40,gold:3000},next:'q9'},
{id:'q9',name:'Dungeon',desc:'Clear a dungeon',check:s=>s.dungeonsDone.length>=1,reward:{gems:80,dust:200},next:'q10'},
{id:'q10',name:'Legendary!',desc:'Get a Legendary',check:s=>ri(s.bestRarity)>=4,reward:{gems:100,gold:8000},next:'q11'},
{id:'q11',name:'Lv.20',desc:'Reach Lv.20',check:s=>s.level>=20,reward:{gold:10000,gems:60},next:'q12'},
{id:'q12',name:'Rebirth',desc:'Rebirth once',check:s=>s.rebirths>=1,reward:{gems:200,dust:1000},next:'q13'},
{id:'q13',name:'Deep Dive',desc:'Enter Zone 3',check:s=>s.currentZone>=2,reward:{gold:25000,gems:80},next:'q14'},
{id:'q14',name:'Mythic!',desc:'Get a Mythic',check:s=>ri(s.bestRarity)>=5,reward:{gems:300,dust:2000},next:'q15'},
{id:'q15',name:'Tower 10',desc:'Reach Tower F10',check:s=>s.towerFloor>=10,reward:{gems:200,enchantStones:3},next:'q16'},
{id:'q16',name:'Void',desc:'Enter Zone 4',check:s=>s.currentZone>=3,reward:{gold:100000,gems:200},next:'q17'},
{id:'q17',name:'Divine!',desc:'Get a Divine',check:s=>ri(s.bestRarity)>=6,reward:{gems:500,dust:5000},next:'q18'},
{id:'q18',name:'Reality',desc:'Enter Zone 5',check:s=>s.currentZone>=4,reward:{gems:1000,dust:10000},next:'q19'},
{id:'q19',name:'Cosmic!',desc:'Get a Cosmic',check:s=>ri(s.bestRarity)>=7,reward:{gems:3000,dust:25000},next:'q20'},
{id:'q20',name:'THE END?',desc:'Get Impossible',check:s=>ri(s.bestRarity)>=9,reward:{gems:50000,dust:100000},next:null},
];

// === ACHIEVEMENTS ===
const ACHIEVEMENTS=[
{id:'r100',name:'100 Rolls',desc:'Roll 100x',check:s=>s.totalRolls>=100,reward:{gold:500}},
{id:'r1k',name:'1K Rolls',desc:'Roll 1,000x',check:s=>s.totalRolls>=1000,reward:{gems:40,dust:200}},
{id:'r10k',name:'10K Rolls',desc:'Roll 10,000x',check:s=>s.totalRolls>=10000,reward:{gems:200,dust:2000}},
{id:'k100',name:'100 Kills',desc:'Kill 100',check:s=>s.killCount>=100,reward:{gems:20,gold:1000}},
{id:'k1k',name:'1K Kills',desc:'Kill 1,000',check:s=>s.killCount>=1000,reward:{gems:80,gold:5000}},
{id:'e10',name:'10 Elites',desc:'Kill 10 elites',check:s=>s.eliteKills>=10,reward:{gems:40,dust:100}},
{id:'lv25',name:'Lv.25',desc:'Reach Lv.25',check:s=>s.level>=25,reward:{gems:80,gold:5000}},
{id:'lv50',name:'Lv.50',desc:'Reach Lv.50',check:s=>s.level>=50,reward:{gems:400,dust:3000}},
{id:'rb3',name:'Rebirth x3',desc:'3 rebirths',check:s=>s.rebirths>=3,reward:{gems:500,dust:5000}},
{id:'ms',name:'Shiny!',desc:'Find Shiny',check:s=>s.modsFound.includes('shiny'),reward:{gems:15,dust:50}},
{id:'mv',name:'Void!',desc:'Find Void mod',check:s=>s.modsFound.includes('void'),reward:{gems:80,dust:500}},
{id:'p5',name:'5 Pets',desc:'Own 5 pets',check:s=>Object.keys(s.pets).length>=5,reward:{gems:80,dust:300}},
{id:'t25',name:'Tower F25',desc:'Floor 25',check:s=>s.towerFloor>=25,reward:{gems:250,dust:1000}},
{id:'t50',name:'Tower F50',desc:'Floor 50',check:s=>s.towerFloor>=50,reward:{gems:800,dust:5000}},
{id:'d3',name:'3 Dungeons',desc:'Clear 3',check:s=>s.dungeonsDone.length>=3,reward:{gems:150,dust:500}},
{id:'rap10k',name:'10K RAP',desc:'Total RAP 10K',check:s=>calcRAP(s)>=10000,reward:{gems:200,dust:1000}},
{id:'rap100k',name:'100K RAP',desc:'Total RAP 100K',check:s=>calcRAP(s)>=100000,reward:{gems:1000,dust:10000}},
];

// === SHOP ===
const SHOP=[
{id:'luck_boost',name:'Luck+',desc:'+0.3 luck/lv',max:50,base:200,mult:1.55,cur:'gold'},
{id:'roll_speed',name:'Speed+',desc:'+10% speed/lv',max:25,base:350,mult:1.6,cur:'gold'},
{id:'dmg_boost',name:'DMG+',desc:'+10% dmg/lv',max:30,base:250,mult:1.55,cur:'gold'},
{id:'hp_boost',name:'HP+',desc:'+20 HP/lv',max:40,base:150,mult:1.5,cur:'gold'},
{id:'def_boost',name:'DEF+',desc:'+3 def/lv',max:30,base:200,mult:1.55,cur:'gold'},
{id:'gold_boost',name:'Gold+',desc:'+10% gold/lv',max:25,base:400,mult:1.6,cur:'gold'},
{id:'xp_boost',name:'XP+',desc:'+8% XP/lv',max:30,base:300,mult:1.55,cur:'gold'},
{id:'crit_boost',name:'Crit+',desc:'+2% crit/lv',max:20,base:30,mult:1.7,cur:'gems'},
{id:'double_roll',name:'Double+',desc:'+1.5% double/lv',max:20,base:40,mult:1.7,cur:'gems'},
{id:'gear_luck',name:'Gear+',desc:'+8% drop/lv',max:20,base:35,mult:1.7,cur:'gems'},
{id:'egg_speed',name:'Hatch+',desc:'+10% hatch/lv',max:20,base:25,mult:1.6,cur:'gems'},
{id:'mod_luck',name:'Mod+',desc:'+8% mod chance/lv',max:15,base:50,mult:1.8,cur:'gems'},
{id:'offline_boost',name:'Offline+',desc:'+15% offline/lv',max:20,base:40,mult:1.7,cur:'gems'},
{id:'aura_slots',name:'Aura Slots',desc:'+1 equip slot',max:2,base:200,mult:4,cur:'gems'},
{id:'auto_roll',name:'Auto Roll',desc:'Unlock & speed up auto',max:10,base:800,mult:2,cur:'gold'},
{id:'multi_roll',name:'Multi Roll',desc:'Roll multiple (+1/lv)',max:9,base:600,mult:2,cur:'gold'},
{id:'auto_battle',name:'Auto Battle',desc:'Unlock auto-fight',max:1,base:500,mult:1,cur:'gold'},
{id:'inv_slots',name:'Inventory+',desc:'+10 aura slots/lv',max:15,base:200,mult:1.6,cur:'gold'},
{id:'auto_sell_unlock',name:'Auto Sell',desc:'Unlock auto-selling',max:1,base:1500,mult:1,cur:'gold'},
];

const REBIRTH_REQS=[{lv:25,gold:40000},{lv:35,gold:150000},{lv:45,gold:600000},{lv:55,gold:3e6},{lv:65,gold:15e6},{lv:75,gold:60e6},{lv:90,gold:300e6},{lv:105,gold:1.5e9}];
const RB_BONUS={luck:0.3,power:0.08,xp:0.15,gold:0.15};
const SELL_VAL={common:1,uncommon:3,rare:10,epic:30,legendary:100,mythic:500,divine:2000,cosmic:10000,ethereal:50000,impossible:500000,godly:5000000,primordial:50000000,eternal:500000000,omega:5000000000,infinity:50000000000,transcendent:500000000000,glitched:5000000000000,reality:50000000000000};

// === TRADING POST (rotating stock, refreshes) ===
const TRADE_POOL=[
    {id:'t1',aura:'crystal_vein',cost:30,currency:'dust'},
    {id:'t2',aura:'blood_moon',cost:45,currency:'dust'},
    {id:'t3',aura:'phoenix_feather',cost:50,currency:'dust'},
    {id:'t4',aura:'inferno_core',cost:60,currency:'dust'},
    {id:'t5',aura:'singularity',cost:150,currency:'dust'},
    {id:'t6',aura:'dimension_tear',cost:400,currency:'dust'},
    {id:'t7',aura:'void_emperor',cost:1200,currency:'dust'},
    {id:'t8',aura:'hellfire_crown',cost:250,currency:'dust'},
    {id:'t9',aura:'leviathan_soul',cost:1500,currency:'dust'},
    {id:'t10',aura:'cosmic_creator',cost:4000,currency:'dust'},
];

// === ENCHANTMENTS ===
const ENCHANT_POOL=[
    {id:'ench_dmg',name:'+DMG',stat:'dmg',min:0.05,max:0.3},
    {id:'ench_crit',name:'+Crit',stat:'crit',min:0.02,max:0.1},
    {id:'ench_luck',name:'+Luck',stat:'luck',min:0.2,max:2},
    {id:'ench_gold',name:'+Gold',stat:'gold',min:0.1,max:0.5},
    {id:'ench_hp',name:'+HP',stat:'hp',min:10,max:100},
    {id:'ench_def',name:'+DEF',stat:'def',min:5,max:50},
    {id:'ench_ls',name:'+Lifesteal',stat:'lifesteal',min:0.02,max:0.08},
];
const ENCHANT_COST={base:120,perSlot:1.4}; // dust cost, scales per existing enchant

// === WORLD BOSSES (expanded with phases, enrage, exclusive loot) ===
const WORLD_BOSSES=[
    {id:'wb_titan',name:'World Titan',icon:'🗿',hp:800000,enrageTime:120,phases:[
        {threshold:1,name:'Phase 1: Awakening',dmgMult:1,color:'var(--uncommon)'},
        {threshold:0.6,name:'Phase 2: Fury',dmgMult:1.5,color:'var(--legendary)'},
        {threshold:0.3,name:'Phase 3: Rampage',dmgMult:2.5,color:'var(--mythic)'}],
        rewards:{gold:150000,gems:400,dust:3000},milestones:[
        {dmg:80000,reward:{gold:30000}},{dmg:250000,reward:{gems:80,dust:500}},{dmg:500000,reward:{dust:1500,enchantStones:3}},{dmg:800000,reward:{gems:400,dust:5000}}]},
    {id:'wb_dragon',name:'Elder Wyrm',icon:'🐉',hp:4000000,enrageTime:180,phases:[
        {threshold:1,name:'Phase 1: Slumber',dmgMult:0.8,color:'var(--uncommon)'},
        {threshold:0.5,name:'Phase 2: Inferno',dmgMult:2,color:'var(--legendary)'},
        {threshold:0.2,name:'Phase 3: Apocalypse',dmgMult:3,color:'var(--mythic)'}],
        rewards:{gold:800000,gems:1500,dust:15000},milestones:[
        {dmg:400000,reward:{gold:150000}},{dmg:1200000,reward:{gems:400,dust:3000}},{dmg:2500000,reward:{dust:8000,enchantStones:8}},{dmg:4000000,reward:{gems:1500,dust:25000}}]},
    {id:'wb_god',name:'Fallen God',icon:'⚡',hp:20000000,enrageTime:240,phases:[
        {threshold:1,name:'Phase 1: Descent',dmgMult:1,color:'var(--uncommon)'},
        {threshold:0.7,name:'Phase 2: Wrath',dmgMult:2,color:'var(--legendary)'},
        {threshold:0.4,name:'Phase 3: Judgment',dmgMult:3,color:'var(--mythic)'},
        {threshold:0.15,name:'Phase 4: Extinction',dmgMult:5,color:'var(--divine)'}],
        rewards:{gold:5000000,gems:5000,dust:80000},milestones:[
        {dmg:2000000,reward:{gold:800000}},{dmg:6000000,reward:{gems:1500,dust:15000}},{dmg:12000000,reward:{dust:40000,enchantStones:15}},{dmg:20000000,reward:{gems:5000,dust:150000}}]},
];

// === ASCENSION (prestige layer 2, resets rebirths) ===
const ASCENSION_REQS=[
    {rebirths:5,gems:10000},
    {rebirths:8,gems:50000},
    {rebirths:12,gems:200000},
    {rebirths:15,gems:1000000},
];
const ASC_BONUS={luck:2,power:0.5,xp:0.5,gold:0.5}; // per ascension level
function ri(r){return RARITIES.findIndex(x=>x.id===r);}
function calcRAP(s){let t=0;for(const[id,entries]of Object.entries(s.auras||{})){const a=AURAS.find(x=>x.id===id);if(!a)continue;for(const e of entries){let p=getRarity(a.rarity).power;if(e.modifier){const m=MODIFIERS.find(x=>x.id===e.modifier);if(m)p*=m.pMult;}t+=p;}}return Math.floor(t);}

// === COLLECTION MILESTONES ===
const COLLECTION_MILESTONES=[
    {count:10,reward:{gold:5000,gems:20},label:'10 Unique Auras'},
    {count:25,reward:{gold:20000,gems:50,dust:200},label:'25 Unique Auras'},
    {count:50,reward:{gems:200,dust:1000,enchantStones:5},label:'50 Unique Auras'},
    {count:75,reward:{gems:500,dust:5000,enchantStones:10},label:'75 Unique Auras'},
    {count:100,reward:{gems:2000,dust:20000,enchantStones:20},label:'100 Unique Auras'},
    {count:150,reward:{gems:5000,dust:50000},label:'150 Unique Auras'},
    {count:200,reward:{gems:10000,dust:100000},label:'200 Unique Auras'},
    {count:220,reward:{gems:50000,dust:500000},label:'ALL 220 Auras!'},
];
const PET_MILESTONES=[
    {count:5,reward:{gems:30,dust:100},label:'5 Pets'},
    {count:10,reward:{gems:100,dust:500},label:'10 Pets'},
    {count:20,reward:{gems:300,dust:2000},label:'20 Pets'},
    {count:35,reward:{gems:1000,dust:10000},label:'35 Pets'},
    {count:50,reward:{gems:5000,dust:50000},label:'ALL 50 Pets!'},
];
const GEAR_MILESTONES=[
    {count:5,reward:{gold:5000,gems:20},label:'5 Gear'},
    {count:15,reward:{gold:20000,gems:80},label:'15 Gear'},
    {count:30,reward:{gems:300,dust:2000},label:'30 Gear'},
    {count:45,reward:{gems:1000,dust:10000},label:'45 Gear'},
    {count:60,reward:{gems:5000,dust:50000},label:'ALL 60 Gear!'},
];

// === TITLES ===
const TITLES=[
    {id:'newbie',name:'Newbie',desc:'Start playing',check:s=>true},
    {id:'roller',name:'Roll Addict',desc:'Roll 1,000 times',check:s=>s.totalRolls>=1000},
    {id:'rich',name:'Gold Hoarder',desc:'Own 100K gold',check:s=>s.gold>=100000},
    {id:'mythic_finder',name:'Mythic Finder',desc:'Roll a Mythic',check:s=>ri(s.bestRarity)>=5},
    {id:'divine_finder',name:'Divine Touched',desc:'Roll a Divine',check:s=>ri(s.bestRarity)>=6},
    {id:'cosmic_finder',name:'Cosmic Being',desc:'Roll a Cosmic',check:s=>ri(s.bestRarity)>=7},
    {id:'impossible_finder',name:'THE ONE',desc:'Roll Impossible',check:s=>ri(s.bestRarity)>=9},
    {id:'tower_25',name:'Tower Climber',desc:'Reach Tower F25',check:s=>s.towerFloor>=25},
    {id:'tower_50',name:'Tower Master',desc:'Reach Tower F50',check:s=>s.towerFloor>=50},
    {id:'tower_100',name:'Tower God',desc:'Reach Tower F100',check:s=>s.towerFloor>=100},
    {id:'rebirther',name:'Reborn',desc:'Rebirth 3 times',check:s=>s.rebirths>=3},
    {id:'ascended',name:'Ascended',desc:'Ascend once',check:s=>(s.ascensions||0)>=1},
    {id:'boss_slayer',name:'Boss Slayer',desc:'Kill 10 bosses',check:s=>s.bossKills>=10},
    {id:'wb_killer',name:'World Breaker',desc:'Kill 5 world bosses',check:s=>(s.wbKills||0)>=5},
    {id:'enchanter',name:'Enchant Master',desc:'Have 10 enchants on gear',check:s=>{let t=0;for(const k of Object.keys(s.enchants||{}))t+=(s.enchants[k]||[]).length;return t>=10;}},
    {id:'pet_master',name:'Pet Whisperer',desc:'Own 10 pets',check:s=>Object.keys(s.pets||{}).length>=10},
    {id:'collector',name:'Collector',desc:'Own 50 unique auras',check:s=>Object.keys(s.auras||{}).length>=50},
    {id:'max_power',name:'Overpowered',desc:'Reach 10K power',check:s=>false},// checked dynamically
];

// === LUCKY WHEEL ===
const WHEEL_PRIZES=[
    {name:'200 Gold',weight:25,reward:{gold:200}},
    {name:'1K Gold',weight:18,reward:{gold:1000}},
    {name:'5K Gold',weight:10,reward:{gold:5000}},
    {name:'15 Gems',weight:12,reward:{gems:15}},
    {name:'60 Gems',weight:5,reward:{gems:60}},
    {name:'300 Dust',weight:12,reward:{dust:300}},
    {name:'1.5K Dust',weight:6,reward:{dust:1500}},
    {name:'Enchant Stone',weight:5,reward:{enchantStones:1}},
    {name:'3 Enchant Stones',weight:3,reward:{enchantStones:3}},
    {name:'500 Gems JACKPOT',weight:1,reward:{gems:500}},
    {name:'Nothing',weight:3,reward:{}},
];
const WHEEL_COST=25; // gems per spin

// === CHALLENGES ===
const CHALLENGES=[
    {id:'ch1',name:'Speed Runner',desc:'Kill 20 enemies in 60 seconds',type:'killTimer',target:20,time:60,reward:{gems:40,gold:2000}},
    {id:'ch2',name:'Lucky Streak',desc:'Roll 5 rares+ in 30 rolls',type:'rareStreak',target:5,rolls:30,reward:{gems:60,dust:200}},
    {id:'ch3',name:'Tower Sprint',desc:'Climb 5 tower floors in one session',type:'towerClimb',target:5,reward:{gems:80,dust:500}},
    {id:'ch4',name:'No Damage',desc:'Kill 10 enemies without dying',type:'noDeath',target:10,reward:{gems:120,dust:300}},
    {id:'ch5',name:'Enchant Gambler',desc:'Successfully enchant 3 times in a row',type:'enchantStreak',target:3,reward:{enchantStones:5,dust:800}},
];

// === PROGRESSION LOCKS ===
const UNLOCK_REQS={
    crafting:5,    // Level 5
    tower:8,       // Level 8
    enchanting:10, // Level 10
    dungeons:12,   // Level 12
    fusion:15,     // Level 15
    potions:18,    // Level 18
    worldBoss:20,  // Level 20
    wheel:25,      // Level 25
    minigames:10,  // Level 10
};

// === MINIGAMES ===
const MINIGAME_COOLDOWN=120000; // 2 min between plays
const MEMORY_REWARDS={pairs3:{dust:50},pairs4:{dust:100,gems:8},pairs5:{dust:200,gems:15},pairs6:{dust:400,gems:30}};
const FRENZY_TIERS=[{clicks:20,reward:{gold:800}},{clicks:40,reward:{gold:2500}},{clicks:60,reward:{gold:5000,gems:8}},{clicks:80,reward:{gold:10000,gems:15}},{clicks:100,reward:{gold:20000,gems:30}}];

// === SERVER EVENTS ===
const SERVER_EVENTS=[
    {id:'mod_frenzy',name:'Modifier Frenzy',icon:'✨',desc:'2x modifier chance!',duration:180,effect:{type:'modChance',value:2}},
    {id:'luck_surge',name:'Luck Surge',icon:'🍀',desc:'1.5x luck for everyone!',duration:240,effect:{type:'luck',value:1.5}},
    {id:'gold_rush',name:'Gold Rush',icon:'🪙',desc:'2x gold from all sources!',duration:180,effect:{type:'gold',value:2}},
    {id:'xp_fest',name:'XP Festival',icon:'📖',desc:'2x XP gains!',duration:200,effect:{type:'xp',value:2}},
    {id:'sell_bonus',name:'Sell Bonus',icon:'💰',desc:'3x dust from selling!',duration:180,effect:{type:'sellMult',value:3}},
    {id:'egg_rush',name:'Egg Rush',icon:'🥚',desc:'2x egg hatch speed!',duration:240,effect:{type:'eggSpeed',value:2}},
    {id:'crit_storm',name:'Crit Storm',icon:'⚡',desc:'+15% crit chance!',duration:180,effect:{type:'crit',value:0.15}},
    {id:'rare_hour',name:'Rare Hour',icon:'💎',desc:'Rare+ rolls more likely!',duration:300,effect:{type:'luck',value:2}},
    {id:'enchant_boost',name:'Enchant Boost',icon:'🔮',desc:'+20% enchant success!',duration:180,effect:{type:'enchantBoost',value:0.2}},
    {id:'double_drops',name:'Double Drops',icon:'⚔️',desc:'2x gear drop rate!',duration:200,effect:{type:'gearDrop',value:2}},
];
