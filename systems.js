// === ROLL SYSTEM WITH SPINNING REEL ===
let rollAnimating=false;

function doRoll(auto){
    if(rollAnimating)return;
    if(!auto&&Date.now()<rollCdUntil)return;
    if(isInvFull()){toast('❌ Inventory full! Sell or craft auras.');return;}
    if(!auto){rollCdUntil=Date.now()+getCdMs();document.getElementById('btn-roll').disabled=true;setTimeout(()=>{document.getElementById('btn-roll').disabled=false;},getCdMs());}

    const count=auto?1:getMultiRollCount();
    let bestAura=null,bestMod=null,bestRarity='common',totalNew=0;
    const allResults=[];

    for(let roll=0;roll<count;roll++){
    const luck=getLuck();
    S.totalRolls++;S.pity++;

    // Determine rarity
    let rarity='common';const pMax=getPityMax();
    if(S.pity>=pMax){S.pity=0;const r=Math.random()*100;if(r<2)rarity='mythic';else if(r<10)rarity='legendary';else if(r<35)rarity='epic';else rarity='rare';}
    else{const roll=Math.random();for(let i=RARITIES.length-1;i>=0;i--){
        const effChance=Math.min(0.5,luck/RARITIES[i].chance); // cap at 50% per tier
        if(roll<effChance){rarity=RARITIES[i].id;break;}
    }}
    if(ri(rarity)>=ri('rare')){S.pity=0;S.dryStreak=0;}else{S.dryStreak=(S.dryStreak||0)+1;}

    // Pick aura from zone pool + global for mythic+
    let pool;
    if(ri(rarity)>=ri('mythic'))pool=AURAS.filter(a=>a.rarity===rarity&&a.zone===-1);
    else pool=AURAS.filter(a=>a.rarity===rarity&&a.zone===S.rollZone);
    if(!pool.length)pool=AURAS.filter(a=>a.rarity===rarity);

    // Lucky aura boost: if the lucky aura is in pool, double its weight
    let aura;
    // Check for seasonal override first
    const seasonalOverride=getSeasonalRoll();
    if(seasonalOverride){aura=seasonalOverride;rarity=aura.rarity;}
    else if(S.luckyAura&&Date.now()<S.luckyEnd){
        const luckyInPool=pool.filter(a=>a.id===S.luckyAura);
        const others=pool.filter(a=>a.id!==S.luckyAura);
        const weighted=[...others,...luckyInPool,...luckyInPool]; // 3x chance for lucky
        aura=weighted[Math.floor(Math.random()*weighted.length)];
    } else {
        aura=pool[Math.floor(Math.random()*pool.length)];
    }

    // Modifier roll
    let mod=null;const modM=getModMult();
    for(let i=MODIFIERS.length-1;i>=0;i--){if(Math.random()<1/(MODIFIERS[i].chance/modM)){mod=MODIFIERS[i].id;break;}}
    if(mod&&!S.modsFound.includes(mod))S.modsFound.push(mod);

    // Add to inventory
    if(!S.auras[aura.id])S.auras[aura.id]=[];
    S.auras[aura.id].push({mod});
    tryAutoSell(aura.id);
    if(ri(rarity)>ri(S.bestRarity))S.bestRarity=rarity;
    addToHallOfFame(aura.id,mod,rarity);
    checkCollectionMilestones();checkTitles();
    if(ri(rarity)>=ri('epic'))S.gems+=Math.max(1,Math.floor(getRarity(rarity).power/10));

    // Double roll
    let bonus=null;
    if(Math.random()<getDoubleRoll()){
        const bp=AURAS.filter(a=>ri(a.rarity)<=ri(rarity));
        bonus=bp[Math.floor(Math.random()*bp.length)];
        if(!S.auras[bonus.id])S.auras[bonus.id]=[];
        S.auras[bonus.id].push({mod:null});
    }

    // Track best for multi-roll display
    if(ri(rarity)>ri(bestRarity)||!bestAura){bestAura=aura;bestMod=mod;bestRarity=rarity;}
    allResults.push({aura,mod,rarity});
    totalNew++;
    } // end multi-roll loop

    // Show results
    sfxForRarity(bestRarity);
    // Visual effects
    addRollLog(bestAura,bestRarity,bestMod);
    if(ri(bestRarity)>=ri('legendary'))screenFlash(getRarity(bestRarity).color);
    if(bestMod){const modData=MODIFIERS.find(m=>m.id===bestMod);screenFlash(modData.color);sfxSuccess();toast(`✨ MODIFIER: ${modData.name}! (${modData.pMult}x Power)`);}
    updateLuckBar();
    if(auto){showResult(bestAura,bestMod,bestRarity,null);if(ri(bestRarity)>=ri('mythic')&&getSetting('celebration'))showCelebration(bestAura,bestMod,bestRarity);}
    else{
        if(count>1){showMultiResults(allResults);}
        else if(!getSetting('animations')){showResult(bestAura,bestMod,bestRarity,null);}
        else{animateReel(bestAura,bestMod,bestRarity,null);}
        if(ri(bestRarity)>=ri('mythic')&&getSetting('celebration'))showCelebration(bestAura,bestMod,bestRarity);
    }
    checkQuests();checkAch();updateRes();save();
}

function animateReel(resultAura,mod,rarity,bonus){
    rollAnimating=true;
    const container=document.getElementById('roll-reel-container');
    const reel=document.getElementById('roll-reel');
    const resultDisp=document.getElementById('roll-result-display');
    container.style.display='block';resultDisp.style.display='none';

    // Build reel items: 20 random before + result + 5 random after
    const items=[];
    for(let i=0;i<20;i++){
        const randAura=AURAS[Math.floor(Math.random()*AURAS.length)];
        items.push(randAura);
    }
    const resultIdx=items.length;
    items.push(resultAura);
    for(let i=0;i<5;i++){
        const randAura=AURAS[Math.floor(Math.random()*AURAS.length)];
        items.push(randAura);
    }

    reel.innerHTML='';
    for(const a of items){
        const r=getRarity(a.rarity);
        reel.innerHTML+=`<div class="reel-item" style="border-bottom:2px solid ${r.color}"><span class="ri-icon">${a.icon}</span><span class="ri-name" style="color:${r.color}">${a.name}</span></div>`;
    }

    // Animate: scroll so result lands at center
    const itemWidth=90;
    const centerOffset=container.offsetWidth/2-itemWidth/2;
    const finalPos=-(resultIdx*itemWidth-centerOffset);

    reel.style.transition='none';
    reel.style.transform=`translateX(${centerOffset}px)`;

    requestAnimationFrame(()=>{requestAnimationFrame(()=>{
        reel.style.transition=`transform 2s cubic-bezier(0.15,0.85,0.35,1)`;
        reel.style.transform=`translateX(${finalPos}px)`;
    });});

    // After animation, show result
    setTimeout(()=>{
        rollAnimating=false;
        container.style.display='none';
        showResult(resultAura,mod,rarity,bonus);
        // Celebration for mythic+
        if(ri(rarity)>=ri('mythic'))showCelebration(resultAura,mod,rarity);
    },2100);
}

function showResult(aura,mod,rarity,bonus){
    const r=getRarity(aura.rarity);const disp=document.getElementById('roll-result-display');
    disp.style.display='block';disp.className='roll-result-display';
    if(ri(aura.rarity)>=ri('legendary'))disp.classList.add('rarity-'+aura.rarity);
    let modHtml='';
    if(mod){const m=MODIFIERS.find(x=>x.id===mod);
        const fx=[];if(m.pMult>1)fx.push(m.pMult+'x Pwr');if(m.lMult!==1)fx.push(m.lMult+'x Luck');if(m.dMult>1)fx.push(m.dMult+'x DMG');
        modHtml=`<span class="aura-modifier ${m.css}">${m.name} (${fx.join(', ')})</span>`;}
    const pw=getAuraPower(aura.id,mod);const eff='1 in '+fmt(getRarity(aura.rarity).chance);
    disp.innerHTML=`<div class="roll-result"><span class="aura-icon">${aura.icon}</span>
        <span class="aura-name" style="color:${r.color}">${aura.name}</span>
        <span class="aura-rarity" style="color:${r.color}">${r.name}</span>${modHtml}
        <span class="aura-odds">${eff}</span>
        <span class="aura-ability">⚔️${fmt(pw)} | ${aura.ability.desc}</span></div>`;
    if(bonus)toast(`DOUBLE! +${bonus.name}`);
    // Update stats
    document.getElementById('roll-total').textContent=fmt(S.totalRolls);
    document.getElementById('roll-pity').textContent=S.pity;
    document.getElementById('pity-max').textContent=getPityMax();
    document.getElementById('roll-luck').textContent=getLuck().toFixed(1)+'x';
    const best=getRarity(S.bestRarity);document.getElementById('roll-best').textContent=best.name;document.getElementById('roll-best').style.color=best.color;
}

