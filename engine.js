// === STATE ===
const DEF_STATE={
    gold:0,gems:0,dust:0,
    level:1,xp:0,hp:100,
    auras:{}, // {id:[{mod:null|str},...]}
    equippedAuras:[], // [{id,mod},...] max 1+aura_slots upgrades
    gear:{},equippedGear:[], // max 3
    pets:{},activePets:[], // max 3
    eggSlots:[],maxEggs:2,
    currentZone:0,rollZone:0,killCount:0,eliteKills:0,bossKills:0,bossesDefeated:[],
    skillCds:{},critBurst:0,goldBurstEnd:0,luckBurstEnd:0,
    totalRolls:0,bestRarity:'common',pity:0,modsFound:[],
    dryStreak:0, // rolls since last rare+
    upgrades:{},rebirths:0,
    questProg:'q1',questsDone:[],achDone:[],
    dungeonCds:{},dungeonsDone:[],
    towerFloor:1,
    potionEffects:[], // [{type,value,endTime}]
    dailyStreak:0,lastDaily:0,dailyClaimed:[],
    codesUsed:[],
    luckyAura:null,luckyEnd:0,
    activeEventId:null,activeEventEnd:0,
    totalDust:0,totalGold:0,
    // New systems
    tradeStock:[],tradeRefresh:0,
    enchants:{}, // {gearId:[{stat,value},...]}
    worldBoss:null, // {id,hp,maxHp,startTime,totalDmg,milestonesHit:[]}
    worldBossCd:0,
    wbKills:0,
    // New systems
    equippedTitle:'newbie',
    titlesUnlocked:['newbie'],
    collectionMilestonesClaimed:[],
    petMilestonesClaimed:[],
    gearMilestonesClaimed:[],
    questReady:false, // true when current quest is complete but unclaimed
    hallOfFame:[], // [{auraId,mod,rarity,time}]
    wheelSpins:0,
    fusionCount:0,
    gearUpgrades:{}, // {gearId: upgradeLevel}
    challengeProgress:{}, // {challengeId: {active,progress,startTime}}
    challengesCompleted:[],
    hybrids:{}, // {hybridId: {id,name,icon,rarity,ability,...}}
    tutorialDone:false,
    unlocksReached:[], // features unlocked by reaching level thresholds (persists rebirth, resets ascension)
    ascensions:0,
    enchantStones:0,
    petLevels:{}, // {petId: level}
    expeditions:[], // [{petId,type,startTime,duration,reward}]
    maxExpeditions:2,
    autoSellBelow:'none', // legacy, replaced by autoSellRarities
    autoSellRarities:{}, // {common:true, uncommon:true, ...}
    towerRewardsClaimed:[],
    seasonalActive:true,
    lastSave:Date.now(),
};
let S=null;
let autoRoll=null,autoFight=null,rollCdUntil=0;
let curEnemy=null,curEnemyHp=0,curElite=null;
let dgActive=null,dgInterval=null;
let luckyInterval=null;

