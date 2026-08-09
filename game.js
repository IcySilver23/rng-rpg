// === EVENTS & INIT ===
function setupEvents(){
    // Main tabs
    document.querySelectorAll('.tab').forEach(t=>{t.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('#content>.panel').forEach(x=>x.classList.remove('active'));t.classList.add('active');document.getElementById(`panel-${t.dataset.tab}`).classList.add('active');renderAll();});});
    // Sub-tabs (within any panel)
    document.querySelectorAll('.sub-tab').forEach(t=>{t.addEventListener('click',()=>{const parent=t.closest('.panel')||t.closest('section');const tabs=parent.querySelectorAll('.sub-tab');const panels=parent.querySelectorAll('.sub-panel');tabs.forEach(x=>x.classList.remove('active'));panels.forEach(x=>x.classList.remove('active'));t.classList.add('active');const target=parent.querySelector(`#subpanel-${t.dataset.subtab}`);if(target)target.classList.add('active');renderAll();});});
    document.getElementById('btn-roll').addEventListener('click',()=>doRoll(false));
    document.getElementById('btn-auto-roll').addEventListener('click',toggleAutoRoll);
    document.getElementById('btn-fight').addEventListener('click',doFight);
    document.getElementById('btn-auto-fight').addEventListener('click',toggleAutoFight);
    document.getElementById('btn-tower-fight').addEventListener('click',doTowerFight);
    document.getElementById('btn-wb-attack')?.addEventListener('click',hitWorldBoss);
    document.getElementById('btn-wb-auto')?.addEventListener('click',toggleWbAuto);
    document.getElementById('btn-rebirth').addEventListener('click',doRebirth);
    document.getElementById('btn-close-offline').addEventListener('click',()=>{document.getElementById('offline-modal').style.display='none';renderAll();});
    document.getElementById('btn-close-celebration').addEventListener('click',()=>{document.getElementById('celebration').style.display='none';});
    document.getElementById('roll-zone-select').addEventListener('change',e=>{S.rollZone=parseInt(e.target.value);updateZoneTheme();save();});
    document.getElementById('combat-zone-select').addEventListener('change',e=>{selectZone(parseInt(e.target.value));});
    document.getElementById('btn-redeem').addEventListener('click',redeemCode);
    document.getElementById('btn-enchant').addEventListener('click',doEnchant);
    document.getElementById('btn-enchant-stone').addEventListener('click',doEnchantStone);
    document.getElementById('btn-reroll').addEventListener('click',rerollEnchant);
    document.getElementById('btn-clear-enchants').addEventListener('click',clearEnchants);
    document.getElementById('enchant-tier-select').addEventListener('change',renderEnchantWorkshop);
    document.getElementById('btn-craft-confirm').addEventListener('click',doCraftConfirm);
    document.getElementById('btn-craft-all').addEventListener('click',doCraftAll);
    document.getElementById('btn-fuse')?.addEventListener('click',()=>{
        const a1=document.getElementById('fusion-aura1')?.value;
        const a2=document.getElementById('fusion-aura2')?.value;
        if(a1&&a2)fuseAuras(a1,a2);renderCraftPanel();renderInv();
    });
    document.getElementById('btn-spin-wheel')?.addEventListener('click',()=>{
        if(S.gems<WHEEL_COST){toast('Need 25 gems!');return;}
        confirmGemSpend(WHEEL_COST,'Wheel Spin',()=>{
        const wheel=document.getElementById('wheel');const btn=document.getElementById('btn-spin-wheel');
        if(!wheel||btn.disabled)return;
        btn.disabled=true;
        // Pre-determine prize
        S.gems-=WHEEL_COST;S.wheelSpins=(S.wheelSpins||0)+1;
        const totalWeight=WHEEL_PRIZES.reduce((s,p)=>s+p.weight,0);
        let roll=Math.random()*totalWeight;let prizeIdx=0;
        for(let i=0;i<WHEEL_PRIZES.length;i++){roll-=WHEEL_PRIZES[i].weight;if(roll<=0){prizeIdx=i;break;}}
        const prize=WHEEL_PRIZES[prizeIdx];
        // Calculate rotation: 5 full spins + landing on prize segment
        const segSize=360/WHEEL_PRIZES.length;
        const targetAngle=360*5+(360-prizeIdx*segSize-segSize/2);
        wheel.style.transform=`rotate(${targetAngle}deg)`;
        // After animation
        setTimeout(()=>{
            for(const[r,v]of Object.entries(prize.reward))S[r]=(S[r]||0)+v;
            const rwStr=Object.entries(prize.reward).length?Object.entries(prize.reward).map(([r,v])=>'+'+v+' '+r).join(', '):'Nothing!';
            document.getElementById('wheel-result').textContent=`🎉 ${prize.name}!`;
            document.getElementById('wheel-result').style.color=prize.reward.gems>=50?'var(--legendary)':'var(--text)';
            document.getElementById('wheel-spins').textContent=S.wheelSpins||0;
            toast(`🎰 ${prize.name}! ${rwStr}`);
            updateRes();save();btn.disabled=false;
            // Reset wheel after a moment
            setTimeout(()=>{wheel.style.transition='none';wheel.style.transform='rotate(0deg)';setTimeout(()=>{wheel.style.transition='transform 4s cubic-bezier(0.17,0.67,0.12,0.99)';},50);},1000);
        },4200);
    });});
    document.getElementById('btn-sell-confirm').addEventListener('click',doSellConfirm);
    document.getElementById('btn-sell-all').addEventListener('click',()=>{const r=document.getElementById('sell-all-filter').value;if(confirm(`Sell ALL ${r} auras (not equipped) for dust?`))doSellAll();});
    document.getElementById('btn-sell-cancel').addEventListener('click',()=>{selectedSell=null;renderSellPanel();});
    document.getElementById('daily-grid').addEventListener('click',claimDaily);
    document.getElementById('btn-ascend')?.addEventListener('click',doAscend);
    // Minigames
    document.getElementById('btn-memory-start')?.addEventListener('click',startMemoryGame);
    document.getElementById('btn-frenzy-start')?.addEventListener('click',startFrenzy);
    document.getElementById('frenzy-target')?.addEventListener('click',frenzyClick);
    document.getElementById('btn-guess-yes')?.addEventListener('click',()=>playGuess(true));
    document.getElementById('btn-guess-no')?.addEventListener('click',()=>playGuess(false));
    // Settings
    document.getElementById('btn-open-settings').addEventListener('click',()=>{
        document.getElementById('settings-modal').style.display='flex';
        // Sync checkboxes with current settings
        document.getElementById('set-sound').checked=getSetting('sound');
        document.getElementById('set-anim').checked=getSetting('animations');
        document.getElementById('set-notif').checked=getSetting('notifications');
        document.getElementById('set-celebration').checked=getSetting('celebration');
        document.getElementById('set-shake').checked=getSetting('shake');
        document.getElementById('set-autosave').checked=getSetting('autosave');
        document.getElementById('set-toasts').checked=getSetting('toasts');
        document.getElementById('set-confirm-sell').checked=getSetting('confirmSell');
        document.getElementById('set-auto-hatch').checked=getSetting('autoHatch');
        document.getElementById('set-confirm-gems').checked=getSetting('confirmGems');
        const saveTime=S.lastSave?new Date(S.lastSave).toLocaleString():'Never';
        document.getElementById('save-info').textContent=`Last save: ${saveTime}`;
    });
    document.getElementById('btn-close-settings').addEventListener('click',()=>{document.getElementById('settings-modal').style.display='none';});
    // Setting toggles
    ['sound','anim','notif','celebration','shake','autosave','toasts','confirm-sell','auto-hatch','confirm-gems'].forEach(key=>{
        const el=document.getElementById('set-'+key);if(el)el.addEventListener('change',e=>{
            const k=key==='anim'?'animations':key==='notif'?'notifications':key==='confirm-sell'?'confirmSell':key==='auto-hatch'?'autoHatch':key==='confirm-gems'?'confirmGems':key;
            SETTINGS[k]=e.target.checked;saveSettings();
            if(k==='notifications'&&!e.target.checked)document.querySelectorAll('.tab-dot').forEach(d=>d.style.display='none');
        });
    });
    document.getElementById('btn-save-now').addEventListener('click',()=>{save();toast('Saved!');});
    document.getElementById('btn-reset-game').addEventListener('click',()=>{if(confirm('DELETE ALL PROGRESS? This cannot be undone!')){localStorage.removeItem('rng4');localStorage.removeItem('rng4_settings');location.reload();}});
    document.getElementById('btn-export').addEventListener('click',()=>{save();navigator.clipboard.writeText(localStorage.getItem('rng4')||'').then(()=>toast('Save copied to clipboard!'));});
    document.getElementById('btn-import').addEventListener('click',()=>{const inp=document.getElementById('import-input');inp.style.display=inp.style.display==='none'?'block':'none';});
    document.getElementById('import-input').addEventListener('keydown',e=>{if(e.key==='Enter'){try{JSON.parse(e.target.value);localStorage.setItem('rng4',e.target.value);location.reload();}catch(err){toast('Invalid save data!');}}});
}
function periodic(){
    updateRes();renderSkills();checkNotifications();renderBoosts();updateLuckBar();updateLuckyCountdown();checkEventExpiry();renderEventBanner();checkQuests();checkAutoHatch();
    if(document.getElementById('subpanel-potions')?.classList.contains('active'))renderPotions();
    if(document.getElementById('subpanel-eggs')?.classList.contains('active'))renderEggs();
    if(document.getElementById('subpanel-dungeon')?.classList.contains('active')&&!dgRun)renderDungeons();
    if(document.getElementById('subpanel-worldboss')?.classList.contains('active'))renderWorldBoss();
    if(S.luckyAura&&Date.now()>=S.luckyEnd){S.luckyAura=null;document.getElementById('lucky-banner').style.display='none';}
    // Update DPS display
    const dpsEl=document.getElementById('combat-dps');
    if(dpsEl){const d=getDps();dpsEl.textContent=d.dps?`DPS: ${fmt(d.dps)} | Gold/min: ${fmt(d.gpm)}`:'';}
}
// === UI HELPERS ===
function toggleSection(id){const el=document.getElementById(id);el.style.display=el.style.display==='none'?'block':'none';}
function renderCombatZoneSelect(){
    const sel=document.getElementById('combat-zone-select');if(!sel)return;sel.innerHTML='';
    for(let i=0;i<ZONES.length;i++){const z=ZONES[i];if(i===0||getTotalPower()>=z.reqPower){const o=document.createElement('option');o.value=i;o.textContent=`${z.icon} ${z.name}`;if(i===S.currentZone)o.selected=true;sel.appendChild(o);}}
}