function showMultiResults(results){
    const disp=document.getElementById('roll-result-display');
    const container=document.getElementById('roll-reel-container');
    container.style.display='none';disp.style.display='block';
    disp.className='roll-result-display';
    let html=`<div style="font-size:.75rem;color:var(--sub);margin-bottom:8px;text-align:center">Rolled x${results.length}</div><div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center">`;
    for(let i=0;i<results.length;i++){
        const res=results[i];
        const a=res.aura;const r=getRarity(a.rarity);const m=res.mod?MODIFIERS.find(x=>x.id===res.mod):null;
        const pw=getAuraPower(a.id,res.mod);
        html+=`<div class="multi-roll-card" style="background:var(--bg3);border:2px solid ${r.color};border-radius:8px;padding:8px 6px;text-align:center;min-width:80px;max-width:100px;animation:multiCardPop .4s ease ${i*0.1}s both">
            <div style="font-size:1.5rem">${a.icon}</div>
            <div style="font-size:.6rem;font-weight:600;color:${r.color};margin-top:2px">${a.name}</div>
            <div style="font-size:.55rem;color:var(--dim)">${r.name}</div>
            ${m?`<div style="font-size:.5rem;color:${m.color}">${m.name}</div>`:''}
            <div style="font-size:.55rem;color:var(--glow);margin-top:2px">⚔️${fmt(pw)}</div>
        </div>`;
    }
    html+='</div>';
    disp.innerHTML=html;
    // Update roll stats
    document.getElementById('roll-total').textContent=fmt(S.totalRolls);
    document.getElementById('roll-pity').textContent=S.pity;
    document.getElementById('pity-max').textContent=getPityMax();
    document.getElementById('roll-luck').textContent=getLuck().toFixed(1)+'x';
    const best=getRarity(S.bestRarity);document.getElementById('roll-best').textContent=best.name;document.getElementById('roll-best').style.color=best.color;
}

function showCelebration(aura,mod,rarity){
    screenShake();
    const r=getRarity(aura.rarity);const el=document.getElementById('celebration');
    const content=document.getElementById('celebration-content');
    let modHtml='';if(mod){const m=MODIFIERS.find(x=>x.id===mod);modHtml=`<div class="celeb-modifier ${m.css}">${m.name}</div>`;}
    const eff2='1 in '+fmt(r.chance);
    content.innerHTML=`<div class="celeb-icon">${aura.icon}</div>
        <div class="celeb-name" style="color:${r.color}">${aura.name}</div>
        <div class="celeb-rarity" style="color:${r.color}">${r.name}</div>${modHtml}
        <div class="celeb-odds">${eff2}</div>
        <div class="celeb-ability">${aura.ability.desc}</div>`;
    el.style.display='flex';
}

function toggleAutoRoll(){
    if(!uLvl('auto_roll')){toast('Buy "Auto Roll" from Shop first!');return;}
    if(autoRoll){clearInterval(autoRoll);autoRoll=null;document.getElementById('btn-auto-roll').classList.remove('active');document.getElementById('btn-auto-roll').textContent=`⚡ Auto (${Math.floor(getAutoMs())}ms)`;}
    else{document.getElementById('btn-auto-roll').classList.add('active');document.getElementById('btn-auto-roll').textContent='⏹️ Stop';autoRoll=setInterval(()=>doRoll(true),getAutoMs());}
}

// === LUCKY AURA SYSTEM ===
function rotateLucky(){
    // Only rotate if expired — prevents refresh abuse
    if(S.luckyAura&&Date.now()<S.luckyEnd){
        // Still active from save, just show the banner
        const pick=AURAS.find(a=>a.id===S.luckyAura);
        if(pick){const r=getRarity(pick.rarity);const banner=document.getElementById('lucky-banner');banner.style.display='block';
            banner.innerHTML=`⭐ LUCKY: <strong style="color:${r.color}">${pick.icon} ${pick.name}</strong> — 3x chance for ${Math.ceil((S.luckyEnd-Date.now())/1000)}s!`;}
        return;
    }
    // Expired or none — pick new one
    const pool=AURAS.filter(a=>ri(a.rarity)>=ri('rare'));
    const pick=pool[Math.floor(Math.random()*pool.length)];
    S.luckyAura=pick.id;S.luckyEnd=Date.now()+300000;
    const r=getRarity(pick.rarity);
    const banner=document.getElementById('lucky-banner');
    banner.style.display='block';
    banner.innerHTML=`⭐ LUCKY: <strong style="color:${r.color}">${pick.icon} ${pick.name}</strong> — 3x chance for 5 min!`;
    save();
}

// === COMBAT ===
function spawnEnemy(){
    const zone=ZONES[S.currentZone];const nb=zone.enemies.filter(e=>!e.boss);
    const pool=Math.random()<0.12?zone.enemies:nb;
    const base=pool[Math.floor(Math.random()*pool.length)];
    curElite=null;
    if(!base.boss&&Math.random()<0.15)curElite=ELITE_MODS[Math.floor(Math.random()*ELITE_MODS.length)];
    let hM=1,dM=1,gM=1,xM=1;
    if(curElite){switch(curElite){case'Enraged':dM=2;gM=1.5;xM=1.5;break;case'Armored':hM=2.5;gM=2;xM=2;break;case'Swift':dM=1.5;hM=0.7;gM=1.3;xM=1.3;break;case'Glowing':gM=3;xM=2;break;case'Cursed':hM=1.5;dM=1.5;gM=2.5;xM=2.5;break;}}
    curEnemy={...base,hp:Math.floor(base.hp*hM),dmg:Math.floor(base.dmg*dM),gold:Math.floor(base.gold*gM),xp:Math.floor(base.xp*xM),elite:curElite};
    curEnemyHp=curEnemy.hp;if(S.hp<=0)S.hp=getMaxHp();renderEnemy();renderPHp();
}
function renderEnemy(){
    if(!curEnemy){document.getElementById('enemy-name').textContent='No enemy';document.getElementById('enemy-hp-fill').style.width='0%';document.getElementById('enemy-hp-text').textContent='';return;}
    const e=curEnemy.elite?` ⚡${curEnemy.elite}`:'';const b=curEnemy.boss?' 💀BOSS':'';
    document.getElementById('enemy-name').textContent=`${curEnemy.icon} ${curEnemy.name}${e}${b}`;
    document.getElementById('enemy-hp-fill').style.width=Math.max(0,(curEnemyHp/curEnemy.hp)*100)+'%';
    document.getElementById('enemy-hp-text').textContent=`${fmt(Math.max(0,curEnemyHp))} / ${fmt(curEnemy.hp)}`;
}
function renderPHp(){const max=getMaxHp();document.getElementById('player-hp').textContent=`${fmt(Math.max(0,S.hp))}/${fmt(max)}`;document.getElementById('player-hp-fill').style.width=Math.max(0,(S.hp/max)*100)+'%';}