// === SOUND SYSTEM (Web Audio API) ===
let audioCtx=null;
function initAudio(){if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();}
function playTone(freq,duration,type='sine',vol=0.15){
    if(!audioCtx)return;
    const osc=audioCtx.createOscillator();const gain=audioCtx.createGain();
    osc.connect(gain);gain.connect(audioCtx.destination);
    osc.type=type;osc.frequency.value=freq;
    gain.gain.setValueAtTime(vol,audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+duration);
    osc.start();osc.stop(audioCtx.currentTime+duration);
}
function sfxRoll(){playTone(400,0.08,'square',0.08);}
function sfxCommon(){playTone(300,0.15,'sine',0.06);}
function sfxRare(){playTone(500,0.2,'sine',0.1);setTimeout(()=>playTone(600,0.15,'sine',0.08),100);}
function sfxEpic(){playTone(600,0.2,'sine',0.12);setTimeout(()=>playTone(750,0.2,'sine',0.1),120);}
function sfxLegendary(){playTone(700,0.25,'sine',0.14);setTimeout(()=>playTone(900,0.25,'sine',0.12),150);setTimeout(()=>playTone(1100,0.3,'sine',0.1),300);}
function sfxMythic(){for(let i=0;i<5;i++)setTimeout(()=>playTone(600+i*150,0.2,'sine',0.12-i*0.015),i*80);}
function sfxHit(){if(!getSetting('sound'))return;playTone(150,0.1,'sawtooth',0.08);}
function sfxKill(){if(!getSetting('sound'))return;playTone(250,0.15,'square',0.08);setTimeout(()=>playTone(400,0.1,'square',0.06),80);}
function sfxLevelUp(){if(!getSetting('sound'))return;playTone(500,0.15,'sine',0.12);setTimeout(()=>playTone(650,0.15,'sine',0.1),100);setTimeout(()=>playTone(800,0.2,'sine',0.12),200);}
function sfxError(){if(!getSetting('sound'))return;playTone(200,0.2,'sawtooth',0.06);}
function sfxSuccess(){if(!getSetting('sound'))return;playTone(800,0.1,'sine',0.1);setTimeout(()=>playTone(1000,0.15,'sine',0.08),80);}

function sfxForRarity(rarity){
    if(!getSetting('sound'))return;
    const idx=ri(rarity);
    if(idx>=5)sfxMythic();else if(idx>=4)sfxLegendary();else if(idx>=3)sfxEpic();else if(idx>=2)sfxRare();else sfxCommon();
}

// === TOOLTIP SYSTEM ===
function showTooltip(e,html){
    const tt=document.getElementById('tooltip');if(!tt)return;
    tt.innerHTML=html;tt.classList.add('show');
    const rect=e.target.getBoundingClientRect();
    tt.style.left=Math.min(rect.left,window.innerWidth-230)+'px';
    tt.style.top=(rect.bottom+8)+'px';
}
function hideTooltip(){const tt=document.getElementById('tooltip');if(tt)tt.classList.remove('show');}

// === SCREEN SHAKE ===
function screenShake(){if(!getSetting('shake'))return;document.getElementById('app').classList.add('shake');setTimeout(()=>document.getElementById('app').classList.remove('shake'),150);}

// === SAVE/LOAD ===
function save(){S.lastSave=Date.now();localStorage.setItem('rng4',JSON.stringify(S));}
function load(){const d=localStorage.getItem('rng4');if(d){S=JSON.parse(d);for(const k of Object.keys(DEF_STATE))if(!(k in S))S[k]=JSON.parse(JSON.stringify(DEF_STATE[k]));}else S=JSON.parse(JSON.stringify(DEF_STATE));}

// === HELPERS ===
function toast(m){if(SETTINGS&&!SETTINGS.toasts)return;const c=document.getElementById('toast-container'),t=document.createElement('div');t.className='toast';t.textContent=m;c.appendChild(t);setTimeout(()=>t.remove(),3000);}
function fmt(n){if(n>=1e12)return(n/1e12).toFixed(1)+'T';if(n>=1e9)return(n/1e9).toFixed(1)+'B';if(n>=1e6)return(n/1e6).toFixed(1)+'M';if(n>=1e3)return(n/1e3).toFixed(1)+'K';return Math.floor(n).toLocaleString();}
function getRarity(id){return RARITIES.find(r=>r.id===id);}
function uLvl(id){return S.upgrades[id]||0;}
function uCost(item){return Math.floor(item.base*Math.pow(item.mult,uLvl(item.id)));}
function xpFor(lv){return Math.floor(80*Math.pow(1.5,lv-1));}
function grantXp(n){const m=getXpMult();S.xp+=Math.floor(n*m);while(S.xp>=xpFor(S.level)){S.xp-=xpFor(S.level);S.level++;sfxLevelUp();showLevelUp();checkUnlocks();}}
function getAuraSlots(){return 1+uLvl('aura_slots');}
function getInvCapacity(){return 25+uLvl('inv_slots')*10;}
function getInvCount(){let t=0;for(const entries of Object.values(S.auras)){t+=(entries?entries.length:0);}return t;}
function isInvFull(){return getInvCount()>=getInvCapacity();}