// === EXPANDED DUNGEON SYSTEM ===
const DG_ROOM_TYPES=['combat','combat','combat','treasure','trap','heal','elite'];
const DG_MODIFIERS=[
    {id:'normal',name:'Normal',icon:'⚔️',desc:'Standard run.',hpMult:1,dmgMult:1,goldMult:1,dustMult:1},
    {id:'cursed',name:'Cursed',icon:'💀',desc:'2x enemy damage, 3x loot!',hpMult:1,dmgMult:2,goldMult:3,dustMult:3},
    {id:'armored',name:'Armored',icon:'🛡️',desc:'2.5x enemy HP, 2x gold.',hpMult:2.5,dmgMult:1,goldMult:2,dustMult:1.5},
    {id:'blessed',name:'Blessed',icon:'✨',desc:'Half damage taken, normal loot.',hpMult:1,dmgMult:0.5,goldMult:1,dustMult:1},
    {id:'chaotic',name:'Chaotic',icon:'🌀',desc:'Random damage (0.5-3x), 2x loot.',hpMult:1,dmgMult:0,goldMult:2,dustMult:2},// dmgMult 0 = random
    {id:'wealthy',name:'Wealthy',icon:'🪙',desc:'Easy enemies, 5x gold!',hpMult:0.5,dmgMult:0.5,goldMult:5,dustMult:2},
    {id:'nightmare',name:'Nightmare',icon:'👹',desc:'3x HP, 2x DMG, 5x ALL loot!',hpMult:3,dmgMult:2,goldMult:5,dustMult:5},
];
let dgRun=null; // {dungeonId, rooms:[], currentRoom:0, hp:maxHp, loot:{}, modifier:{}}