function doFight(){
    if(!curEnemy)spawnEnemy();if(!curEnemy)return;
    const log=document.getElementById('combat-log');
    let d=getPlayerDmg(),crit=Math.random()<getCrit();
    if(S.critBurst>0){crit=true;S.critBurst--;}
    if(crit)d*=2;d=Math.floor(d*(0.85+Math.random()*0.3));
    curEnemyHp-=d;addLog(log,`${fmt(d)}${crit?' CRIT!':''}`,crit?'log-drop':'log-hit');sfxHit();
    const ls=getLifesteal();if(ls>0)S.hp=Math.min(getMaxHp(),S.hp+Math.floor(d*ls));
    if(curEnemyHp<=0){
        const gB=Date.now()<S.goldBurstEnd?5:1;
        const gE=Math.floor(curEnemy.gold*getGoldMult()*gB);S.gold+=gE;S.totalGold+=gE;S.killCount++;
        if(curEnemy.elite)S.eliteKills++;
        if(curEnemy.boss)S.bossKills++;
        grantXp(curEnemy.xp);addLog(log,`${curEnemy.name}! +${fmt(gE)}🪙`,'log-kill');
        if(curEnemy.boss){const gb=Math.floor(gE/8);S.gems+=gb;if(!S.bossesDefeated.includes(curEnemy.name))S.bossesDefeated.push(curEnemy.name);addLog(log,`BOSS +${fmt(gb)}💎`,'log-drop');}
        let dr=ZONES[S.currentZone].gearDrop*getGearDrop();if(curEnemy.elite)dr*=2;
        if(Math.random()<dr){const zg=GEAR.filter(g=>g.zone===S.currentZone);if(zg.length){const g=rollGear(zg);if(!S.gear[g.id])S.gear[g.id]=0;S.gear[g.id]++;addLog(log,`GEAR: ${g.name}!`,'log-drop');toast(`Gear: ${g.name}`);}}
        // Enchant stone drop (2% from elites, 0.5% from normal)
        const stoneDrop=curEnemy.elite?0.02:0.005;
        if(Math.random()<stoneDrop){S.enchantStones=(S.enchantStones||0)+1;addLog(log,'🔮 Enchant Stone dropped!','log-drop');toast('🔮 Enchant Stone!');}
        curEnemy=null;curEnemyHp=0;setTimeout(()=>{if(S.hp>0)spawnEnemy();},200);
    } else {
        const eD=Math.floor(curEnemy.dmg*(0.8+Math.random()*0.4));const def=getDef();const act=Math.max(1,eD-def);
        S.hp-=act;addLog(log,`-${fmt(act)} HP`,'');
        if(S.hp<=0){addLog(log,'DIED!','log-hit');S.hp=getMaxHp();curEnemy=null;curEnemyHp=0;setTimeout(spawnEnemy,800);}
    }
    renderEnemy();renderPHp();updateCombat();updateRes();checkQuests();checkAch();save();
}
function rollGear(p){const w=[];for(const g of p){const wt=Math.max(1,10-ri(g.rarity)*2);for(let i=0;i<wt;i++)w.push(g);}return w[Math.floor(Math.random()*w.length)];}
function addLog(c,m,cls){const d=document.createElement('div');d.className=cls;d.textContent=m;c.appendChild(d);while(c.children.length>30)c.firstChild.remove();c.scrollTop=c.scrollHeight;}
function toggleAutoFight(){
    if(!uLvl('auto_battle')){toast('Buy "Auto Battle" from Shop first!');return;}
    if(autoFight){clearInterval(autoFight);autoFight=null;document.getElementById('btn-auto-fight').classList.remove('active');document.getElementById('btn-auto-fight').textContent='⚡ Auto';}
    else{document.getElementById('btn-auto-fight').classList.add('active');document.getElementById('btn-auto-fight').textContent='⏹️ Stop';if(!curEnemy)spawnEnemy();autoFight=setInterval(doFight,500);}
}
function useSkill(id){
    const sk=SKILLS.find(s=>s.id===id);if(!sk||S.level<sk.lvl)return;
    if(Date.now()<(S.skillCds[id]||0)){toast('Cooldown!');return;}
    S.skillCds[id]=Date.now()+sk.cd*1000;const log=document.getElementById('combat-log');
    switch(sk.fx){
        case'dmgX':if(!curEnemy)spawnEnemy();if(curEnemy){const d=Math.floor(getPlayerDmg()*sk.val);curEnemyHp-=d;addLog(log,`💥${fmt(d)}!`,'log-hit');if(curEnemyHp<=0)doFight();}break;
        case'heal':const h=Math.floor(getMaxHp()*sk.val);S.hp=Math.min(getMaxHp(),S.hp+h);addLog(log,`+${fmt(h)}HP`,'log-heal');renderPHp();break;
        case'critB':S.critBurst=sk.val;addLog(log,`${sk.val} crits!`,'log-xp');break;
        case'goldB':S.goldBurstEnd=Date.now()+10000;addLog(log,'5x Gold 10s!','log-gold');break;
        case'luckB':S.luckBurstEnd=Date.now()+30000;S.luckBurstMult=3;addLog(log,'3x Luck 30s!','log-xp');toast('3x Luck!');break;
        case'nuke':if(curEnemy&&!curEnemy.boss){const g=Math.floor(curEnemy.gold*getGoldMult());S.gold+=g;S.totalGold+=g;S.killCount++;if(curEnemy.elite)S.eliteKills++;grantXp(curEnemy.xp);addLog(log,`💣NUKE +${fmt(g)}🪙`,'log-kill');curEnemy=null;curEnemyHp=0;setTimeout(spawnEnemy,200);}break;
    }
    renderEnemy();renderSkills();updateRes();save();
}

// === EGGS ===
function buyEgg(id){const e=EGG_TYPES.find(x=>x.id===id);if(!e)return;if(S.eggSlots.length>=S.maxEggs){toast('No slots!');return;}if(S[e.currency]<e.cost){toast('Not enough!');return;}S[e.currency]-=e.cost;S.eggSlots.push({type:e.id,start:Date.now(),dur:e.hatchTime*1000/getEggSpd()});toast(`${e.name} incubating!`);renderEggs();updateRes();save();}
function hatchEgg(i){const sl=S.eggSlots[i];if(!sl||Date.now()-sl.start<sl.dur){toast('Not ready!');return;}const e=EGG_TYPES.find(x=>x.id===sl.type);const pid=e.pool[Math.floor(Math.random()*e.pool.length)];const p=PETS.find(x=>x.id===pid);if(!S.pets[pid])S.pets[pid]=0;S.pets[pid]++;S.eggSlots.splice(i,1);toast(`Hatched: ${p.icon} ${p.name}!`);checkQuests();checkAch();renderEggs();renderInv();save();}
function activatePet(pid){
    if(S.activePets.length>=3){toast('No room! Unequip first (right-click).');return;}
    S.activePets.push(pid);
    renderInv();updateRes();save();
}
function deactivatePet(pid){
    const idx=S.activePets.indexOf(pid);
    if(idx>=0)S.activePets.splice(idx,1);
    renderInv();updateRes();save();
}

// === DUNGEONS ===
function startDungeon(id){const d=DUNGEONS.find(x=>x.id===id);if(!d||getTotalPower()<d.reqPower||Date.now()<(S.dungeonCds[id]||0))return;dgActive={id,hp:d.boss.hp,max:d.boss.hp,end:Date.now()+d.time*1000};document.getElementById('dungeon-list').style.display='none';document.getElementById('dungeon-active').style.display='block';document.getElementById('dungeon-boss-name').textContent=`${d.boss.icon} ${d.boss.name}`;renderDgState();if(dgInterval)clearInterval(dgInterval);dgInterval=setInterval(dgTick,100);}
function dgTick(){if(!dgActive)return;const rem=dgActive.end-Date.now();if(rem<=0){clearInterval(dgInterval);dgInterval=null;toast('Failed!');dgActive=null;document.getElementById('dungeon-active').style.display='none';document.getElementById('dungeon-list').style.display='flex';renderDungeons();return;}document.getElementById('dungeon-timer').textContent=`⏱️${Math.ceil(rem/1000)}s`;renderDgState();}
function dgHit(){if(!dgActive)return;let d=getPlayerDmg();if(Math.random()<getCrit())d*=2;d=Math.floor(d*(0.85+Math.random()*0.3));dgActive.hp-=d;if(dgActive.hp<=0){clearInterval(dgInterval);dgInterval=null;const dg=DUNGEONS.find(x=>x.id===dgActive.id);S.gold+=dg.rewards.gold;S.totalGold+=dg.rewards.gold;S.gems+=dg.rewards.gems;if(dg.rewards.gear){if(!S.gear[dg.rewards.gear])S.gear[dg.rewards.gear]=0;S.gear[dg.rewards.gear]++;toast(`Clear! Got ${GEAR.find(x=>x.id===dg.rewards.gear).name}!`);}if(!S.dungeonsDone.includes(dgActive.id))S.dungeonsDone.push(dgActive.id);S.dungeonCds[dgActive.id]=Date.now()+300000;dgActive=null;document.getElementById('dungeon-active').style.display='none';document.getElementById('dungeon-list').style.display='flex';renderDungeons();updateRes();checkQuests();checkAch();save();}renderDgState();}
function renderDgState(){if(!dgActive)return;document.getElementById('dungeon-hp-fill').style.width=Math.max(0,(dgActive.hp/dgActive.max)*100)+'%';document.getElementById('dungeon-hp-text').textContent=`${fmt(Math.max(0,dgActive.hp))}/${fmt(dgActive.max)}`;}