// === POTION CHECK ===
function potionBonus(type){
    let v=0;const now=Date.now();
    S.potionEffects=S.potionEffects.filter(p=>p.endTime>now);
    for(const p of S.potionEffects)if(p.type===type)v+=p.value-1; // potions are multipliers, subtract 1 to get additive bonus
    return v;
}

// === PET/AURA BONUSES ===
function petBonus(type){let t=0;for(const pid of S.activePets){const p=PETS.find(x=>x.id===pid);if(p&&(p.bonus.type===type||p.bonus.type==='all'))t+=p.bonus.value*(1+((S.petLevels&&S.petLevels[pid]||1)-1)*0.25);}return t;}
function auraBonus(type){
    let t=0;
    for(const eq of S.equippedAuras){
        const a=AURAS.find(x=>x.id===eq.id)||(S.hybrids&&S.hybrids[eq.id]);
        if(!a)continue;
        if(a.ability.type==='hybrid'&&a.ability.abilities){
            for(const ab of a.ability.abilities){if(ab.type===type||ab.type==='all')t+=ab.value;}
        } else {
            if(a.ability.type===type||a.ability.type==='all')t+=a.ability.value;
        }
    }
    return t;
}
function getSetBonus(){
    if(S.equippedGear.length<3)return null;
    const sets=S.equippedGear.map(id=>{const g=GEAR.find(x=>x.id===id);return g?g.set:null;});
    if(sets[0]&&sets[0]===sets[1]&&sets[1]===sets[2])return GEAR_SETS[sets[0]];
    return null;
}

// === STAT CALCULATIONS (multi-equip aware) ===
function rbMult(s){return 1+S.rebirths*(RB_BONUS[s]||0)+(S.ascensions||0)*(ASC_BONUS[s]||0);}