function startDungeonRun(dId){
    const d=DUNGEONS.find(x=>x.id===dId);if(!d||getTotalPower()<d.reqPower)return;
    if(Date.now()<(S.dungeonCds[dId]||0)){toast('Cooldown!');return;}
    // Pick random modifier
    const mod=DG_MODIFIERS[Math.floor(Math.random()*DG_MODIFIERS.length)];
    // Generate rooms (3-5 rooms + boss)
    const numRooms=3+Math.floor(Math.random()*3);
    const rooms=[];
    for(let i=0;i<numRooms;i++){
        const type=DG_ROOM_TYPES[Math.floor(Math.random()*DG_ROOM_TYPES.length)];
        rooms.push({type,completed:false});
    }
    rooms.push({type:'boss',completed:false});
    dgRun={dungeonId:dId,rooms,currentRoom:0,hp:getMaxHp(),loot:{gold:0,gems:0,dust:0,enchantStones:0,gear:null},modifier:mod};
    document.getElementById('dungeon-list').style.display='none';
    document.getElementById('dungeon-run').style.display='block';
    toast(`Modifier: ${mod.icon} ${mod.name} — ${mod.desc}`);
    renderDungeonRun();
}

function renderDungeonRun(){
    if(!dgRun){document.getElementById('dungeon-run').style.display='none';document.getElementById('dungeon-list').style.display='flex';return;}
    const d=DUNGEONS.find(x=>x.id===dgRun.dungeonId);
    // Header with progress dots
    let dots='<div class="dg-progress">';
    for(let i=0;i<dgRun.rooms.length;i++){
        const cls=i<dgRun.currentRoom?'completed':i===dgRun.currentRoom?'current':'';
        dots+=`<div class="dg-dot ${cls}"></div>`;
    }
    dots+='</div>';
    document.getElementById('dg-run-header').innerHTML=`🏰 ${d.name} — Room ${dgRun.currentRoom+1}/${dgRun.rooms.length}<br>${dgRun.modifier.icon} <strong>${dgRun.modifier.name}</strong>: ${dgRun.modifier.desc}<br>❤️ ${fmt(dgRun.hp)}/${fmt(getMaxHp())}${dots}`;
    // Current room
    const room=dgRun.rooms[dgRun.currentRoom];
    const roomDiv=document.getElementById('dg-room');
    switch(room.type){
        case'combat':roomDiv.innerHTML=`<div class="room-icon">⚔️</div><div class="room-title">Combat Room</div><div class="room-desc">Enemies block your path!</div><div class="room-choices"><button class="room-btn" onclick="dgRoomFight()">Fight</button><button class="room-btn" onclick="dgRoomSkip()">Skip (-20% HP)</button></div>`;break;
        case'elite':roomDiv.innerHTML=`<div class="room-icon">⚡</div><div class="room-title">Elite Room</div><div class="room-desc">A powerful foe guards treasure!</div><div class="room-choices"><button class="room-btn danger" onclick="dgRoomElite()">Fight Elite</button><button class="room-btn" onclick="dgRoomSkip()">Flee (-30% HP)</button></div>`;break;
        case'treasure':roomDiv.innerHTML=`<div class="room-icon">💰</div><div class="room-title">Treasure Room!</div><div class="room-desc">Choose your reward</div><div class="room-choices"><button class="room-btn" onclick="dgRoomTreasure('gold')">🪙 Gold</button><button class="room-btn" onclick="dgRoomTreasure('dust')">✨ Dust</button><button class="room-btn" onclick="dgRoomTreasure('heal')">💚 Heal</button></div>`;break;
        case'trap':roomDiv.innerHTML=`<div class="room-icon">⚠️</div><div class="room-title">Trap Room!</div><div class="room-desc">Dodge or endure?</div><div class="room-choices"><button class="room-btn" onclick="dgRoomTrap('dodge')">Dodge (50% chance)</button><button class="room-btn" onclick="dgRoomTrap('endure')">Endure (-15% HP, guaranteed)</button></div>`;break;
        case'heal':roomDiv.innerHTML=`<div class="room-icon">💚</div><div class="room-title">Healing Fountain</div><div class="room-desc">Restore your strength</div><div class="room-choices"><button class="room-btn" onclick="dgRoomHeal()">Drink (+40% HP)</button></div>`;break;
        case'boss':roomDiv.innerHTML=`<div class="room-icon">💀</div><div class="room-title">BOSS: ${d.boss.name}</div><div class="room-desc">HP: ${fmt(d.boss.hp)} | Your DMG: ${fmt(getPlayerDmg())}</div><div class="room-choices"><button class="room-btn danger" onclick="dgRoomBoss()">⚔️ Fight Boss</button></div>`;break;
    }
}