// === TOWER ===
function getTowerEnemy(){const f=S.towerFloor;return{name:`Floor ${f} Guardian`,icon:'🗼',hp:Math.floor(100*Math.pow(1.5,f)),dmg:Math.floor(10*Math.pow(1.3,f)),gold:Math.floor(50*f),xp:Math.floor(30*f)};}
function doTowerFight(){
    if(!isUnlocked('tower')){toast(`🔒 Tower unlocks at Lv.${UNLOCK_REQS.tower}`);return;}
    const enemy=getTowerEnemy();
    const pDmg=getPlayerDmg();const hits=Math.ceil(enemy.hp/pDmg);
    const eDmg=enemy.dmg*hits;const survive=S.hp>eDmg-getDef()*hits;
    if(pDmg>=enemy.hp*0.1||survive){
        S.towerFloor++;S.gold+=enemy.gold;S.totalGold+=enemy.gold;grantXp(enemy.xp);
        if(S.towerFloor%5===0)S.gems+=S.towerFloor;
        toast(`Tower F${S.towerFloor-1} cleared! +${fmt(enemy.gold)}🪙`);
        // Check milestones
        for(const ms of TOWER_MILESTONES){if(S.towerFloor>ms.floor&&!S.towerRewardsClaimed.includes(ms.floor))claimTowerMilestone(ms.floor);}
        checkQuests();checkAch();
    } else {
        toast(`Too weak for Floor ${S.towerFloor}!`);
    }
    renderTower();updateRes();save();
}

// === DAILY REWARDS ===
function checkDaily(){
    const now=Date.now();const lastD=S.lastDaily||0;
    const today=Math.floor(now/86400000);const lastDay=Math.floor(lastD/86400000);
    if(today>lastDay&&lastD>0){
        // Check if streak continues (within 48h)
        if(today-lastDay<=2)S.dailyStreak=Math.min(S.dailyStreak,6);
        else S.dailyStreak=0; // broken streak
    }
}
function claimDaily(){
    const now=Date.now();const today=Math.floor(now/86400000);const lastDay=Math.floor((S.lastDaily||0)/86400000);
    if(today<=lastDay&&S.lastDaily>0){toast('Already claimed today!');return;}
    // Advance streak
    if(today-lastDay<=2&&S.lastDaily>0)S.dailyStreak++;else S.dailyStreak=0;
    // Day 7+ always gives day 7 rewards
    const day=Math.min(S.dailyStreak,6);
    const reward=DAILY_REWARDS[day].reward;
    for(const[r,v]of Object.entries(reward))S[r]=(S[r]||0)+v;
    S.lastDaily=now;
    if(!S.dailyClaimed.includes(day))S.dailyClaimed.push(day);
    const rwStr=Object.entries(reward).map(([r,v])=>`+${v} ${r}`).join(', ');
    toast(`Day ${S.dailyStreak+1} reward: ${rwStr}`);
    renderDaily();updateRes();save();
}

// === POTIONS ===
function usePotion(id){
    if(!isUnlocked('potions')){toast(`🔒 Potions unlock at Lv.${UNLOCK_REQS.potions}`);return;}
    const pot=POTIONS.find(x=>x.id===id);if(!pot)return;
    if(S[pot.currency]<pot.cost){toast('Not enough!');return;}
    S[pot.currency]-=pot.cost;
    S.potionEffects.push({type:pot.effect.type,value:pot.effect.value,endTime:Date.now()+pot.duration*1000});
    toast(`${pot.name} active for ${pot.duration}s!`);
    renderPotions();updateRes();save();
}

// === CODES ===
function redeemCode(){
    const input=document.getElementById('code-input');
    const code=input.value.trim().toUpperCase();input.value='';
    if(!code){toast('Enter a code!');return;}
    if(S.codesUsed.includes(code)){toast('Already used!');return;}
    const reward=CODES[code];
    if(!reward){toast('Invalid code!');return;}
    S.codesUsed.push(code);
    // Grant normal resources
    for(const[r,v]of Object.entries(reward)){if(r!=='used'&&r!=='special')S[r]=(S[r]||0)+v;}
    // Handle special effects
    if(reward.special==='luck10x'){S.luckBurstEnd=Date.now()+600000;S.luckBurstMult=10;toast('🍀 10x Luck for 10 minutes!');}
    else if(reward.special==='luck5x'){S.luckBurstEnd=Date.now()+300000;S.luckBurstMult=5;toast('🍀 5x Luck for 5 minutes!');}
    else if(reward.special==='egg'){
        // Give a free legendary egg hatch
        const pid=EGG_TYPES[3].pool[Math.floor(Math.random()*EGG_TYPES[3].pool.length)];
        if(!S.pets[pid])S.pets[pid]=0;S.pets[pid]++;
        const p=PETS.find(x=>x.id===pid);toast(`🥚 Free pet: ${p.icon} ${p.name}!`);
    }
    const rwStr=Object.entries(reward).filter(([r])=>r!=='used'&&r!=='special').map(([r,v])=>`+${v} ${r}`).join(', ');
    if(rwStr)toast(`Code redeemed! ${rwStr}`);
    updateRes();save();
}

// === QUESTS ===
function checkQuests(){
    const qId=S.questProg;if(!qId||S.questReady)return;
    const q=QUESTS.find(x=>x.id===qId);if(!q)return;
    if(q.check(S)){S.questReady=true;}
}
function claimQuest(){
    if(!S.questReady)return;
    const qId=S.questProg;const q=QUESTS.find(x=>x.id===qId);if(!q)return;
    S.questsDone.push(qId);
    for(const[r,v]of Object.entries(q.reward))S[r]=(S[r]||0)+v;
    toast(`Quest claimed: ${q.name}!`);
    S.questProg=q.next;S.questReady=false;
    renderQuests();updateRes();save();
}

// === ACHIEVEMENTS ===
function checkAch(){for(const a of ACHIEVEMENTS){if(S.achDone.includes(a.id))continue;if(a.check(S)){S.achDone.push(a.id);for(const[r,v]of Object.entries(a.reward))S[r]=(S[r]||0)+v;toast(`Achievement: ${a.name}!`);}}}

// === EQUIP (multi-slot) ===
function equipAura(auraId,idx){
    const entries=S.auras[auraId];if(!entries||!entries[idx])return;
    const eq={id:auraId,mod:entries[idx].mod};
    if(S.equippedAuras.length>=getAuraSlots()){toast('No room! Unequip first (right-click).');return;}
    S.equippedAuras.push(eq);
    const a=AURAS.find(x=>x.id===auraId)||(S.hybrids&&S.hybrids[auraId]);
    toast(`Equipped: ${a?a.name:'Aura'}`);
    renderInv();updateRes();updateCombat();save();
}
function unequipAura(auraId,mod){
    const idx=S.equippedAuras.findIndex(e=>e.id===auraId&&e.mod===mod);
    if(idx>=0){S.equippedAuras.splice(idx,1);toast('Unequipped');}
    renderInv();updateRes();updateCombat();save();
}
function equipGear(gId){
    const equippedCount=S.equippedGear.filter(x=>x===gId).length;
    const ownedCount=S.gear[gId]||0;
    if(equippedCount>=ownedCount){toast('No more copies!');return;}
    if(S.equippedGear.length>=3){toast('No room! Unequip first (right-click).');return;}
    S.equippedGear.push(gId);
    renderInv();updateCombat();save();
}
function unequipGear(gId){
    const idx=S.equippedGear.indexOf(gId);
    if(idx>=0)S.equippedGear.splice(idx,1);
    renderInv();updateCombat();save();
}
function selectZone(i){const z=ZONES[i];if(i>0&&getTotalPower()<z.reqPower){toast(`Need ${fmt(z.reqPower)} power!`);return;}S.currentZone=i;curEnemy=null;curEnemyHp=0;spawnEnemy();renderZones();renderCombat();checkQuests();save();}