function getEquippedPower(){
    let p=0;
    for(const eq of S.equippedAuras){
        const a=AURAS.find(x=>x.id===eq.id)||(S.hybrids&&S.hybrids[eq.id]);if(!a)continue;
        let pw=getRarity(a.rarity).power;
        if(eq.mod){const m=MODIFIERS.find(x=>x.id===eq.mod);if(m)pw*=m.pMult;}
        p+=pw;
    }
    return p;
}
function getTotalPower(){
    let p=getEquippedPower();
    for(const gId of S.equippedGear){const g=GEAR.find(x=>x.id===gId);if(g)p+=g.power*getGearUpgradeMult(gId);}
    p*=rbMult('power')*(1+petBonus('all')+auraBonus('all')+potionBonus('all'));
    const sb=getSetBonus();if(sb&&sb.bonus.all)p*=(1+sb.bonus.all);
    return Math.floor(p);
}
function getLuck(){
    let l=1+uLvl('luck_boost')*0.3;
    l*=rbMult('luck');
    l*=(1+getEquippedPower()/100);
    // Modifier luck from first equipped aura
    if(S.equippedAuras[0]?.mod){const m=MODIFIERS.find(x=>x.id===S.equippedAuras[0].mod);if(m)l*=m.lMult;}
    l+=petBonus('luck')+auraBonus('luck');
    for(const gId of S.equippedGear)l+=getEnchantStat(gId,'luck');
    l*=(1+potionBonus('luck'));
    const sb=getSetBonus();if(sb&&sb.bonus.luck)l+=sb.bonus.luck;
    if(Date.now()<S.luckBurstEnd)l*=(S.luckBurstMult||3);
    // Lucky aura bonus
    if(S.luckyAura&&Date.now()<S.luckyEnd)l*=1.5;
    // Server event
    l*=getEventBonus('luck');
    return l;
}
function getPlayerDmg(){
    let d=10+getTotalPower()*0.5+S.level*2;
    d*=(1+uLvl('dmg_boost')*0.1)*(1+petBonus('dmg')+petBonus('all')+auraBonus('dmg')+auraBonus('all')+potionBonus('dmg'));
    // Add enchant DMG from all equipped gear
    for(const gId of S.equippedGear)d*=(1+getEnchantStat(gId,'dmg'));
    d*=rbMult('power');
    if(S.equippedAuras[0]?.mod){const m=MODIFIERS.find(x=>x.id===S.equippedAuras[0].mod);if(m)d*=m.dMult;}
    const sb=getSetBonus();if(sb&&sb.bonus.dmg)d*=(1+sb.bonus.dmg);
    return Math.floor(d);
}
function getMaxHp(){
    let h=100+uLvl('hp_boost')*20+S.level*3+auraBonus('hp')+petBonus('hp');
    for(const gId of S.equippedGear)h+=getEnchantStat(gId,'hp');
    h*=(1+petBonus('all')+auraBonus('all')+potionBonus('all'));
    const sb=getSetBonus();if(sb&&sb.bonus.hp)h+=sb.bonus.hp;
    return Math.floor(h);
}
function getDef(){
    let d=uLvl('def_boost')*3+auraBonus('def')+petBonus('def');
    for(const gId of S.equippedGear){const g=GEAR.find(x=>x.id===gId);if(g&&g.defense)d+=g.defense;d+=getEnchantStat(gId,'def');}
    d*=(1+petBonus('all')+auraBonus('all'));
    const sb=getSetBonus();if(sb&&sb.bonus.def)d+=sb.bonus.def;
    return Math.floor(d);
}
function getCrit(){
    let c=uLvl('crit_boost')*0.02+petBonus('crit')+auraBonus('crit');
    for(const gId of S.equippedGear)c+=getEnchantStat(gId,'crit');
    const sb=getSetBonus();if(sb&&sb.bonus.crit)c+=sb.bonus.crit;
    c+=getEventBonus('crit');
    return c;
}
function getGoldMult(){
    let m=(1+uLvl('gold_boost')*0.1)*rbMult('gold')*(1+petBonus('gold')+petBonus('all')+auraBonus('gold')+auraBonus('all')+potionBonus('gold'));
    for(const gId of S.equippedGear)m*=(1+getEnchantStat(gId,'gold'));
    if(S.equippedAuras[0]?.mod){const mod=MODIFIERS.find(x=>x.id===S.equippedAuras[0].mod);if(mod)m*=mod.gMult;}
    m*=getEventBonus('gold');
    return m;
}
function getXpMult(){
    let m=(1+uLvl('xp_boost')*0.08)*rbMult('xp')*(1+petBonus('xp')+petBonus('all')+auraBonus('xp')+auraBonus('all')+potionBonus('xp'));
    if(S.equippedAuras[0]?.mod){const mod=MODIFIERS.find(x=>x.id===S.equippedAuras[0].mod);if(mod)m*=mod.xMult;}
    m*=getEventBonus('xp');
    return m;
}
function getLifesteal(){let l=auraBonus('lifesteal')+petBonus('lifesteal');for(const gId of S.equippedGear)l+=getEnchantStat(gId,'lifesteal');const sb=getSetBonus();if(sb&&sb.bonus.lifesteal)l+=sb.bonus.lifesteal;return l;}
function getGearDrop(){return (1+uLvl('gear_luck')*0.08)*getEventBonus('gearDrop');}
function getDoubleRoll(){return uLvl('double_roll')*0.015;}
function getModMult(){return (1+uLvl('mod_luck')*0.08)*getEventBonus('modChance');}
function getEggSpd(){return (1+uLvl('egg_speed')*0.1+petBonus('all')*0.3)*getEventBonus('eggSpeed');}
function getRollSpd(){return 1+uLvl('roll_speed')*0.1+petBonus('speed')+auraBonus('speed')+potionBonus('speed');}
function getAutoMs(){const baseSpeed=getRollSpd();const autoLvl=uLvl('auto_roll');const autoMult=1+autoLvl*0.3;return Math.max(80,1500/(baseSpeed*autoMult));}
function getCdMs(){return Math.max(200,1500/getRollSpd());}
function getPityMax(){return Math.max(20,100-S.rebirths*5);}
function getMultiRollCount(){return 1+uLvl('multi_roll');}
function getOfflineMult(){return 1+uLvl('offline_boost')*0.15;}
function getAuraPower(id,mod){const a=AURAS.find(x=>x.id===id)||(S.hybrids&&S.hybrids[id]);if(!a)return 0;let p=getRarity(a.rarity).power;if(mod){const m=MODIFIERS.find(x=>x.id===mod);if(m)p*=m.pMult;}return Math.floor(p);}
function getRAP(){return calcRAP(S);}