function dgAddLog(msg){const log=document.getElementById('dg-run-log');log.innerHTML+=`<div>${msg}</div>`;log.scrollTop=log.scrollHeight;}
function dgAdvance(){dgRun.currentRoom++;if(dgRun.currentRoom>=dgRun.rooms.length){dgComplete();return;}renderDungeonRun();}
function dgRoomFight(){
    let dmgMult=dgRun.modifier.dmgMult;if(dmgMult===0)dmgMult=0.5+Math.random()*2.5;// chaotic
    const dmg=Math.floor(getMaxHp()*0.1*(0.5+Math.random())*dmgMult);
    dgRun.hp-=dmg;
    const gold=Math.floor(200*(1+S.currentZone)*getGoldMult()*dgRun.modifier.goldMult);
    dgRun.loot.gold+=gold;dgAddLog(`Fought! -${fmt(dmg)} HP, +${fmt(gold)} gold`);if(dgRun.hp<=0){dgFail();return;}dgAdvance();
}
function dgRoomElite(){
    let dmgMult=dgRun.modifier.dmgMult;if(dmgMult===0)dmgMult=0.5+Math.random()*2.5;
    const dmg=Math.floor(getMaxHp()*0.2*(0.5+Math.random())*dmgMult);
    dgRun.hp-=dmg;
    const gold=Math.floor(500*(1+S.currentZone)*getGoldMult()*dgRun.modifier.goldMult);
    dgRun.loot.gold+=gold;
    dgRun.loot.enchantStones+=Math.random()<0.5?1:0;
    dgRun.loot.dust+=Math.floor(50*dgRun.modifier.dustMult);
    dgAddLog(`Elite! -${fmt(dmg)} HP, +${fmt(gold)} gold`);if(dgRun.hp<=0){dgFail();return;}dgAdvance();
}
function dgRoomSkip(){
    let dmgMult=dgRun.modifier.dmgMult;if(dmgMult===0)dmgMult=1;
    const pct=0.2*dmgMult;dgRun.hp-=Math.floor(getMaxHp()*pct);dgAddLog(`Skipped! -${Math.floor(pct*100)}% HP`);if(dgRun.hp<=0){dgFail();return;}dgAdvance();
}
function dgRoomTreasure(choice){
    if(choice==='gold'){const g=Math.floor(1000*(1+S.currentZone)*getGoldMult()*dgRun.modifier.goldMult);dgRun.loot.gold+=g;dgAddLog(`+${fmt(g)} gold!`);}
    else if(choice==='dust'){const d=Math.floor(100*(1+S.currentZone)*dgRun.modifier.dustMult);dgRun.loot.dust+=d;dgAddLog(`+${d} dust!`);}
    else{dgRun.hp=Math.min(getMaxHp(),dgRun.hp+Math.floor(getMaxHp()*0.3));dgAddLog('Healed 30%!');}
    dgAdvance();
}
function dgRoomTrap(choice){
    let dmgMult=dgRun.modifier.dmgMult;if(dmgMult===0)dmgMult=0.5+Math.random()*2.5;
    if(choice==='dodge'){if(Math.random()<0.5){dgAddLog('Dodged!');}else{const dmg=Math.floor(getMaxHp()*0.25*dmgMult);dgRun.hp-=dmg;dgAddLog(`Failed! -${fmt(dmg)} HP`);if(dgRun.hp<=0){dgFail();return;}}}
    else{const dmg=Math.floor(getMaxHp()*0.15*dmgMult);dgRun.hp-=dmg;dgAddLog(`Endured. -${fmt(dmg)} HP`);if(dgRun.hp<=0){dgFail();return;}}
    dgAdvance();
}
function dgRoomHeal(){dgRun.hp=Math.min(getMaxHp(),dgRun.hp+Math.floor(getMaxHp()*0.4));dgAddLog('Healed 40%!');dgAdvance();}
function dgRoomBoss(){
    const d=DUNGEONS.find(x=>x.id===dgRun.dungeonId);
    const hits=Math.ceil(d.boss.hp/getPlayerDmg());
    const dmgTaken=Math.floor(hits*getMaxHp()*0.05);
    dgRun.hp-=dmgTaken;
    if(dgRun.hp<=0&&getPlayerDmg()<d.boss.hp*0.05){dgAddLog('Boss too strong!');dgFail();return;}
    dgAddLog(`Boss defeated! -${fmt(dmgTaken)} HP`);
    dgRun.loot.gold+=d.rewards.gold;dgRun.loot.gems+=d.rewards.gems;
    if(d.rewards.gear)dgRun.loot.gear=d.rewards.gear;
    dgComplete();
}
function dgComplete(){
    const d=DUNGEONS.find(x=>x.id===dgRun.dungeonId);
    S.gold+=dgRun.loot.gold;S.totalGold+=dgRun.loot.gold;
    S.gems+=dgRun.loot.gems;S.dust+=dgRun.loot.dust;S.totalDust+=dgRun.loot.dust;
    S.enchantStones=(S.enchantStones||0)+dgRun.loot.enchantStones;
    if(dgRun.loot.gear){if(!S.gear[dgRun.loot.gear])S.gear[dgRun.loot.gear]=0;S.gear[dgRun.loot.gear]++;}
    if(!S.dungeonsDone.includes(dgRun.dungeonId))S.dungeonsDone.push(dgRun.dungeonId);
    S.dungeonCds[dgRun.dungeonId]=Date.now()+300000;
    const rwStr=`+${fmt(dgRun.loot.gold)}🪙 +${dgRun.loot.gems}💎 +${dgRun.loot.dust}✨${dgRun.loot.gear?' +'+GEAR.find(x=>x.id===dgRun.loot.gear)?.name:''}`;
    toast(`Dungeon clear! ${rwStr}`);
    dgRun=null;document.getElementById('dungeon-run').style.display='none';document.getElementById('dungeon-list').style.display='flex';
    renderDungeons();updateRes();checkQuests();checkAch();save();
}
function dgFail(){toast('Dungeon failed! You were defeated.');dgRun=null;document.getElementById('dungeon-run').style.display='none';document.getElementById('dungeon-list').style.display='flex';renderDungeons();}