// === SHOP ===
function buyUpgrade(id){const item=SHOP.find(x=>x.id===id);const lvl=uLvl(id);if(lvl>=item.max)return;const cost=uCost(item);if(S[item.cur]<cost){toast('Not enough!');return;}S[item.cur]-=cost;S.upgrades[id]=lvl+1;toast(`${item.name} Lv.${lvl+1}`);if((id==='roll_speed'||id==='auto_roll')&&autoRoll){clearInterval(autoRoll);autoRoll=setInterval(()=>doRoll(true),getAutoMs());}renderShop();updateRes();renderAll();save();}

// === SELL ===
function sellAura(auraId,mod){
    const entries=S.auras[auraId];if(!entries||!entries.length)return;
    const idx=entries.findIndex(e=>e.mod===mod);if(idx===-1)return;
    // Don't sell equipped
    if(S.equippedAuras.some(e=>e.id===auraId&&e.mod===mod)){toast("Can't sell equipped!");return;}
    const a=AURAS.find(x=>x.id===auraId);let dv=SELL_VAL[a.rarity]||1;
    if(mod){const m=MODIFIERS.find(x=>x.id===mod);if(m)dv*=m.pMult;}
    dv=Math.floor(dv*getEventBonus('sellMult'));entries.splice(idx,1);if(!entries.length)delete S.auras[auraId];
    S.dust+=dv;S.totalDust+=dv;toast(`+${dv}✨`);renderInv();updateRes();save();
}

// === CRAFT ===
function craftAura(auraId,mod){
    if(!isUnlocked('crafting')){toast(`🔒 Crafting unlocks at Lv.${UNLOCK_REQS.crafting}`);return;}
    const entries=S.auras[auraId];if(!entries)return;
    // Count how many are available (not equipped)
    const isEquipped=(idx)=>S.equippedAuras.some(e=>e.id===auraId&&e.mod===entries[idx]?.mod);
    const available=entries.filter((e,i)=>e.mod===mod&&!isEquipped(i));
    if(available.length<3){toast('Need 3 non-equipped of same type!');return;}
    const a=AURAS.find(x=>x.id===auraId);const nri=ri(a.rarity)+1;
    if(nri>=RARITIES.length){toast('Max rarity!');return;}
    const nr=RARITIES[nri].id;const pool=AURAS.filter(x=>x.rarity===nr);
    if(!pool.length)return;
    // Remove 3, skipping equipped
    let rm=0;for(let i=entries.length-1;i>=0&&rm<3;i--){
        if(entries[i].mod===mod&&!isEquipped(i)){entries.splice(i,1);rm++;}
    }
    if(!entries.length)delete S.auras[auraId];
    const result=pool[Math.floor(Math.random()*pool.length)];
    if(!S.auras[result.id])S.auras[result.id]=[];S.auras[result.id].push({mod:null});
    if(ri(result.rarity)>ri(S.bestRarity))S.bestRarity=result.rarity;
    toast(`Crafted: ${result.icon} ${result.name}!`);renderInv();checkAch();save();
}

// === CRAFT & SELL UI ===
let selectedCraft=null; // {aId,mod}
let selectedSell=null;  // {aId,mod}