// === OFFLINE ===
function handleOffline(){
    const now=Date.now(),elapsed=(now-S.lastSave)/1000;
    if(elapsed<60)return;
    const zone=ZONES[S.currentZone];
    const avgG=zone.enemies.reduce((s,e)=>s+e.gold,0)/zone.enemies.length;
    const avgX=zone.enemies.reduce((s,e)=>s+e.xp,0)/zone.enemies.length;
    const offM=getOfflineMult()*0.3;
    const goldG=Math.floor(avgG*getGoldMult()*offM*elapsed);
    const xpG=Math.floor(avgX*getXpMult()*offM*elapsed*0.5);
    if(goldG>0||xpG>0){
        S.gold+=goldG;S.totalGold+=goldG;grantXp(xpG);
        const hrs=Math.floor(elapsed/3600),mins=Math.floor((elapsed%3600)/60);
        document.getElementById('offline-time').textContent=`Away for ${hrs>0?hrs+'h ':''}${mins}m`;
        let h='';if(goldG>0)h+=`<div>🪙 +${fmt(goldG)} Gold</div>`;if(xpG>0)h+=`<div>📖 +${fmt(xpG)} XP</div>`;
        document.getElementById('offline-gains').innerHTML=h;
        document.getElementById('offline-modal').style.display='flex';
    }
    S.lastSave=now;
}

// === NOTIFICATIONS ===
function checkNotifications(){
    if(!getSetting('notifications')){document.querySelectorAll('.tab-dot').forEach(d=>d.style.display='none');return;}
    const badges={collection:false,store:false,battle:false,workshop:false,progress:false};
    // Egg ready?
    for(const sl of S.eggSlots){if(Date.now()-sl.start>=sl.dur){badges.collection=true;break;}}
    // Expedition ready?
    for(const exp of S.expeditions){if(Date.now()-exp.startTime>=exp.duration){badges.collection=true;break;}}
    // Index milestones claimable?
    if(!badges.collection){
        const auraCount=Object.keys(S.auras).length;const petCount=Object.keys(S.pets).length;const gearCount=Object.keys(S.gear).length;
        for(const ms of COLLECTION_MILESTONES){if(auraCount>=ms.count&&!(S.collectionMilestonesClaimed||[]).includes(ms.count)){badges.collection=true;break;}}
        if(!badges.collection)for(const ms of PET_MILESTONES){if(petCount>=ms.count&&!(S.petMilestonesClaimed||[]).includes(ms.count)){badges.collection=true;break;}}
        if(!badges.collection)for(const ms of GEAR_MILESTONES){if(gearCount>=ms.count&&!(S.gearMilestonesClaimed||[]).includes(ms.count)){badges.collection=true;break;}}
    }
    // Daily available?
    const today=Math.floor(Date.now()/86400000);const lastDay=Math.floor((S.lastDaily||0)/86400000);
    if(today>lastDay||!S.lastDaily)badges.store=true;
    // Dungeon off cooldown?
    for(const d of DUNGEONS){if(getTotalPower()>=d.reqPower&&Date.now()>=(S.dungeonCds[d.id]||0)){badges.battle=true;break;}}
    // Quest ready to claim?
    if(S.questReady)badges.progress=true;
    // Apply badges
    document.querySelectorAll('.tab').forEach(tab=>{
        const t=tab.dataset.tab;let dot=tab.querySelector('.tab-dot');
        if(!dot){dot=document.createElement('span');dot.className='tab-dot';tab.appendChild(dot);}
        dot.style.display=badges[t]?'inline-block':'none';
    });
}