function init(){
    load();loadSettings();if(S.hp<=0)S.hp=getMaxHp();
    handleOffline();checkDaily();setupEvents();renderAll();
    if(!S.tutorialDone)startTutorial();
    // Block clicks during tutorial except highlighted
    document.getElementById('tut-backdrop').addEventListener('click',e=>{if(tutorialActive)e.stopPropagation();});
    if(!curEnemy)spawnEnemy();
    // Lucky aura rotation every 5 min
    rotateLucky();luckyInterval=setInterval(rotateLucky,300000);
    // Fake server announcements
    setInterval(fakeAnnounce,30000+Math.random()*30000);setTimeout(fakeAnnounce,5000);
    // Server events (deterministic rotation based on time)
    restoreEvent();
    // Zone theme
    updateZoneTheme();
    // World boss check
    if(!S.worldBoss&&Date.now()>(S.worldBossCd||0))spawnWorldBoss();
    // Trade refresh
    if(!S.tradeStock||!S.tradeStock.length||Date.now()>=S.tradeRefresh)refreshTrade();
    setInterval(periodic,1000);
    setInterval(save,15000);
    // Ascension button
    document.getElementById('btn-ascend')?.addEventListener('click',doAscend);
    // Init audio on first click
    document.addEventListener('click',()=>initAudio(),{once:true});
    // Hide splash
    setTimeout(()=>{const sp=document.getElementById('splash');if(sp){sp.style.opacity='0';setTimeout(()=>sp.remove(),500);}},800);
}
document.addEventListener('DOMContentLoaded',init);