function renderCraftPanel(){
    const grid=document.getElementById('craft-grid');if(!grid)return;grid.innerHTML='';
    const preview=document.getElementById('craft-preview');
    // Show all auras that have 3+ of same type
    const craftable=[];
    for(const aId of Object.keys(S.auras)){
        const entries=S.auras[aId];if(!entries||!entries.length)continue;
        const grp={};for(const e of entries){const k=e.mod||'_';if(!grp[k])grp[k]={mod:e.mod,cnt:0};grp[k].cnt++;}
        for(const g of Object.values(grp)){if(g.cnt>=3)craftable.push({aId,mod:g.mod,cnt:g.cnt});}
    }
    if(!craftable.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:var(--dim);padding:20px">No auras with 3+ copies to craft. Roll more!</div>';preview.style.display='none';return;}
    for(const c of craftable){
        const a=AURAS.find(x=>x.id===c.aId);const r=getRarity(a.rarity);const m=c.mod?MODIFIERS.find(x=>x.id===c.mod):null;
        const isSel=selectedCraft&&selectedCraft.aId===c.aId&&selectedCraft.mod===c.mod;
        const card=document.createElement('div');card.className=`inv-card rarity-${a.rarity} ${m?m.css:''} ${isSel?'selected-for-action':''}`;
        card.innerHTML=`<span class="count-badge">x${c.cnt}</span><span class="item-icon">${a.icon}</span><div class="item-name">${a.name}</div><div class="item-rarity" style="color:${r.color}">${r.name}</div>${m?`<span class="item-modifier ${m.css}">${m.name}</span>`:''}`;
        card.addEventListener('click',()=>{selectedCraft={aId:c.aId,mod:c.mod};renderCraftPanel();});
        grid.appendChild(card);
    }
    // Preview
    if(selectedCraft){
        const a=AURAS.find(x=>x.id===selectedCraft.aId);const r=getRarity(a.rarity);
        const nextRi=ri(a.rarity)+1;
        if(nextRi<RARITIES.length){
            const nextR=RARITIES[nextRi];
            preview.style.display='flex';
            document.getElementById('craft-from').innerHTML=`<div class="craft-icon">${a.icon}${a.icon}${a.icon}</div><div style="color:${r.color}">${a.name} x3</div>`;
            document.getElementById('craft-to').innerHTML=`<div class="craft-icon">❓</div><div style="color:${nextR.color}">Random ${nextR.name}</div>`;
        } else {preview.style.display='none';}
    } else {preview.style.display='none';}
}

function doCraftConfirm(){
    if(!selectedCraft)return;
    craftAura(selectedCraft.aId,selectedCraft.mod);
    selectedCraft=null;
    renderCraftPanel();
}

function doCraftAll(){
    const filterRarity=document.getElementById('craft-all-filter').value;
    let crafted=0;
    let keepGoing=true;
    while(keepGoing){
        keepGoing=false;
        for(const aId of Object.keys(S.auras)){
            const a=AURAS.find(x=>x.id===aId);if(!a||a.rarity!==filterRarity)continue;
            const entries=S.auras[aId];if(!entries)continue;
            // Group by mod
            const grp={};for(const e of entries){const k=e.mod||'_';if(!grp[k])grp[k]={mod:e.mod,cnt:0};grp[k].cnt++;}
            for(const g of Object.values(grp)){
                if(g.cnt>=3){
                    craftAura(aId,g.mod);
                    crafted++;keepGoing=true;break;
                }
            }
            if(keepGoing)break; // restart loop since auras changed
        }
    }
    if(crafted)toast(`Crafted ${crafted} auras!`);else toast('Nothing to craft at that rarity!');
    renderCraftPanel();
}

function doSellAll(){
    const filterRarity=document.getElementById('sell-all-filter').value;
    let sold=0,dustGained=0;
    for(const aId of Object.keys(S.auras)){
        const a=AURAS.find(x=>x.id===aId);if(!a||a.rarity!==filterRarity)continue;
        const entries=S.auras[aId];if(!entries)continue;
        // Sell all non-equipped entries of this rarity
        for(let i=entries.length-1;i>=0;i--){
            const isEq=S.equippedAuras.some(e=>e.id===aId&&e.mod===entries[i].mod);
            if(isEq)continue;
            let dv=SELL_VAL[a.rarity]||1;
            if(entries[i].mod){const m=MODIFIERS.find(x=>x.id===entries[i].mod);if(m)dv*=m.pMult;}
            dv=Math.floor(dv);
            entries.splice(i,1);
            S.dust+=dv;S.totalDust+=dv;dustGained+=dv;sold++;
        }
        if(!entries.length)delete S.auras[aId];
    }
    if(sold)toast(`Sold ${sold} auras for ${fmt(dustGained)}✨!`);else toast('Nothing to sell at that rarity!');
    selectedSell=null;renderSellPanel();updateRes();save();
}

function renderSellPanel(){
    const grid=document.getElementById('sell-grid');if(!grid)return;grid.innerHTML='';
    const actions=document.getElementById('sell-actions');
    document.getElementById('sell-dust-amount').textContent=fmt(S.dust);

    // Show all sellable auras (not equipped)
    const sellable=[];
    for(const aId of Object.keys(S.auras)){
        const entries=S.auras[aId];if(!entries||!entries.length)continue;
        const grp={};for(let i=0;i<entries.length;i++){const k=entries[i].mod||'_';if(!grp[k])grp[k]={mod:entries[i].mod,cnt:0,idx:i};grp[k].cnt++;}
        for(const g of Object.values(grp)){
            // Skip equipped
            const isEq=S.equippedAuras.some(e=>e.id===aId&&e.mod===g.mod);
            if(!isEq)sellable.push({aId,mod:g.mod,cnt:g.cnt,idx:g.idx});
        }
    }
    sellable.sort((a,b)=>getAuraPower(a.aId,a.mod)-getAuraPower(b.aId,b.mod)); // weakest first
    if(!sellable.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:var(--dim);padding:20px">Nothing to sell!</div>';actions.style.display='none';return;}

    for(const c of sellable){
        const a=AURAS.find(x=>x.id===c.aId);const r=getRarity(a.rarity);const m=c.mod?MODIFIERS.find(x=>x.id===c.mod):null;
        const dustVal=Math.floor((SELL_VAL[a.rarity]||1)*(m?m.pMult:1));
        const isSel=selectedSell&&selectedSell.aId===c.aId&&selectedSell.mod===c.mod;
        const card=document.createElement('div');card.className=`inv-card rarity-${a.rarity} ${m?m.css:''} ${isSel?'selected-for-action':''}`;
        card.innerHTML=`<span class="count-badge">x${c.cnt}</span><span class="item-icon">${a.icon}</span><div class="item-name">${a.name}</div><div class="item-rarity" style="color:${r.color}">${r.name}</div>${m?`<span class="item-modifier ${m.css}">${m.name}</span>`:''}<div class="item-power">${dustVal}✨ each</div>`;
        card.addEventListener('click',()=>{selectedSell={aId:c.aId,mod:c.mod,dustVal};renderSellPanel();});
        grid.appendChild(card);
    }
    // Actions
    if(selectedSell){
        const a=AURAS.find(x=>x.id===selectedSell.aId);
        actions.style.display='block';
        document.getElementById('sell-preview').innerHTML=`Sell 1x <strong>${a.name}</strong>${selectedSell.mod?' ['+selectedSell.mod+']':''} for <strong>${selectedSell.dustVal}✨</strong> dust?`;
    } else {actions.style.display='none';}
    renderAutoSellCheckboxes();
}

function doSellConfirm(){
    if(!selectedSell)return;
    sellAura(selectedSell.aId,selectedSell.mod);
    selectedSell=null;
    renderSellPanel();
}

// === REBIRTH ===
function canRebirth(){const t=Math.min(S.rebirths,REBIRTH_REQS.length-1);const r=REBIRTH_REQS[t];return S.level>=r.lv&&S.gold>=r.gold;}
function doRebirth(){
    if(!canRebirth()||!confirm('Rebirth? Resets level/gold/auras/gear/eggs/zone.\nKeeps: Gems, Dust, Pets, Shop, Achievements, Quests, Tower, Unlocked Features.'))return;
    S.rebirths++;S.level=1;S.xp=0;S.gold=0;S.auras={};S.gear={};S.equippedAuras=[];S.equippedGear=[];
    S.eggSlots=[];S.currentZone=0;S.rollZone=0;S.killCount=0;S.eliteKills=0;S.bossKills=0;
    S.hp=getMaxHp();S.totalRolls=0;S.pity=0;S.bestRarity='common';S.skillCds={};S.critBurst=0;S.goldBurstEnd=0;S.luckBurstEnd=0;S.dungeonCds={};
    if(autoRoll){clearInterval(autoRoll);autoRoll=null;}if(autoFight){clearInterval(autoFight);autoFight=null;}
    curEnemy=null;curEnemyHp=0;toast(`Rebirth ${S.rebirths}!`);checkAch();renderAll();save();
}

// === AURA FUSION (combine 2 different auras → unique hybrid with BOTH abilities) ===
function fuseAuras(auraId1,auraId2){
    if(!isUnlocked('fusion')){toast(`🔒 Fusion unlocks at Lv.${UNLOCK_REQS.fusion}`);return;}
    if(auraId1===auraId2){toast('Need 2 DIFFERENT auras!');return;}
    const e1=S.auras[auraId1];const e2=S.auras[auraId2];
    if(!e1||!e1.length||!e2||!e2.length){toast('Missing auras!');return;}
    // Don't consume equipped
    const eq1idx=e1.findIndex((e,i)=>!S.equippedAuras.some(x=>x.id===auraId1&&x.mod===e.mod));
    const eq2idx=e2.findIndex((e,i)=>!S.equippedAuras.some(x=>x.id===auraId2&&x.mod===e.mod));
    if(eq1idx===-1){toast("Can't fuse — all copies equipped!");return;}
    if(eq2idx===-1){toast("Can't fuse — all copies equipped!");return;}
    // Cost: 500 dust
    if(S.dust<500){toast('Need 500 dust to fuse!');return;}
    S.dust-=500;
    // Remove 1 of each
    e1.splice(eq1idx,1);if(!e1.length)delete S.auras[auraId1];
    e2.splice(eq2idx,1);if(!e2.length)delete S.auras[auraId2];
    // Create hybrid: combine names, icons, abilities
    const a1=AURAS.find(x=>x.id===auraId1);const a2=AURAS.find(x=>x.id===auraId2);
    const hybridId=`hybrid_${auraId1}_${auraId2}`;
    const maxRarity=ri(a1.rarity)>=ri(a2.rarity)?a1.rarity:a2.rarity;
    // Combine abilities (both apply)
    const hybridAbilities=[a1.ability,a2.ability];
    const hybridDesc=hybridAbilities.map(ab=>ab.desc).join(' + ');
    const hybridName=a1.name.split(' ')[0]+' '+a2.name.split(' ').pop();
    const hybridIcon=a1.icon;
    // Store hybrid data in state
    if(!S.hybrids)S.hybrids={};
    S.hybrids[hybridId]={id:hybridId,name:hybridName,icon:hybridIcon,rarity:maxRarity,zone:-1,
        ability:{type:'hybrid',abilities:hybridAbilities,desc:hybridDesc},isHybrid:true,
        source:[auraId1,auraId2]};
    // Add to inventory
    if(!S.auras[hybridId])S.auras[hybridId]=[];
    S.auras[hybridId].push({mod:null});
    S.fusionCount=(S.fusionCount||0)+1;
    toast(`🔀 HYBRID: ${hybridIcon} ${hybridName}! (${hybridDesc})`);
    addToHallOfFame(hybridId,null,maxRarity);
    checkAch();save();
}

// Helper: get aura data (checks hybrids too)
function getAuraData(id){
    const normal=AURAS.find(x=>x.id===id);
    if(normal)return normal;
    if(S.hybrids&&S.hybrids[id])return S.hybrids[id];
    return null;
}

// === GEAR UPGRADING (3 same → +1 level) ===
function upgradeGear(gearId){
    if(!S.gear[gearId]||S.gear[gearId]<3){toast('Need 3 copies!');return;}
    const currentLvl=S.gearUpgrades[gearId]||0;
    if(currentLvl>=5){toast('Max upgrade level!');return;}
    S.gear[gearId]-=2; // consume 2, keep 1 upgraded
    S.gearUpgrades[gearId]=currentLvl+1;
    const g=GEAR.find(x=>x.id===gearId);
    toast(`${g.name} upgraded to +${currentLvl+1}! (+${(currentLvl+1)*20}% power)`);
    save();
}
function getGearUpgradeMult(gearId){return 1+(S.gearUpgrades[gearId]||0)*0.2;}

// === COLLECTION MILESTONES ===
function checkCollectionMilestones(){}// now manual claim only
function claimIndexMilestone(type,count){
    let milestones,claimed,current;
    if(type==='aura'){milestones=COLLECTION_MILESTONES;claimed=S.collectionMilestonesClaimed||(S.collectionMilestonesClaimed=[]);current=Object.keys(S.auras).length;}
    else if(type==='pet'){milestones=PET_MILESTONES;claimed=S.petMilestonesClaimed||(S.petMilestonesClaimed=[]);current=Object.keys(S.pets).length;}
    else if(type==='gear'){milestones=GEAR_MILESTONES;claimed=S.gearMilestonesClaimed||(S.gearMilestonesClaimed=[]);current=Object.keys(S.gear).length;}
    else return;
    if(claimed.includes(count)){toast('Already claimed!');return;}
    const ms=milestones.find(m=>m.count===count);if(!ms||current<count){toast('Not reached yet!');return;}
    claimed.push(count);
    for(const[r,v]of Object.entries(ms.reward))S[r]=(S[r]||0)+v;
    toast(`🎉 ${ms.label} milestone claimed! ${Object.entries(ms.reward).map(([r,v])=>'+'+fmt(v)+' '+r).join(', ')}`);
    updateRes();save();
}

// === HALL OF FAME ===
function addToHallOfFame(auraId,mod,rarity){
    if(ri(rarity)<ri('legendary'))return; // only log legendary+
    S.hallOfFame=(S.hallOfFame||[]);
    S.hallOfFame.unshift({auraId,mod,rarity,time:Date.now()});
    if(S.hallOfFame.length>50)S.hallOfFame.pop(); // keep last 50
}

// === LUCKY WHEEL ===
function spinWheel(){
    if(!isUnlocked('wheel')){toast(`🔒 Wheel unlocks at Lv.${UNLOCK_REQS.wheel}`);return;}
    if(S.gems<WHEEL_COST){toast(`Need ${WHEEL_COST} gems!`);return;}
    S.gems-=WHEEL_COST;S.wheelSpins=(S.wheelSpins||0)+1;
    // Weighted random
    const totalWeight=WHEEL_PRIZES.reduce((s,p)=>s+p.weight,0);
    let roll=Math.random()*totalWeight;
    let prize=WHEEL_PRIZES[0];
    for(const p of WHEEL_PRIZES){roll-=p.weight;if(roll<=0){prize=p;break;}}
    // Grant reward
    for(const[r,v]of Object.entries(prize.reward))S[r]=(S[r]||0)+v;
    const rwStr=Object.entries(prize.reward).length?Object.entries(prize.reward).map(([r,v])=>'+'+v+' '+r).join(', '):'Nothing!';
    toast(`🎰 ${prize.name}! ${rwStr}`);
    updateRes();save();
    return prize;
}

// === TITLES ===
function checkTitles(){
    for(const t of TITLES){
        if(S.titlesUnlocked&&S.titlesUnlocked.includes(t.id))continue;
        // Special check for power-based title
        if(t.id==='max_power'&&getTotalPower()>=10000){if(!S.titlesUnlocked)S.titlesUnlocked=[];S.titlesUnlocked.push(t.id);toast(`Title unlocked: ${t.name}!`);continue;}
        if(t.check(S)){if(!S.titlesUnlocked)S.titlesUnlocked=[];S.titlesUnlocked.push(t.id);toast(`Title unlocked: ${t.name}!`);}
    }
}
function equipTitle(titleId){
    if(!S.titlesUnlocked||!S.titlesUnlocked.includes(titleId))return;
    S.equippedTitle=titleId;toast(`Title: ${TITLES.find(t=>t.id===titleId).name}`);save();
}

// === MINIGAMES ===
let memoryCards=[],memoryFlipped=[],memoryMatched=0,memoryLocked=false;
let frenzyActive=false,frenzyClicks=0,frenzyTimer=null;

function startMemoryGame(){
    if(!isUnlocked('minigames')){toast(`🔒 Minigames unlock at Lv.${UNLOCK_REQS.minigames}`);return;}
    const icons=['🔥','❄️','⚡','💎','🌙','💜','☀️','🐉','⭐','💀','🌟','🔮'];
    const pairs=4;const selected=icons.slice(0,pairs);
    memoryCards=[...selected,...selected].sort(()=>Math.random()-0.5);
    memoryFlipped=[];memoryMatched=0;memoryLocked=false;
    const grid=document.getElementById('memory-grid');grid.innerHTML='';
    grid.style.gridTemplateColumns=`repeat(4,1fr)`;
    for(let i=0;i<memoryCards.length;i++){
        const card=document.createElement('div');card.className='memory-card';card.dataset.idx=i;
        card.textContent='?';
        card.addEventListener('click',()=>flipMemoryCard(i));
        grid.appendChild(card);
    }
    document.getElementById('memory-result').textContent='';
}

function flipMemoryCard(idx){
    if(memoryLocked||memoryFlipped.includes(idx))return;
    const grid=document.getElementById('memory-grid');
    const cards=grid.querySelectorAll('.memory-card');
    const card=cards[idx];if(card.classList.contains('matched'))return;
    card.textContent=memoryCards[idx];card.classList.add('flipped');
    memoryFlipped.push(idx);
    if(memoryFlipped.length===2){
        memoryLocked=true;
        const[i1,i2]=memoryFlipped;
        if(memoryCards[i1]===memoryCards[i2]){
            cards[i1].classList.add('matched');cards[i2].classList.add('matched');
            memoryMatched++;memoryFlipped=[];memoryLocked=false;
            if(memoryMatched===4){
                const rw=MEMORY_REWARDS.pairs4;
                for(const[r,v]of Object.entries(rw))S[r]=(S[r]||0)+v;
                document.getElementById('memory-result').textContent=`🎉 All matched! +${Object.entries(rw).map(([r,v])=>v+' '+r).join(', ')}`;
                updateRes();save();
            }
        } else {
            setTimeout(()=>{cards[i1].textContent='?';cards[i1].classList.remove('flipped');cards[i2].textContent='?';cards[i2].classList.remove('flipped');memoryFlipped=[];memoryLocked=false;},800);
        }
    }
}

function startFrenzy(){
    if(!isUnlocked('minigames')){toast(`🔒 Minigames unlock at Lv.${UNLOCK_REQS.minigames}`);return;}
    if(frenzyActive)return;frenzyActive=true;frenzyClicks=0;
    document.getElementById('frenzy-target').style.display='flex';
    document.getElementById('frenzy-counter').textContent='0';
    document.getElementById('frenzy-result').textContent='';
    document.getElementById('btn-frenzy-start').disabled=true;
    let timeLeft=10;
    document.getElementById('frenzy-timer').textContent=`${timeLeft}s`;
    frenzyTimer=setInterval(()=>{
        timeLeft--;document.getElementById('frenzy-timer').textContent=`${timeLeft}s`;
        if(timeLeft<=0){endFrenzy();}
    },1000);
}

function frenzyClick(){
    if(!frenzyActive)return;frenzyClicks++;
    document.getElementById('frenzy-counter').textContent=frenzyClicks;
}

function endFrenzy(){
    clearInterval(frenzyTimer);frenzyActive=false;
    document.getElementById('frenzy-target').style.display='none';
    document.getElementById('btn-frenzy-start').disabled=false;
    // Determine reward tier
    let reward={gold:100};
    for(const tier of FRENZY_TIERS){if(frenzyClicks>=tier.clicks)reward=tier.reward;}
    for(const[r,v]of Object.entries(reward))S[r]=(S[r]||0)+v;
    document.getElementById('frenzy-result').textContent=`${frenzyClicks} clicks! +${Object.entries(reward).map(([r,v])=>v+' '+r).join(', ')}`;
    updateRes();save();
}

function playGuess(guessRarePlus){
    if(!isUnlocked('minigames')){toast(`🔒 Minigames unlock at Lv.${UNLOCK_REQS.minigames}`);return;}
    if(S.gold<100){toast('Need 100 gold to bet!');return;}
    S.gold-=100;
    // Simulate a roll
    const luck=getLuck();const roll=Math.random();
    let rarity='common';
    for(let i=RARITIES.length-1;i>=0;i--){
        if(roll<Math.min(0.5,luck/RARITIES[i].chance)){rarity=RARITIES[i].id;break;}
    }
    const isRarePlus=ri(rarity)>=ri('rare');
    const won=(guessRarePlus&&isRarePlus)||(!guessRarePlus&&!isRarePlus);
    const r=getRarity(rarity);
    if(won){S.gold+=200;document.getElementById('guess-result').innerHTML=`<span style="color:#10b981">✅ Correct! It was <strong style="color:${r.color}">${r.name}</strong>. +200 gold!</span>`;}
    else{document.getElementById('guess-result').innerHTML=`<span style="color:#ef4444">❌ Wrong! It was <strong style="color:${r.color}">${r.name}</strong>. -100 gold.</span>`;}
    document.getElementById('guess-display').textContent=isRarePlus?'✨':'😐';
    updateRes();save();
}

// === PROGRESSION LOCK CHECK ===
function isUnlocked(feature){
    const req=UNLOCK_REQS[feature]||1;
    // If player ever reached the level, it stays unlocked (survives rebirth)
    if(S.unlocksReached&&S.unlocksReached.includes(feature))return true;
    if(S.level>=req){
        // Permanently unlock
        if(!S.unlocksReached)S.unlocksReached=[];
        if(!S.unlocksReached.includes(feature)){S.unlocksReached.push(feature);toast(`🔓 Unlocked: ${feature}!`);save();}
        return true;
    }
    return false;
}
function checkUnlocks(){
    for(const[feat,lvl] of Object.entries(UNLOCK_REQS)){isUnlocked(feat);}
}

// === TUTORIAL SYSTEM ===
const TUTORIAL_STEPS=[
    {target:'btn-roll',title:'Welcome!',text:'This is RNG RPG! Let\'s start by rolling for your first aura. Click the Roll button!',action:'click',tab:'roll'},
    {target:'roll-result-display',title:'Nice Roll!',text:'You got an aura! Each aura has a rarity and special ability. The rarer it is, the more powerful.',action:'next',tab:'roll',delay:2500},
    {target:null,title:'Inventory',text:'Let\'s check your inventory. Click the Collection tab to see what you own.',action:'tab',tabTarget:'collection'},
    {target:'inventory-grid',title:'Your Auras',text:'Here are your auras. Click one to equip it — equipped auras boost your stats!',action:'next',tab:'collection'},
    {target:null,title:'Battle Time!',text:'Now let\'s fight! Click the Battle tab.',action:'tab',tabTarget:'battle'},
    {target:'btn-fight',title:'Fight!',text:'Click Fight to attack enemies. You earn gold and XP from kills!',action:'click',tab:'battle'},
    {target:'combat-log',title:'Combat',text:'You dealt damage! Keep fighting to earn gold for upgrades. Auto-fight will do it for you once unlocked.',action:'next',tab:'battle',delay:1500},
    {target:null,title:'Shop',text:'Let\'s spend gold! Click the Store tab.',action:'tab',tabTarget:'store'},
    {target:'shop-grid',title:'Upgrades',text:'Buy upgrades with gold & gems. Luck makes rare auras more likely. Speed makes rolls faster. Auto Roll unlocks auto-rolling!',action:'next',tab:'store'},
    {target:null,title:'Tutorial Complete!',text:'You\'re ready! Roll auras, fight enemies, upgrade your power, and collect them all. Check the other tabs as you level up — more features unlock with progression. Good luck!',action:'done'},
];

let tutorialStep=0;
let tutorialActive=false;

function startTutorial(){
    if(S.tutorialDone)return;
    tutorialActive=true;tutorialStep=0;
    document.getElementById('tutorial-overlay').style.display='block';
    showTutorialStep();
}

function showTutorialStep(){
    const step=TUTORIAL_STEPS[tutorialStep];if(!step){endTutorial();return;}
    const overlay=document.getElementById('tutorial-overlay');
    const tooltip=document.getElementById('tut-tooltip');
    // Remove old highlight
    document.querySelectorAll('.tut-highlight').forEach(el=>{el.classList.remove('tut-highlight');
        let p=el.parentElement;while(p&&p!==document.body){p.style.zIndex='';p=p.parentElement;}
    });

    // Switch tab if needed
    if(step.tab){
        document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
        document.querySelectorAll('#content>.panel').forEach(p=>p.classList.remove('active'));
        const tabBtn=document.querySelector(`.tab[data-tab="${step.tab}"]`);
        if(tabBtn)tabBtn.classList.add('active');
        const panel=document.getElementById(`panel-${step.tab}`);
        if(panel)panel.classList.add('active');
        renderAll();
    }

    // Highlight target
    const target=step.target?document.getElementById(step.target):null;
    if(target){target.classList.add('tut-highlight');
        // Boost parent stacking contexts so highlight escapes
        let el=target.parentElement;while(el&&el!==document.body){const z=getComputedStyle(el).zIndex;if(z!=='auto'&&parseInt(z)<8001)el.style.zIndex='8001';el=el.parentElement;}
    }

    // For tab actions, highlight the tab button
    if(step.action==='tab'&&step.tabTarget){
        const tabBtn=document.querySelector(`.tab[data-tab="${step.tabTarget}"]`);
        if(tabBtn){tabBtn.classList.add('tut-highlight');
            let el=tabBtn.parentElement;while(el&&el!==document.body){el.style.zIndex='8001';el=el.parentElement;}
        }
    }

    // Position tooltip
    let tooltipHTML=`<div class="tut-title">${step.title}</div><div class="tut-text">${step.text}</div>`;

    if(step.action==='click'){
        tooltipHTML+=`<div style="font-size:.68rem;color:var(--dim)">👆 Click the highlighted element</div>`;
        // Wait for click on target
        if(target){
            const handler=()=>{target.removeEventListener('click',handler);setTimeout(()=>advanceTutorial(),step.delay||500);};
            target.addEventListener('click',handler);
        }
    } else if(step.action==='tab'){
        tooltipHTML+=`<div style="font-size:.68rem;color:var(--dim)">👆 Click the ${step.tabTarget} tab</div>`;
        const tabBtn=document.querySelector(`.tab[data-tab="${step.tabTarget}"]`);
        if(tabBtn){
            tabBtn.classList.add('tut-highlight');
            const handler=()=>{tabBtn.removeEventListener('click',handler);setTimeout(()=>advanceTutorial(),300);};
            tabBtn.addEventListener('click',handler);
        }
    } else if(step.action==='next'){
        tooltipHTML+=`<button class="tut-btn" id="tut-next-btn">Next →</button>`;
    } else if(step.action==='done'){
        tooltipHTML+=`<button class="tut-btn" id="tut-done-btn">Let's go! 🎲</button>`;
    }

    tooltip.innerHTML=tooltipHTML;

    // Position near target or center
    if(target){
        const rect=target.getBoundingClientRect();
        tooltip.style.transform='';
        // Always place tooltip well below the target with a big gap
        const topPos=rect.bottom+40;
        if(topPos+200<window.innerHeight){
            tooltip.style.top=topPos+'px';
        } else {
            // If not enough room below, put it above with big gap
            tooltip.style.top=Math.max(10,rect.top-200)+'px';
        }
        // Center horizontally relative to target
        const leftPos=Math.max(10,Math.min(rect.left+(rect.width/2)-150,window.innerWidth-320));
        tooltip.style.left=leftPos+'px';
    } else {
        tooltip.style.top='50%';tooltip.style.left='50%';tooltip.style.transform='translate(-50%,-50%)';
    }

    // Wire next/done buttons
    setTimeout(()=>{
        document.getElementById('tut-next-btn')?.addEventListener('click',advanceTutorial);
        document.getElementById('tut-done-btn')?.addEventListener('click',endTutorial);
    },50);
}

function advanceTutorial(){
    tutorialStep++;
    if(tutorialStep>=TUTORIAL_STEPS.length){endTutorial();return;}
    showTutorialStep();
}

function endTutorial(){
    tutorialActive=false;
    document.getElementById('tutorial-overlay').style.display='none';
    document.querySelectorAll('.tut-highlight').forEach(el=>{el.classList.remove('tut-highlight');
        let p=el.parentElement;while(p&&p!==document.body){p.style.zIndex='';p=p.parentElement;}
    });
    S.tutorialDone=true;save();
}