// === SETTINGS ===
const DEF_SETTINGS={sound:true,animations:true,notifications:true,celebration:true,shake:true,autosave:true,toasts:true,confirmSell:true};
let SETTINGS=null;
function loadSettings(){const s=localStorage.getItem('rng4_settings');SETTINGS=s?JSON.parse(s):{...DEF_SETTINGS};}
function saveSettings(){localStorage.setItem('rng4_settings',JSON.stringify(SETTINGS));}
function getSetting(key){return SETTINGS?SETTINGS[key]:DEF_SETTINGS[key];}

// === LEVEL UP DISPLAY ===
function showLevelUp(){
    // Flash XP bar
    const bar=document.getElementById('xp-fill-mini');
    if(bar){bar.style.background='#fbbf24';setTimeout(()=>{bar.style.background='';},600);}
    // Big center notification
    const notif=document.createElement('div');
    notif.className='levelup-notif';
    notif.innerHTML=`⬆️ Level ${S.level}!`;
    document.body.appendChild(notif);
    setTimeout(()=>notif.remove(),2000);
}

// === ROBLOX RNG FEEL SYSTEMS ===

// Fake server announcements
const FAKE_NAMES=['xX_RNG_God_Xx','LuckyPlayer42','AuraHunter','NoobSlayer99','DivinePuller','CosmicKing','MythicMaster','RealityBreaker'];
function fakeAnnounce(){
    const name=FAKE_NAMES[Math.floor(Math.random()*FAKE_NAMES.length)];
    const rareAuras=AURAS.filter(a=>ri(a.rarity)>=ri('mythic'));
    const aura=rareAuras[Math.floor(Math.random()*rareAuras.length)];
    const r=getRarity(aura.rarity);
    const el=document.getElementById('server-announce');if(!el)return;
    el.innerHTML=`<div class="announce-msg" style="border-color:${r.color};color:${r.color}">🎉 ${name} just got <strong>${aura.icon} ${aura.name}</strong> (${r.name})!</div>`;
}

// Screen flash on rare rolls
function screenFlash(color){
    const flash=document.createElement('div');
    flash.className='screen-flash';flash.style.background=color;
    document.body.appendChild(flash);setTimeout(()=>flash.remove(),600);
}

// Zone background theme
function updateZoneTheme(){
    const app=document.getElementById('app');if(!app)return;
    app.className='';app.classList.add(`zone-theme-${S.rollZone||0}`);
}

// Boosts bar display
function renderBoosts(){
    const bar=document.getElementById('boosts-bar');if(!bar)return;bar.innerHTML='';
    const now=Date.now();
    if(now<S.luckBurstEnd){const rem=Math.ceil((S.luckBurstEnd-now)/1000);const mult=S.luckBurstMult||3;bar.innerHTML+=`<div class="boost-pill luck">🍀 ${mult}x Luck (${Math.floor(rem/60)}:${(rem%60).toString().padStart(2,'0')})</div>`;}
    if(now<S.goldBurstEnd){const rem=Math.ceil((S.goldBurstEnd-now)/1000);bar.innerHTML+=`<div class="boost-pill gold">🪙 5x Gold (${rem}s)</div>`;}
    S.potionEffects=(S.potionEffects||[]).filter(p=>p.endTime>now);
    for(const p of S.potionEffects){const rem=Math.ceil((p.endTime-now)/1000);bar.innerHTML+=`<div class="boost-pill potion">${p.type} ${p.value}x (${Math.floor(rem/60)}:${(rem%60).toString().padStart(2,'0')})</div>`;}
    if(S.luckyAura&&now<S.luckyEnd){const rem=Math.ceil((S.luckyEnd-now)/1000);bar.innerHTML+=`<div class="boost-pill luck">⭐ Lucky Aura (${Math.floor(rem/60)}:${(rem%60).toString().padStart(2,'0')})</div>`;}
    // Server event
    if(activeEvent&&now<activeEvent.endTime){const rem=Math.ceil((activeEvent.endTime-now)/1000);bar.innerHTML+=`<div class="boost-pill" style="color:var(--glow);border-color:var(--glow)">${activeEvent.icon} ${activeEvent.name} (${Math.floor(rem/60)}:${(rem%60).toString().padStart(2,'0')})</div>`;}
}

// Luck bar (visual pity progress)
function updateLuckBar(){
    const fill=document.getElementById('luck-bar-fill');if(!fill)return;
    const pct=Math.min(100,((S.pity||0)/getPityMax())*100);
    fill.style.width=pct+'%';
    if(pct>80)fill.style.background='linear-gradient(90deg,#f59e0b,#ef4444)';
    else fill.style.background='';
}

// Lucky countdown
function updateLuckyCountdown(){
    const el=document.getElementById('lucky-countdown');if(!el)return;
    if(S.luckyAura&&Date.now()<S.luckyEnd){
        const rem=Math.ceil((S.luckyEnd-Date.now())/1000);
        el.textContent=`Lucky aura expires in: ${Math.floor(rem/60)}m ${rem%60}s`;
    } else el.textContent='';
}

// Roll log
function addRollLog(aura,rarity,mod){
    const log=document.getElementById('roll-log');if(!log)return;
    const r=getRarity(rarity);
    const div=document.createElement('div');
    div.innerHTML=`<span style="color:${r.color}">${aura.icon} ${aura.name}</span> <span style="color:var(--dim)">(${r.name})${mod?' ['+mod+']':''}</span>`;
    log.prepend(div);
    while(log.children.length>50)log.lastChild.remove();
}

// === SERVER EVENTS ===
let activeEvent=null; // {id, name, icon, desc, effect, endTime}

function startRandomEvent(){
    // Seeded random based on time window — random but consistent within a window, no refresh abuse
    const now=Date.now();
    const eventDuration=600000; // 10 minutes per event
    const cycleStart=Math.floor(now/eventDuration)*eventDuration;
    const cycleEnd=cycleStart+eventDuration;
    // Use cycle start as seed for pseudo-random selection
    const seed=cycleStart/eventDuration;
    const idx=Math.floor((Math.sin(seed*9301+49297)%1+1)%1*SERVER_EVENTS.length);
    const ev=SERVER_EVENTS[idx];
    if(activeEvent&&activeEvent.id===ev.id&&activeEvent.endTime===cycleEnd)return;
    activeEvent={...ev,endTime:cycleEnd};
    S.activeEventId=ev.id;S.activeEventEnd=cycleEnd;
    toast(`🎊 EVENT: ${ev.icon} ${ev.name} — ${ev.desc}`);
    renderEventBanner();save();
}

function restoreEvent(){
    // On load, check if saved event is still valid
    if(S.activeEventEnd&&Date.now()<S.activeEventEnd){
        const ev=SERVER_EVENTS.find(e=>e.id===S.activeEventId);
        if(ev)activeEvent={...ev,endTime:S.activeEventEnd};
    } else {
        startRandomEvent();
    }
}

function getEventBonus(type){
    if(!activeEvent||Date.now()>=activeEvent.endTime)return type==='luck'||type==='gold'||type==='xp'||type==='modChance'||type==='gearDrop'||type==='sellMult'||type==='eggSpeed'?1:0;
    if(activeEvent.effect.type===type)return activeEvent.effect.value;
    return type==='luck'||type==='gold'||type==='xp'||type==='modChance'||type==='gearDrop'||type==='sellMult'||type==='eggSpeed'?1:0;
}

function renderEventBanner(){
    const banner=document.getElementById('event-banner');if(!banner)return;
    if(!activeEvent||Date.now()>=activeEvent.endTime){
        banner.style.display='none';activeEvent=null;return;
    }
    const rem=Math.ceil((activeEvent.endTime-Date.now())/1000);
    banner.style.display='block';
    banner.innerHTML=`${activeEvent.icon} <strong>${activeEvent.name}</strong> — ${activeEvent.desc} (${Math.floor(rem/60)}:${(rem%60).toString().padStart(2,'0')})`;
}

function checkEventExpiry(){
    if(!activeEvent||Date.now()>=activeEvent.endTime){
        startRandomEvent(); // will pick next in rotation
    }
}
