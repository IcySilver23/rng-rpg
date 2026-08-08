// === RENDERING ===
function updateRes(){
    document.querySelector('[data-res="gold"]').textContent=fmt(S.gold);
    document.querySelector('[data-res="gems"]').textContent=fmt(S.gems);
    document.querySelector('[data-res="dust"]').textContent=fmt(S.dust);
    document.querySelector('[data-res="luck"]').textContent=getLuck().toFixed(1)+'x';
    document.getElementById('player-level').textContent=`Lv.${S.level}`;
    document.getElementById('xp-fill-mini').style.width=Math.min(100,(S.xp/xpFor(S.level))*100)+'%';
    const rb=document.getElementById('rebirth-badge');if(S.rebirths>0){rb.style.display='';rb.textContent=`R${S.rebirths}`;}else rb.style.display='none';
    document.getElementById('rap-value').textContent=fmt(getRAP());
    document.getElementById('header-power').textContent=fmt(getTotalPower());
}
function updateCombat(){
    document.getElementById('player-dmg').textContent=fmt(getPlayerDmg());
    document.getElementById('player-def').textContent=fmt(getDef());renderPHp();
    const z=ZONES[S.currentZone];document.getElementById('combat-zone-info').textContent=`${z.icon} ${z.name} | Kills:${fmt(S.killCount)} | Elites:${fmt(S.eliteKills)} | Pwr:${fmt(getTotalPower())}`;
}
function renderOdds(){const c=document.getElementById('odds-table');c.innerHTML='';for(const r of RARITIES){c.innerHTML+=`<div class="odds-row"><span class="odds-name" style="color:${r.color}">${r.name}</span><span class="odds-chance">1 in ${fmt(r.chance)}</span></div>`;}}
function renderSkills(){const bar=document.getElementById('skills-bar');bar.innerHTML='';for(const sk of SKILLS){const ok=S.level>=sk.lvl,cd=S.skillCds[sk.id]||0,on=Date.now()<cd,rem=on?Math.ceil((cd-Date.now())/1000):0;const b=document.createElement('button');b.className='skill-btn';b.disabled=!ok||on;b.title=sk.desc;b.innerHTML=ok?`${sk.icon}${sk.name}${on?`<span class="cooldown-overlay">${rem}s</span>`:''}`:`🔒Lv${sk.lvl}`;b.addEventListener('click',()=>useSkill(sk.id));bar.appendChild(b);}}
function renderCharacter(){
    // ASCII art character (changes based on power level)
    const pw=getTotalPower();
    let art;
    if(pw>=10000)art="  [★★★]  \n  ╔═╗  \n ╔╩═╩╗ \n ║ ◉◉║ \n ║ ▽ ║ \n ╠═══╣ \n║█████║\n║█████║\n ╚╤═╤╝ \n  ┘ └  ";
    else if(pw>=1000)art="  [★★]  \n  ┌─┐  \n ┌┤ ├┐ \n │◉ ◉│ \n │ ▽ │ \n ├───┤ \n │███│ \n │███│ \n └┬─┬┘ \n  ┘ └  ";
    else if(pw>=100)art="  [★]   \n  ┌─┐  \n  │ │  \n  │◉◉│ \n  │▽ │ \n  ├──┤ \n  │██│ \n  │██│ \n  └┬┬┘ \n   ┘└  ";
    else art="   ○   \n  ┌┴┐  \n  │ │  \n  │..│ \n  │- │ \n  ├──┤ \n  │  │ \n  │  │ \n  └┬┬┘ \n   ┘└  ";
    document.getElementById('char-art').textContent=art;

    // Level/XP
    document.getElementById('char-level-display').textContent=`Level ${S.level} | Rebirth ${S.rebirths} | Ascension ${S.ascensions||0}`;
    const xpNeed=xpFor(S.level);const xpPct=Math.min(100,(S.xp/xpNeed)*100);
    document.getElementById('char-xp-fill').style.width=xpPct+'%';
    document.getElementById('char-xp-text').textContent=`${fmt(S.xp)} / ${fmt(xpNeed)} XP`;
    document.getElementById('char-aura-slots').textContent=getAuraSlots();

    // Stats grid
    const sg=document.getElementById('char-stats-grid');
    sg.innerHTML=`
        <div class="char-stat"><span class="cs-label">⚔️ Damage</span><span class="cs-value">${fmt(getPlayerDmg())}</span></div>
        <div class="char-stat"><span class="cs-label">❤️ Max HP</span><span class="cs-value">${fmt(getMaxHp())}</span></div>
        <div class="char-stat"><span class="cs-label">🛡️ Defense</span><span class="cs-value">${fmt(getDef())}</span></div>
        <div class="char-stat"><span class="cs-label">🎯 Crit</span><span class="cs-value">${(getCrit()*100).toFixed(1)}%</span></div>
        <div class="char-stat"><span class="cs-label">💚 Lifesteal</span><span class="cs-value">${(getLifesteal()*100).toFixed(1)}%</span></div>
        <div class="char-stat"><span class="cs-label">🍀 Luck</span><span class="cs-value">${getLuck().toFixed(1)}x</span></div>
        <div class="char-stat"><span class="cs-label">⚔️ Power</span><span class="cs-value">${fmt(getTotalPower())}</span></div>
        <div class="char-stat"><span class="cs-label">🪙 Gold Mult</span><span class="cs-value">${getGoldMult().toFixed(2)}x</span></div>
        <div class="char-stat"><span class="cs-label">📖 XP Mult</span><span class="cs-value">${getXpMult().toFixed(2)}x</span></div>
        <div class="char-stat"><span class="cs-label">⚡ Roll Speed</span><span class="cs-value">${getRollSpd().toFixed(1)}x</span></div>
        <div class="char-stat"><span class="cs-label">💰 RAP</span><span class="cs-value">${fmt(getRAP())}</span></div>
        <div class="char-stat"><span class="cs-label">🗼 Tower</span><span class="cs-value">F${S.towerFloor}</span></div>
    `;

    // Equipped auras
    const eaDiv=document.getElementById('char-equipped-auras');eaDiv.innerHTML='';
    for(let i=0;i<getAuraSlots();i++){
        if(i<S.equippedAuras.length){
            const eq=S.equippedAuras[i];const a=AURAS.find(x=>x.id===eq.id)||(S.hybrids&&S.hybrids[eq.id]);
            if(a){const r=getRarity(a.rarity);const desc=a.ability.type==='hybrid'?a.ability.desc:a.ability.desc;
            eaDiv.innerHTML+=`<div class="char-eq-item" style="border-color:${r.color}"><span class="eq-icon">${a.icon}</span>${a.name}${eq.mod?' ['+eq.mod+']':''}<span style="color:var(--dim);font-size:.6rem;margin-left:4px">${desc}</span></div>`;}
            else{eaDiv.innerHTML+=`<div class="char-eq-empty">Unknown aura</div>`;}
        } else {eaDiv.innerHTML+=`<div class="char-eq-empty">Empty slot</div>`;}
    }
    // Equipped gear
    const egDiv=document.getElementById('char-equipped-gear');egDiv.innerHTML='';
    for(let i=0;i<3;i++){
        if(i<S.equippedGear.length){
            const g=GEAR.find(x=>x.id===S.equippedGear[i]);const r=getRarity(g.rarity);const enchs=(S.enchants[g.id]||[]).length;
            egDiv.innerHTML+=`<div class="char-eq-item" style="border-color:${r.color}"><span class="eq-icon">${g.icon}</span>${g.name}${enchs?' ['+enchs+'✨]':''}</div>`;
        } else {egDiv.innerHTML+=`<div class="char-eq-empty">Empty slot</div>`;}
    }
    // Active pets
    const epDiv=document.getElementById('char-equipped-pets');epDiv.innerHTML='';
    for(let i=0;i<3;i++){
        if(i<S.activePets.length){
            const p=PETS.find(x=>x.id===S.activePets[i]);const r=getRarity(p.rarity);
            epDiv.innerHTML+=`<div class="char-eq-item" style="border-color:${r.color}"><span class="eq-icon">${p.icon}</span>${p.name} Lv${getPetLevel(p.id)}<span style="color:var(--dim);font-size:.6rem;margin-left:4px">${p.desc}</span></div>`;
        } else {epDiv.innerHTML+=`<div class="char-eq-empty">Empty slot</div>`;}
    }
    // Active effects (potions, luck burst, gold burst, set bonus)
    const efDiv=document.getElementById('char-effects');efDiv.innerHTML='';
    S.potionEffects=S.potionEffects.filter(p=>p.endTime>Date.now());
    for(const p of S.potionEffects){const rem=Math.ceil((p.endTime-Date.now())/1000);efDiv.innerHTML+=`<div class="char-effect">🧪 ${p.type} ${p.value}x (${rem}s)</div>`;}
    if(Date.now()<S.luckBurstEnd)efDiv.innerHTML+=`<div class="char-effect">🍀 3x Luck</div>`;
    if(Date.now()<S.goldBurstEnd)efDiv.innerHTML+=`<div class="char-effect">🪙 5x Gold</div>`;
    const sb=getSetBonus();if(sb)efDiv.innerHTML+=`<div class="char-effect">🛡️ ${sb.name} Set</div>`;
    if(!efDiv.innerHTML)efDiv.innerHTML='<div style="color:var(--dim);font-size:.72rem">No active effects</div>';
    // Title display
    const titleObj=TITLES.find(t=>t.id===(S.equippedTitle||'newbie'));
    document.getElementById('char-title-display').textContent=titleObj?`[ ${titleObj.name} ]`:'';
    renderCharTitles();
}

function renderCombat(){updateCombat();renderEnemy();renderSkills();}

function renderInv(){
    // Always render all three inventory grids
    const grid=document.getElementById('inventory-grid');
    const gearGrid=document.getElementById('inv-gear');
    const petsGrid=document.getElementById('inv-pets');

    // === AURAS ===
    if(grid){grid.innerHTML='';
        const cards=[];for(const aId of Object.keys(S.auras)){const entries=S.auras[aId];if(!entries||!entries.length)continue;const grp={};for(let i=0;i<entries.length;i++){const k=entries[i].mod||'_';if(!grp[k])grp[k]={mod:entries[i].mod,cnt:0,idx:i};grp[k].cnt++;}for(const g of Object.values(grp))cards.push({aId,mod:g.mod,cnt:g.cnt,idx:g.idx});}
        cards.sort((a,b)=>getAuraPower(b.aId,b.mod)-getAuraPower(a.aId,a.mod));
        for(const c of cards){const a=AURAS.find(x=>x.id===c.aId)||(S.hybrids&&S.hybrids[c.aId]);if(!a)continue;const r=getRarity(a.rarity),pw=getAuraPower(c.aId,c.mod);
            const isEq=S.equippedAuras.some(e=>e.id===c.aId&&e.mod===c.mod);
            const m=c.mod?MODIFIERS.find(x=>x.id===c.mod):null;
            const card=document.createElement('div');card.className=`inv-card rarity-${a.rarity} ${m?m.css:''}`;
            card.innerHTML=`${isEq?'<span class="equip-badge">EQ</span>':''}<span class="count-badge">x${c.cnt}</span><span class="item-icon">${a.icon}</span><div class="item-name">${a.name}</div><div class="item-rarity" style="color:${r.color}">${r.name}</div>${m?`<span class="item-modifier ${m.css}">${m.name}</span>`:''}<div class="item-power">⚔️${fmt(pw)} | ${a.ability.desc}</div>`;
            card.addEventListener('click',()=>equipAura(c.aId,c.idx));
            card.addEventListener('contextmenu',e=>{e.preventDefault();unequipAura(c.aId,c.mod);});
            card.addEventListener('mouseenter',e=>{const a2=AURAS.find(x=>x.id===c.aId)||(S.hybrids&&S.hybrids[c.aId]);if(!a2)return;const r2=getRarity(a2.rarity);const dustVal=Math.floor((SELL_VAL[a2.rarity]||1)*(c.mod?MODIFIERS.find(x=>x.id===c.mod)?.pMult||1:1));showTooltip(e,`<div class="tt-name" style="color:${r2.color}">${a2.name}</div><div class="tt-rarity">${r2.name}${c.mod?' ['+c.mod+']':''}</div><div class="tt-power">Power: ${fmt(pw)}</div><div class="tt-ability">${a2.ability.desc||a2.ability.abilities?.map(x=>x.desc).join(' + ')}</div><div class="tt-mod">Left=Equip | Right=Unequip</div>`);});
            card.addEventListener('mouseleave',hideTooltip);
            grid.appendChild(card);}
        if(!cards.length)grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:var(--dim);padding:30px">Roll some auras!</div>';
    }
    // === GEAR ===
    if(gearGrid){gearGrid.innerHTML='';
        const owned=Object.keys(S.gear).filter(id=>S.gear[id]>0).sort((a,b)=>(GEAR.find(x=>x.id===b)?.power||0)-(GEAR.find(x=>x.id===a)?.power||0));
        const sb=getSetBonus();if(sb){gearGrid.innerHTML=`<div style="grid-column:1/-1;padding:6px 10px;background:var(--bg2);border-radius:6px;font-size:.7rem;color:#10b981">Set: ${sb.name} — ${sb.desc}</div>`;}
        for(const gId of owned){const g=GEAR.find(x=>x.id===gId),r=getRarity(g.rarity),isEq=S.equippedGear.includes(gId);const eqCount=S.equippedGear.filter(x=>x===gId).length;const enchs=S.enchants[gId]||[];const enchStr=enchs.length?` [${enchs.length}✨]`:'';const setName=g.set?GEAR_SETS[g.set]?.name:'';const card=document.createElement('div');card.className=`inv-card rarity-${g.rarity}`;card.innerHTML=`${eqCount?`<span class="equip-badge">EQ x${eqCount}</span>`:''}<span class="count-badge">x${S.gear[gId]}</span><span class="item-icon">${g.icon}</span><div class="item-name">${g.name}${enchStr}</div><div class="item-rarity" style="color:${r.color}">${r.name}</div>${setName?`<div style="font-size:.55rem;color:var(--sub)">[${setName} Set]</div>`:''}<div class="item-power">⚔️${fmt(g.power*getGearUpgradeMult(gId))}${g.defense?' 🛡️'+g.defense:''}</div>`;card.addEventListener('click',()=>equipGear(gId));card.addEventListener('contextmenu',e=>{e.preventDefault();unequipGear(gId);});gearGrid.appendChild(card);}
        if(!owned.length)gearGrid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:var(--dim);padding:30px">Fight for gear!</div>';
    }
    // === PETS ===
    if(petsGrid){petsGrid.innerHTML='';
        const owned=Object.keys(S.pets).filter(id=>S.pets[id]>0).sort((a,b)=>ri(PETS.find(x=>x.id===b)?.rarity||'common')-ri(PETS.find(x=>x.id===a)?.rarity||'common'));
        for(const pId of owned){const p=PETS.find(x=>x.id===pId),r=getRarity(p.rarity),act=S.activePets.includes(pId);const lvl=getPetLevel(pId);const onExp=S.expeditions.some(e=>e.petId===pId);const card=document.createElement('div');card.className=`inv-card rarity-${p.rarity}`;card.innerHTML=`${act?'<span class="equip-badge">ON</span>':''}${onExp?'<span class="equip-badge" style="background:#f59e0b">EXP</span>':''}<span class="count-badge">x${S.pets[pId]}</span><span class="item-icon">${p.icon}</span><div class="item-name">${p.name} Lv${lvl}</div><div class="item-rarity" style="color:${r.color}">${r.name}</div><div class="item-power">${p.desc} (x${getPetBonusMult(pId).toFixed(1)})</div>`;
            card.addEventListener('click',()=>activatePet(pId));card.addEventListener('contextmenu',e=>{e.preventDefault();deactivatePet(pId);});petsGrid.appendChild(card);}
        if(!owned.length)petsGrid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:var(--dim);padding:30px">Hatch eggs!</div>';
    }
    // Equipped bar
    document.getElementById('equipped-auras-display').textContent=`${S.equippedAuras.length}/${getAuraSlots()}`;
    document.getElementById('equipped-gear-count').textContent=`${S.equippedGear.length}/3`;
    document.getElementById('total-power').textContent=fmt(getTotalPower());
    document.getElementById('active-pets').textContent=`${S.activePets.length}/3`;
    document.getElementById('inv-count').textContent=`${getInvCount()}/${getInvCapacity()}`;
    document.getElementById('inv-count').style.color=isInvFull()?'#ef4444':'';
}

function renderIndex(){
    const grid=document.getElementById('index-grid'),filters=document.getElementById('index-filters');
    if(!grid||!filters)return;
    // Index tab buttons
    const idxTabs=document.querySelectorAll('.idx-tab');
    const activeIdx=document.querySelector('.idx-tab.active')?.dataset.idxtab||'aura-idx';
    // Wire idx tabs
    idxTabs.forEach(t=>{t.onclick=()=>{idxTabs.forEach(x=>x.classList.remove('active'));t.classList.add('active');renderIndex();}});

    if(activeIdx==='aura-idx'){
        filters.innerHTML='';grid.innerHTML='';
        const zones=[{name:'All',val:-2},{name:'Plains',val:0},{name:'Volcanic',val:1},{name:'Ocean',val:2},{name:'Void',val:3},{name:'Cosmos',val:4},{name:'Under',val:5},{name:'Celest',val:6},{name:'Global',val:-1}];
        for(const z of zones){const btn=document.createElement('button');btn.className='index-filter';btn.textContent=z.name;btn.dataset.zone=z.val;btn.addEventListener('click',()=>{filters.querySelectorAll('.index-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderIndexGrid(z.val);});filters.appendChild(btn);}
        filters.children[0].classList.add('active');
        const disc=Object.keys(S.auras).length;
        document.getElementById('index-progress').textContent=`Auras: ${disc}/${AURAS.length} (${Math.floor(disc/AURAS.length*100)}%)`;
        // Milestones inside grid
        let msHtml='<div style="grid-column:1/-1;display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px">';
        for(const ms of COLLECTION_MILESTONES){const claimed=(S.collectionMilestonesClaimed||[]).includes(ms.count);const reached=disc>=ms.count;
            msHtml+=`<button class="btn-sm" style="font-size:.6rem${claimed?';opacity:.5':reached?';background:var(--accent);color:#fff':''}" ${claimed||!reached?'disabled':''} onclick="claimIndexMilestone('aura',${ms.count})">${ms.label}${claimed?' ✓':''}</button>`;}
        msHtml+='</div>';grid.innerHTML=msHtml;
        renderIndexGrid(-2);
    } else if(activeIdx==='pet-idx'){
        filters.innerHTML='';grid.innerHTML='';
        const disc=Object.keys(S.pets).length;
        document.getElementById('index-progress').textContent=`Pets: ${disc}/${PETS.length} (${Math.floor(disc/PETS.length*100)}%)`;
        let msHtml='<div style="grid-column:1/-1;display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px">';
        for(const ms of PET_MILESTONES){const claimed=(S.petMilestonesClaimed||[]).includes(ms.count);const reached=disc>=ms.count;
            msHtml+=`<button class="btn-sm" style="font-size:.6rem${claimed?';opacity:.5':reached?';background:var(--accent);color:#fff':''}" ${claimed||!reached?'disabled':''} onclick="claimIndexMilestone('pet',${ms.count})">${ms.label}${claimed?' ✓':''}</button>`;}
        msHtml+='</div>';grid.innerHTML=msHtml;
        for(const p of PETS){const owned=!!S.pets[p.id];const r=getRarity(p.rarity);
            const el=document.createElement('div');el.className=`index-entry${owned?'':' undiscovered'} rarity-${p.rarity}`;
            el.innerHTML=`<span class="idx-icon">${p.icon}</span><div class="idx-name" style="color:${r.color}">${owned?p.name:'???'}</div><div class="idx-odds">${owned?p.desc:r.name}</div>`;
            grid.appendChild(el);}
    } else if(activeIdx==='gear-idx'){
        filters.innerHTML='';grid.innerHTML='';
        const disc=Object.keys(S.gear).length;
        document.getElementById('index-progress').textContent=`Gear: ${disc}/${GEAR.length} (${Math.floor(disc/GEAR.length*100)}%)`;
        let msHtml='<div style="grid-column:1/-1;display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px">';
        for(const ms of GEAR_MILESTONES){const claimed=(S.gearMilestonesClaimed||[]).includes(ms.count);const reached=disc>=ms.count;
            msHtml+=`<button class="btn-sm" style="font-size:.6rem${claimed?';opacity:.5':reached?';background:var(--accent);color:#fff':''}" ${claimed||!reached?'disabled':''} onclick="claimIndexMilestone('gear',${ms.count})">${ms.label}${claimed?' ✓':''}</button>`;}
        msHtml+='</div>';grid.innerHTML=msHtml;
        for(const g of GEAR){const owned=!!S.gear[g.id];const r=getRarity(g.rarity);
            const el=document.createElement('div');el.className=`index-entry${owned?'':' undiscovered'} rarity-${g.rarity}`;
            el.innerHTML=`<span class="idx-icon">${g.icon}</span><div class="idx-name" style="color:${r.color}">${owned?g.name:'???'}</div><div class="idx-odds">${owned?'⚔️'+fmt(g.power):r.name}</div>`;
            grid.appendChild(el);}
    }
}
function renderIndexGrid(zone){
    const grid=document.getElementById('index-grid');
    // Remove only index entries (keep milestones div)
    grid.querySelectorAll('.index-entry').forEach(el=>el.remove());
    const pool=zone===-2?AURAS:AURAS.filter(a=>a.zone===zone);
    for(const a of pool){const disc=!!S.auras[a.id];const r=getRarity(a.rarity);const effStr='1 in '+fmt(r.chance);
        const el=document.createElement('div');el.className=`index-entry${disc?'':' undiscovered'} rarity-${a.rarity}`;
        el.innerHTML=`<span class="idx-icon">${a.icon}</span><div class="idx-name" style="color:${r.color}">${disc?a.name:'???'}</div><div class="idx-odds">${effStr}</div>`;
        grid.appendChild(el);}
}
function renderEggs(){
    const sc=document.getElementById('egg-slots');sc.innerHTML='';
    for(let i=0;i<S.eggSlots.length;i++){const sl=S.eggSlots[i],e=EGG_TYPES.find(x=>x.id===sl.type),el=Date.now()-sl.start,pct=Math.min(100,(el/sl.dur)*100),ready=el>=sl.dur,rem=ready?0:Math.ceil((sl.dur-el)/1000),m=Math.floor(rem/60),s=rem%60;
        const d=document.createElement('div');d.className=`egg-slot${ready?' ready':''}`;d.innerHTML=`<span class="egg-icon">${e.icon}</span><div class="egg-name">${e.name}</div><div class="egg-progress"><div class="egg-progress-fill" style="width:${pct}%"></div></div><div class="egg-time">${ready?'✅ Ready!':`${m}m${s}s`}</div>${ready?`<button class="btn-hatch" data-i="${i}">Hatch!</button>`:''}`;sc.appendChild(d);}
    for(let i=S.eggSlots.length;i<S.maxEggs;i++){const d=document.createElement('div');d.className='egg-slot';d.innerHTML='<span class="egg-icon" style="opacity:.3">🥚</span><div class="egg-name" style="color:var(--dim)">Empty</div>';sc.appendChild(d);}
    sc.querySelectorAll('.btn-hatch').forEach(b=>b.addEventListener('click',()=>hatchEgg(parseInt(b.dataset.i))));
    const sg=document.getElementById('egg-shop-grid');sg.innerHTML='';
    for(const e of EGG_TYPES){const ci=e.currency==='gold'?'🪙':'💎';const d=document.createElement('div');d.className='egg-shop-card';d.innerHTML=`<span class="egg-icon">${e.icon}</span><div class="egg-name">${e.name}</div><div class="egg-cost">${ci}${fmt(e.cost)}</div><div class="egg-desc">${Math.ceil(e.hatchTime/getEggSpd())}s</div>`;d.addEventListener('click',()=>buyEgg(e.id));sg.appendChild(d);}
    // Expeditions
    renderExpeditions();
    // Auto-sell sync
    const asSel=document.getElementById('auto-sell-select');if(asSel)asSel.value=S.autoSellBelow||'none';
}
function renderExpeditions(){
    const active=document.getElementById('expedition-active');if(!active)return;
    active.innerHTML='';
    for(let i=0;i<S.expeditions.length;i++){
        const exp=S.expeditions[i];const type=EXPEDITION_TYPES.find(x=>x.id===exp.type);
        const pet=PETS.find(p=>p.id===exp.petId);const elapsed=Date.now()-exp.startTime;
        const pct=Math.min(100,(elapsed/exp.duration)*100);const ready=elapsed>=exp.duration;
        const rem=ready?0:Math.ceil((exp.duration-elapsed)/1000);const m=Math.floor(rem/60),s=rem%60;
        active.innerHTML+=`<div style="background:var(--bg3);border-radius:var(--rs);padding:8px;margin-bottom:6px;font-size:.75rem;display:flex;justify-content:space-between;align-items:center"><span>${pet.icon} ${pet.name} → ${type.icon} ${type.name} ${ready?'✅':`(${m}m${s}s)`}</span>${ready?`<button class="btn-sm" onclick="collectExpedition(${i})">Collect</button>`:''}</div>`;
    }
    // Send UI
    const sendDiv=document.getElementById('expedition-send');if(!sendDiv)return;
    if(S.expeditions.length>=S.maxExpeditions){sendDiv.innerHTML='<div style="font-size:.7rem;color:var(--dim)">Max expeditions active.</div>';return;}
    const availPets=Object.keys(S.pets).filter(id=>S.pets[id]>0&&!S.activePets.includes(id)&&!S.expeditions.some(e=>e.petId===id));
    if(!availPets.length){sendDiv.innerHTML='<div style="font-size:.7rem;color:var(--dim)">No available pets (unequip one or hatch more).</div>';return;}
    let html='<div style="font-size:.72rem;margin-bottom:4px">Send pet:</div><select id="exp-pet-sel" style="background:var(--bg3);color:var(--text);border:1px solid var(--border);border-radius:var(--rs);padding:4px 8px;font-size:.72rem;margin-right:6px">';
    for(const pid of availPets){const p=PETS.find(x=>x.id===pid);html+=`<option value="${pid}">${p.icon}${p.name}</option>`;}
    html+='</select><select id="exp-type-sel" style="background:var(--bg3);color:var(--text);border:1px solid var(--border);border-radius:var(--rs);padding:4px 8px;font-size:.72rem;margin-right:6px">';
    for(const t of EXPEDITION_TYPES)html+=`<option value="${t.id}">${t.icon}${t.name} (${Math.floor(t.duration/60)}m)</option>`;
    html+=`</select><button class="btn-sm" onclick="sendExpedition(document.getElementById('exp-pet-sel').value,document.getElementById('exp-type-sel').value)">Send</button>`;
    sendDiv.innerHTML=html;
}
function renderZones(){renderCombatZoneSelect();}
function renderDungeons(){const l=document.getElementById('dungeon-list');l.innerHTML='';for(const d of DUNGEONS){const pw=getTotalPower(),ok=pw>=d.reqPower,cd=S.dungeonCds[d.id]||0,on=Date.now()<cd,rem=on?Math.ceil((cd-Date.now())/1000):0,done=S.dungeonsDone.includes(d.id);const el=document.createElement('div');el.className=`dungeon-card${ok?'':' locked'}`;el.innerHTML=`<div class="dungeon-info"><h4>${d.icon} ${d.name}${done?' ✅':''}</h4><p>${d.boss.name} (${fmt(d.boss.hp)}HP) | Multi-room run</p><div class="dungeon-req">Req:${fmt(d.reqPower)}</div></div><button class="dungeon-btn" ${!ok||on?'disabled':''} data-d="${d.id}">${on?`${rem}s`:ok?'⚔️ Enter':'🔒'}</button>`;l.appendChild(el);}l.querySelectorAll('.dungeon-btn').forEach(b=>b.addEventListener('click',()=>startDungeonRun(b.dataset.d)));}

function renderTower(){
    const info=document.getElementById('tower-info');const enemy=getTowerEnemy();
    let msHtml='<div style="margin-top:8px;font-size:.7rem;color:var(--sub)">Milestones: ';
    for(const ms of TOWER_MILESTONES){
        const claimed=S.towerRewardsClaimed.includes(ms.floor);
        const reached=S.towerFloor>ms.floor;
        msHtml+=`<span style="color:${claimed?'#10b981':reached?'var(--legendary)':'var(--dim)'}">[F${ms.floor}${claimed?'✓':''}]</span> `;
    }
    msHtml+='</div>';
    info.innerHTML=`<strong>🗼 Floor ${S.towerFloor}</strong><br>Guardian HP: ${fmt(enemy.hp)} | DMG: ${fmt(enemy.dmg)}<br>Reward: ${fmt(enemy.gold)}🪙 ${fmt(enemy.xp)}XP${S.towerFloor%5===0?' +'+S.towerFloor+'💎':''}${msHtml}`;
    document.getElementById('tower-enemy').innerHTML=`<div style="font-size:3rem">🗼</div><div>Your Power: ${fmt(getTotalPower())} | DMG: ${fmt(getPlayerDmg())}</div>`;
}
function renderQuests(){
    const l=document.getElementById('quest-list');l.innerHTML='';
    const done=S.questsDone.slice(-2);
    for(const qId of done){const q=QUESTS.find(x=>x.id===qId);if(q)l.innerHTML+=`<div class="quest-card completed"><div class="quest-info"><strong>✅ ${q.name}</strong><p>${q.desc}</p></div></div>`;}
    const cur=QUESTS.find(x=>x.id===S.questProg);
    if(cur){
        const rw=Object.entries(cur.reward).map(([r,v])=>`${r==='gold'?'🪙':'💎'}${fmt(v)}`).join(' ');
        const ready=S.questReady;
        l.innerHTML+=`<div class="quest-card current"><div class="quest-info"><strong>${ready?'✅':'📜'} ${cur.name}</strong><p>${cur.desc}</p><div class="quest-reward">${rw}</div>${ready?'<button class="btn-sm" id="btn-claim-quest" style="margin-top:6px">🎁 Claim!</button>':'<div style="font-size:.6rem;color:var(--dim);margin-top:4px">In progress...</div>'}</div></div>`;
        let nx=cur.next?QUESTS.find(x=>x.id===cur.next):null;for(let i=0;i<2&&nx;i++){l.innerHTML+=`<div class="quest-card locked"><div class="quest-info"><strong>🔒 ${nx.name}</strong><p>${nx.desc}</p></div></div>`;nx=nx.next?QUESTS.find(x=>x.id===nx.next):null;}
    } else l.innerHTML+='<div class="quest-card"><div class="quest-info"><strong>All quests done!</strong></div></div>';
    document.getElementById('btn-claim-quest')?.addEventListener('click',claimQuest);
}
function renderPotions(){
    const active=document.getElementById('active-potions');active.innerHTML='';
    S.potionEffects=S.potionEffects.filter(p=>p.endTime>Date.now());
    for(const p of S.potionEffects){const rem=Math.ceil((p.endTime-Date.now())/1000);active.innerHTML+=`<div class="active-potion">${p.type} ${p.value}x (${rem}s)</div>`;}
    const grid=document.getElementById('potion-grid');grid.innerHTML='';
    for(const pot of POTIONS){const afford=S[pot.currency]>=pot.cost;const ci=pot.currency==='dust'?'✨':'🪙';
        grid.innerHTML+=`<div class="potion-card"><div class="pot-icon">${pot.icon}</div><div class="pot-name">${pot.name}</div><div class="pot-desc">${pot.desc}</div><div class="pot-cost">${ci}${fmt(pot.cost)}</div><button class="pot-btn" ${afford?'':'disabled'} data-pot="${pot.id}">Use</button></div>`;}
    grid.querySelectorAll('.pot-btn').forEach(b=>b.addEventListener('click',()=>usePotion(b.dataset.pot)));
}
function renderDaily(){
    const streak=document.getElementById('daily-streak');
    const today=Math.floor(Date.now()/86400000);const lastDay=Math.floor((S.lastDaily||0)/86400000);
    const canClaim=today>lastDay||!S.lastDaily;
    streak.innerHTML=`Streak: <strong>${S.dailyStreak+1}/7</strong> days ${canClaim?'— <span style="color:#10b981">CLAIM AVAILABLE!</span>':'— Come back tomorrow!'}`;
    const grid=document.getElementById('daily-grid');grid.innerHTML='';
    for(let i=0;i<7;i++){const r=DAILY_REWARDS[i];const claimed=i<S.dailyStreak%7&&!canClaim;const available=canClaim&&i===S.dailyStreak%7;
        const rw=Object.entries(r.reward).map(([k,v])=>`${v}${k[0]}`).join(' ');
        grid.innerHTML+=`<div class="daily-card${claimed?' claimed':''}${available?' available':''}"><div class="day-num">Day ${i+1}</div><div class="day-reward">${rw}</div></div>`;}
}
function renderShop(){
    const g=document.getElementById('shop-grid');g.innerHTML='';
    for(const item of SHOP){
        const lv=uLvl(item.id),mx=lv>=item.max,cost=mx?0:uCost(item),ok=mx?false:S[item.cur]>=cost,ci=item.cur==='gold'?'🪙':'💎';
        let preview='';
        if(!mx){
            if(item.id==='luck_boost')preview=`${getLuck().toFixed(1)}x → ${(getLuck()+0.3).toFixed(1)}x`;
            else if(item.id==='dmg_boost')preview=`DMG ~${fmt(getPlayerDmg())} → ~${fmt(Math.floor(getPlayerDmg()*1.1))}`;
            else if(item.id==='hp_boost')preview=`HP ${fmt(getMaxHp())} → ${fmt(getMaxHp()+20)}`;
            else if(item.id==='gold_boost')preview=`${getGoldMult().toFixed(2)}x → ${(getGoldMult()+0.1).toFixed(2)}x`;
            else if(item.id==='roll_speed')preview=`${getRollSpd().toFixed(1)}x → ${(getRollSpd()+0.1).toFixed(1)}x`;
            else if(item.id==='crit_boost')preview=`${(getCrit()*100).toFixed(1)}% → ${((getCrit()+0.02)*100).toFixed(1)}%`;
            else if(item.id==='auto_roll')preview=lv===0?'Unlocks auto-rolling':`${Math.floor(getAutoMs())}ms/roll`;
            else if(item.id==='multi_roll')preview=`x${getMultiRollCount()} → x${getMultiRollCount()+1}`;
            else if(item.id==='auto_battle')preview='Unlocks auto-fight';
            else if(item.id==='aura_slots')preview=`${getAuraSlots()} → ${getAuraSlots()+1} slots`;
            else if(item.id==='inv_slots')preview=`Inv: ${getInvCapacity()} → ${getInvCapacity()+10}`;
            else if(item.id==='auto_sell_unlock')preview='Unlocks auto-sell feature';
        }
        g.innerHTML+=`<div class="shop-card"><h4>${item.name}</h4><div class="shop-desc">${item.desc}</div><div class="shop-level">Lv${lv}/${item.max}</div>${preview?`<div class="shop-preview">${preview}</div>`:''}<div class="shop-cost">${mx?'MAX':`${ci}${fmt(cost)}`}</div><button class="shop-btn" ${!ok||mx?'disabled':''} data-s="${item.id}">${mx?'MAX':'Buy'}</button></div>`;
    }
    g.querySelectorAll('.shop-btn').forEach(b=>b.addEventListener('click',()=>buyUpgrade(b.dataset.s)));
}
function renderRebirth(){
    const t=Math.min(S.rebirths,REBIRTH_REQS.length-1),r=REBIRTH_REQS[t];
    document.getElementById('rebirth-info').innerHTML=`<strong>Rebirths: ${S.rebirths}</strong><br>Next: Lv${r.lv} & ${fmt(r.gold)} gold<br>You: Lv${S.level}, ${fmt(S.gold)} gold`;
    const b=document.getElementById('rebirth-bonuses');b.innerHTML=S.rebirths>0?`<div class="rebirth-bonus">🍀+${(S.rebirths*RB_BONUS.luck*100).toFixed(0)}%</div><div class="rebirth-bonus">⚔️+${(S.rebirths*RB_BONUS.power*100).toFixed(0)}%</div><div class="rebirth-bonus">📖+${(S.rebirths*RB_BONUS.xp*100).toFixed(0)}%</div><div class="rebirth-bonus">🪙+${(S.rebirths*RB_BONUS.gold*100).toFixed(0)}%</div><div class="rebirth-bonus">🎯Pity:${getPityMax()}</div>`:'';
    document.getElementById('btn-rebirth').disabled=!canRebirth();
}
function renderAch(){const g=document.getElementById('achievements-grid');g.innerHTML='';for(const a of ACHIEVEMENTS){const done=S.achDone.includes(a.id);const rw=Object.entries(a.reward).map(([r,v])=>`${r==='gold'?'🪙':'💎'}${v}`).join(' ');g.innerHTML+=`<div class="achievement-card${done?' completed':''}"><div class="ach-name">${done?'✅':'⬜'}${a.name}</div><div class="ach-desc">${a.desc}</div><div class="ach-reward">${rw}</div></div>`;}}
function renderStats(){document.getElementById('stats-grid').innerHTML=`<div class="stat-row">🎲 Rolls: ${fmt(S.totalRolls)}</div><div class="stat-row">⚔️ Kills: ${fmt(S.killCount)}</div><div class="stat-row">⚡ Elites: ${fmt(S.eliteKills)}</div><div class="stat-row">💀 Bosses: ${S.bossKills}</div><div class="stat-row">🏰 Dungeons: ${S.dungeonsDone.length}</div><div class="stat-row">🗼 Tower: F${S.towerFloor}</div><div class="stat-row">🔄 Rebirths: ${S.rebirths}</div><div class="stat-row">📊 Level: ${S.level}</div><div class="stat-row">⚔️ Power: ${fmt(getTotalPower())}</div><div class="stat-row">🍀 Luck: ${getLuck().toFixed(1)}x</div><div class="stat-row">💰 RAP: ${fmt(getRAP())}</div><div class="stat-row">📦 Auras: ${Object.keys(S.auras).length}/${AURAS.length}</div><div class="stat-row">🐾 Pets: ${Object.keys(S.pets).length}/${PETS.length}</div><div class="stat-row">📜 Quests: ${S.questsDone.length}/${QUESTS.length}</div><div class="stat-row">🏅 Achievements: ${S.achDone.length}/${ACHIEVEMENTS.length}</div>`;}
function renderRollZone(){const sel=document.getElementById('roll-zone-select');sel.innerHTML='';for(let i=0;i<ZONES.length;i++){const z=ZONES[i];if(i===0||getTotalPower()>=z.reqPower){const o=document.createElement('option');o.value=i;o.textContent=`${z.icon} ${z.name}`;if(i===S.rollZone)o.selected=true;sel.appendChild(o);}}}
function renderAll(){updateRes();renderOdds();renderRollZone();renderCombatZoneSelect();renderCharacter();renderInv();renderIndex();renderEggs();renderCombat();renderZones();renderDungeons();renderTower();renderQuests();renderPotions();renderEnchantPanel();renderCraftPanel();renderSellPanel();renderPetLevelPanel();renderFusionSelects();renderGearUpgrades();renderHallOfFame();renderWheel();renderDaily();renderShop();renderRebirth();renderAch();renderStats();renderTrade();renderWorldBoss();renderAscension();checkNotifications();
    document.getElementById('roll-total').textContent=fmt(S.totalRolls);document.getElementById('roll-pity').textContent=S.pity;document.getElementById('pity-max').textContent=getPityMax();document.getElementById('roll-luck').textContent=getLuck().toFixed(1)+'x';document.getElementById('roll-dry').textContent=S.dryStreak||0;const best=getRarity(S.bestRarity);document.getElementById('roll-best').textContent=best.name;document.getElementById('roll-best').style.color=best.color;
    // Auto roll button state
    const autoBtn=document.getElementById('btn-auto-roll');
    if(autoBtn){if(!uLvl('auto_roll')){autoBtn.disabled=true;autoBtn.textContent='🔒 Auto (Shop)';}else if(!autoRoll){autoBtn.disabled=false;autoBtn.textContent=`⚡ Auto (${Math.floor(getAutoMs())}ms)`;}}
    // Multi-roll button text
    const rollBtn=document.getElementById('btn-roll');
    const multiCount=getMultiRollCount();
    if(rollBtn&&!rollBtn.disabled)rollBtn.textContent=multiCount>1?`🎲 Roll x${multiCount}`:'🎲 Roll';
    // Auto fight button state
    const afBtn=document.getElementById('btn-auto-fight');
    if(afBtn){if(!uLvl('auto_battle')){afBtn.disabled=true;afBtn.textContent='🔒 Auto (Shop)';}else if(!autoFight){afBtn.disabled=false;afBtn.textContent='⚡ Auto';}}
    // Show lock status on sub-tabs
    document.querySelectorAll('.sub-tab').forEach(t=>{
        const st=t.dataset.subtab;let lockFeat=null;
        if(st==='tower')lockFeat='tower';else if(st==='worldboss')lockFeat='worldBoss';
        else if(st==='enchanting')lockFeat='enchanting';else if(st==='crafting')lockFeat='crafting';
        else if(st==='potions')lockFeat='potions';else if(st==='memory'||st==='frenzy'||st==='guess')lockFeat='minigames';
        else if(st==='wheel-sub')lockFeat='wheel';
        if(lockFeat&&!isUnlocked(lockFeat)){t.textContent=`🔒 ${t.textContent.replace('🔒 ','')}`; t.style.opacity='0.5';}
        else{t.textContent=t.textContent.replace('🔒 ','');t.style.opacity='';}
    });}

// === ENCHANTING (Full System) ===
const ENCH_TIERS=[
    {name:'Normal',color:'var(--common)',success:0.9,statMult:1,dustCost:100,gemCost:0},
    {name:'Magic',color:'var(--uncommon)',success:0.7,statMult:1.8,dustCost:250,gemCost:0},
    {name:'Rare',color:'var(--rare)',success:0.5,statMult:3,dustCost:500,gemCost:5},
    {name:'Epic',color:'var(--epic)',success:0.3,statMult:5,dustCost:1000,gemCost:15},
    {name:'Legendary',color:'var(--legendary)',success:0.1,statMult:10,dustCost:3000,gemCost:50},
];
// Max slots per gear rarity
function getGearMaxSlots(gearId){const g=GEAR.find(x=>x.id===gearId);if(!g)return 1;const r=ri(g.rarity);return Math.min(5,Math.max(1,r+1));}
let selectedEnchantGear=null;

function getEnchantStat(gearId,stat){
    const enchs=S.enchants[gearId];if(!enchs)return 0;
    return enchs.filter(e=>e.stat===stat).reduce((s,e)=>s+e.value,0);
}

function doEnchant(){
    if(!isUnlocked('enchanting')){toast(`🔒 Enchanting unlocks at Lv.${UNLOCK_REQS.enchanting}`);return;}
    if(!selectedEnchantGear){toast('Select gear first!');return;}
    const gId=selectedEnchantGear;
    const maxSlots=getGearMaxSlots(gId);
    const current=(S.enchants[gId]||[]).length;
    if(current>=maxSlots){toast('All slots filled! Reroll or clear.');return;}
    const tierIdx=parseInt(document.getElementById('enchant-tier-select').value);
    const tier=ENCH_TIERS[tierIdx];
    if(S.dust<tier.dustCost){toast(`Need ${fmt(tier.dustCost)} dust!`);return;}
    if(S.gems<tier.gemCost){toast(`Need ${tier.gemCost} gems!`);return;}
    S.dust-=tier.dustCost;if(tier.gemCost)S.gems-=tier.gemCost;

    const log=document.getElementById('enchant-log');
    // Roll success
    if(Math.random()<tier.success){
        // Success! Roll random enchant with tier multiplier
        const ench=ENCHANT_POOL[Math.floor(Math.random()*ENCHANT_POOL.length)];
        const val=+((ench.min+Math.random()*(ench.max-ench.min))*tier.statMult).toFixed(3);
        if(!S.enchants[gId])S.enchants[gId]=[];
        S.enchants[gId].push({stat:ench.stat,value:val,tier:tierIdx});
        addEnchLog(log,`✅ SUCCESS! ${tier.name} ${ench.name} +${val.toFixed(2)}`,'ench-success');sfxSuccess();
        if(tierIdx>=4)addEnchLog(log,'⭐ LEGENDARY ENCHANT!','ench-legendary');
    } else {
        // Fail!
        addEnchLog(log,`❌ FAILED! ${tier.name} enchant destroyed.`,'ench-fail');sfxError();
        // On epic+ fail, risk destroying a random existing enchant
        if(tierIdx>=3&&S.enchants[gId]&&S.enchants[gId].length>0&&Math.random()<0.3){
            S.enchants[gId].pop();
            addEnchLog(log,'💥 An existing enchant was destroyed!','ench-fail');
        }
    }
    renderEnchantWorkshop();updateRes();save();
}

function doEnchantStone(){
    if(!selectedEnchantGear){toast('Select gear!');return;}
    if(!S.enchantStones||S.enchantStones<=0){toast('No enchant stones!');return;}
    const gId=selectedEnchantGear;
    const maxSlots=getGearMaxSlots(gId);
    if((S.enchants[gId]||[]).length>=maxSlots){toast('Slots full!');return;}
    S.enchantStones--;
    const tierIdx=parseInt(document.getElementById('enchant-tier-select').value);
    const tier=ENCH_TIERS[tierIdx];
    const ench=ENCHANT_POOL[Math.floor(Math.random()*ENCHANT_POOL.length)];
    const val=+((ench.min+Math.random()*(ench.max-ench.min))*tier.statMult).toFixed(3);
    if(!S.enchants[gId])S.enchants[gId]=[];
    S.enchants[gId].push({stat:ench.stat,value:val,tier:tierIdx});
    const log=document.getElementById('enchant-log');
    addEnchLog(log,`🔮 STONE USED! ${tier.name} ${ench.name} +${val.toFixed(2)}`,'ench-success');
    renderEnchantWorkshop();updateRes();save();
}

function rerollEnchant(){
    if(!selectedEnchantGear)return;
    const gId=selectedEnchantGear;
    if(!S.enchants[gId]||!S.enchants[gId].length){toast('Nothing to reroll!');return;}
    const cost=300;if(S.dust<cost){toast(`Need ${cost} dust!`);return;}
    S.dust-=cost;
    const last=S.enchants[gId][S.enchants[gId].length-1];
    const tier=ENCH_TIERS[last.tier||0];
    const ench=ENCHANT_POOL[Math.floor(Math.random()*ENCHANT_POOL.length)];
    const val=+((ench.min+Math.random()*(ench.max-ench.min))*tier.statMult).toFixed(3);
    S.enchants[gId][S.enchants[gId].length-1]={stat:ench.stat,value:val,tier:last.tier||0};
    const log=document.getElementById('enchant-log');
    addEnchLog(log,`🔄 Rerolled → ${ench.name} +${val.toFixed(2)}`,'ench-success');
    renderEnchantWorkshop();updateRes();save();
}

function clearEnchants(){
    if(!selectedEnchantGear)return;
    if(!confirm('Remove ALL enchants from this gear?'))return;
    delete S.enchants[selectedEnchantGear];
    toast('Enchants cleared.');renderEnchantWorkshop();save();
}

function addEnchLog(c,m,cls){const d=document.createElement('div');d.className=cls;d.textContent=m;c.appendChild(d);while(c.children.length>20)c.firstChild.remove();c.scrollTop=c.scrollHeight;}

function selectEnchantGear(gId){
    selectedEnchantGear=gId;
    document.getElementById('enchant-workshop').style.display='block';
    renderEnchantWorkshop();
}

function renderEnchantPanel(){
    // Resources
    document.getElementById('ench-dust').textContent=fmt(S.dust);
    document.getElementById('ench-stones').textContent=fmt(S.enchantStones||0);
    // Gear grid
    const grid=document.getElementById('enchant-gear-grid');grid.innerHTML='';
    const owned=Object.keys(S.gear).filter(id=>S.gear[id]>0);
    for(const gId of owned){
        const g=GEAR.find(x=>x.id===gId);const r=getRarity(g.rarity);
        const slots=getGearMaxSlots(gId);const filled=(S.enchants[gId]||[]).length;
        const card=document.createElement('div');
        card.className=`enchant-gear-card${selectedEnchantGear===gId?' selected':''}`;
        card.innerHTML=`<span class="eg-icon">${g.icon}</span><div style="font-weight:600;color:${r.color}">${g.name}</div><div class="eg-slots">${filled}/${slots} slots</div>`;
        card.addEventListener('click',()=>selectEnchantGear(gId));
        grid.appendChild(card);
    }
    if(!owned.length)grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:var(--dim);padding:20px">No gear to enchant!</div>';
    if(selectedEnchantGear)renderEnchantWorkshop();
}

function renderEnchantWorkshop(){
    if(!selectedEnchantGear){document.getElementById('enchant-workshop').style.display='none';return;}
    document.getElementById('enchant-workshop').style.display='block';
    const gId=selectedEnchantGear;const g=GEAR.find(x=>x.id===gId);
    if(!g){selectedEnchantGear=null;return;}
    const r=getRarity(g.rarity);
    document.getElementById('enchant-selected-info').innerHTML=`<span style="color:${r.color}">${g.icon} ${g.name}</span> (⚔️${fmt(g.power)})`;
    // Slots
    const maxSlots=getGearMaxSlots(gId);const enchs=S.enchants[gId]||[];
    const slotsDiv=document.getElementById('enchant-slots-display');slotsDiv.innerHTML='';
    for(let i=0;i<maxSlots;i++){
        const slot=document.createElement('div');
        if(i<enchs.length){
            const e=enchs[i];const tier=ENCH_TIERS[e.tier||0];
            const enchData=ENCHANT_POOL.find(x=>x.stat===e.stat);
            slot.className='ench-slot filled';
            slot.innerHTML=`<div class="es-tier" style="color:${tier.color}">${tier.name}</div><div class="es-stat">${enchData?enchData.name:e.stat} +${e.value.toFixed(2)}</div>`;
        } else {
            slot.className='ench-slot empty';slot.innerHTML='Empty';
        }
        slotsDiv.appendChild(slot);
    }
    // Cost display
    const tierIdx=parseInt(document.getElementById('enchant-tier-select').value||'0');
    const tier=ENCH_TIERS[tierIdx];
    document.getElementById('enchant-cost-display').innerHTML=`Cost: ✨${fmt(tier.dustCost)}${tier.gemCost?' + 💎'+tier.gemCost:''} | Success: ${(tier.success*100).toFixed(0)}% | Stat x${tier.statMult}`;
    // Button states
    document.getElementById('btn-enchant').disabled=enchs.length>=maxSlots||S.dust<tier.dustCost;
    document.getElementById('btn-enchant-stone').disabled=enchs.length>=maxSlots||!(S.enchantStones>0);
    document.getElementById('btn-reroll').disabled=!enchs.length;
    // Update resources display
    document.getElementById('ench-dust').textContent=fmt(S.dust);
    document.getElementById('ench-stones').textContent=fmt(S.enchantStones||0);
}

// === TRADING POST ===
function refreshTrade(){
    // Pick 4 random items from pool
    const shuffled=[...TRADE_POOL].sort(()=>Math.random()-0.5);
    S.tradeStock=shuffled.slice(0,4).map(t=>({...t}));
    S.tradeRefresh=Date.now()+600000; // 10 min refresh
    save();
}
function buyTrade(idx){
    const item=S.tradeStock[idx];if(!item)return;
    if(S[item.currency]<item.cost){toast('Not enough!');return;}
    S[item.currency]-=item.cost;
    if(!S.auras[item.aura])S.auras[item.aura]=[];
    S.auras[item.aura].push({mod:null});
    const a=AURAS.find(x=>x.id===item.aura);
    toast(`Bought: ${a.icon} ${a.name}!`);
    S.tradeStock.splice(idx,1);
    updateRes();save();renderTrade();
}

// === WORLD BOSS (expanded) ===
let wbAutoInterval=null;

function spawnWorldBoss(){
    const wb=WORLD_BOSSES[Math.floor(Math.random()*WORLD_BOSSES.length)];
    S.worldBoss={id:wb.id,hp:wb.hp,maxHp:wb.hp,startTime:Date.now(),totalDmg:0,milestonesHit:[]};
    toast(`⚠️ WORLD BOSS: ${wb.icon} ${wb.name} has appeared!`);
    save();
}

function getWbPhase(){
    if(!S.worldBoss)return null;
    const wb=WORLD_BOSSES.find(x=>x.id===S.worldBoss.id);
    const hpPct=S.worldBoss.hp/S.worldBoss.maxHp;
    let current=wb.phases[0];
    for(const p of wb.phases){if(hpPct<=p.threshold)current=p;}
    return current;
}

function hitWorldBoss(){
    if(!isUnlocked('worldBoss')){toast(`🔒 World Boss unlocks at Lv.${UNLOCK_REQS.worldBoss}`);return;}
    if(!S.worldBoss||S.worldBoss.hp<=0)return;
    const wb=WORLD_BOSSES.find(x=>x.id===S.worldBoss.id);
    // Check enrage timer
    const elapsed=(Date.now()-S.worldBoss.startTime)/1000;
    if(elapsed>=wb.enrageTime){
        toast('💀 World Boss enraged and fled! Too slow.');
        S.worldBoss=null;S.worldBossCd=Date.now()+300000;
        if(wbAutoInterval){clearInterval(wbAutoInterval);wbAutoInterval=null;}
        renderWorldBoss();save();return;
    }
    // Phase damage multiplier (boss hits harder in later phases — reflected in rewards)
    let d=getPlayerDmg();if(Math.random()<getCrit())d*=2;
    d=Math.floor(d*(0.85+Math.random()*0.3));
    S.worldBoss.hp-=d;S.worldBoss.totalDmg=(S.worldBoss.totalDmg||0)+d;
    if(!S.worldBoss.milestonesHit)S.worldBoss.milestonesHit=[];
    // Check damage milestones
    for(let i=0;i<wb.milestones.length;i++){
        if(S.worldBoss.totalDmg>=wb.milestones[i].dmg&&!S.worldBoss.milestonesHit.includes(i)){
            S.worldBoss.milestonesHit.push(i);
            for(const[r,v]of Object.entries(wb.milestones[i].reward))S[r]=(S[r]||0)+v;
            toast(`🎯 Milestone! +${Object.entries(wb.milestones[i].reward).map(([r,v])=>fmt(v)+' '+r).join(', ')}`);
        }
    }
    const log=document.getElementById('wb-log');
    if(log){const div=document.createElement('div');div.textContent=`⚔️ ${fmt(d)} damage`;log.appendChild(div);while(log.children.length>20)log.firstChild.remove();log.scrollTop=log.scrollHeight;}
    // Boss killed?
    if(S.worldBoss.hp<=0){
        S.gold+=wb.rewards.gold;S.totalGold+=wb.rewards.gold;
        S.gems+=wb.rewards.gems;S.dust+=wb.rewards.dust;S.totalDust+=wb.rewards.dust;
        S.wbKills=(S.wbKills||0)+1;
        const timeStr=Math.floor(elapsed)+'s';
        toast(`🎉 ${wb.name} DEFEATED in ${timeStr}! +${fmt(wb.rewards.gold)}🪙 +${wb.rewards.gems}💎 +${wb.rewards.dust}✨`);
        S.worldBoss=null;S.worldBossCd=Date.now()+600000;
        if(wbAutoInterval){clearInterval(wbAutoInterval);wbAutoInterval=null;}
        checkAch();
    }
    updateRes();save();renderWorldBoss();
}

function toggleWbAuto(){
    if(wbAutoInterval){clearInterval(wbAutoInterval);wbAutoInterval=null;document.getElementById('btn-wb-auto')?.classList.remove('active');}
    else{wbAutoInterval=setInterval(hitWorldBoss,400);document.getElementById('btn-wb-auto')?.classList.add('active');}
}

function renderWorldBoss(){
    const status=document.getElementById('wb-status');
    const arena=document.getElementById('wb-arena');
    if(!status||!arena)return;

    if(!S.worldBoss||S.worldBoss.hp<=0){
        arena.style.display='none';
        const cd=S.worldBossCd||0;const rem=Math.max(0,Math.ceil((cd-Date.now())/1000));
        if(rem>0){status.innerHTML=`<div style="font-size:2rem;margin-bottom:8px">💤</div>Next boss spawns in: <strong>${Math.floor(rem/60)}m ${rem%60}s</strong><br><br><div style="font-size:.72rem;color:var(--dim)">World Bosses Killed: ${S.wbKills||0}</div>`;}
        else{status.innerHTML='<div style="font-size:2rem;margin-bottom:8px">⚠️</div>A world boss is spawning...';spawnWorldBoss();}
        status.style.display='block';return;
    }
    status.style.display='none';arena.style.display='block';
    const wb=WORLD_BOSSES.find(x=>x.id===S.worldBoss.id);
    const phase=getWbPhase();
    const hpPct=Math.max(0,(S.worldBoss.hp/S.worldBoss.maxHp)*100);
    const elapsed=Math.floor((Date.now()-(S.worldBoss.startTime||Date.now()))/1000);
    const remaining=Math.max(0,wb.enrageTime-elapsed);
    const dps=elapsed>0?Math.floor((S.worldBoss.totalDmg||0)/elapsed):0;

    document.getElementById('wb-boss-display').innerHTML=`<div style="font-size:4rem">${wb.icon}</div><div style="font-size:1.2rem;font-weight:700">${wb.name}</div>`;
    document.getElementById('wb-hp-fill').style.width=hpPct+'%';
    document.getElementById('wb-hp-text').textContent=`${fmt(Math.max(0,S.worldBoss.hp))} / ${fmt(S.worldBoss.maxHp)}`;
    document.getElementById('wb-phase').textContent=phase.name;
    document.getElementById('wb-phase').className=`wb-phase`;document.getElementById('wb-phase').style.color=phase.color;
    document.getElementById('wb-timer').textContent=`⏱️ ${remaining}s remaining`;
    document.getElementById('wb-timer').style.color=remaining<30?'var(--mythic)':'var(--sub)';
    document.getElementById('wb-stats').innerHTML=`<span>DPS: ${fmt(dps)}</span><span>Total DMG: ${fmt(S.worldBoss.totalDmg||0)}</span><span>Your DMG/hit: ${fmt(getPlayerDmg())}</span><span>Elapsed: ${elapsed}s</span>`;
    // Milestones
    const msDiv=document.getElementById('wb-milestones');msDiv.innerHTML='';
    for(let i=0;i<wb.milestones.length;i++){
        const ms=wb.milestones[i];const hit=(S.worldBoss.milestonesHit||[]).includes(i);const reached=(S.worldBoss.totalDmg||0)>=ms.dmg;
        msDiv.innerHTML+=`<div class="wb-milestone${hit?' claimed':''}${reached&&!hit?' reached':''}">${fmt(ms.dmg)} DMG${hit?' ✓':''}</div>`;
    }
}

// === ASCENSION ===
function canAscend(){
    const tier=Math.min(S.ascensions||0,ASCENSION_REQS.length-1);
    const req=ASCENSION_REQS[tier];
    return S.rebirths>=req.rebirths&&S.gems>=req.gems;
}
function doAscend(){
    if(!canAscend())return;
    if(!confirm('ASCENSION resets EVERYTHING except: Ascension level, Achievements.\nFeature unlocks will reset!\nMassive permanent bonuses.\n\nProceed?'))return;
    const tier=Math.min(S.ascensions,ASCENSION_REQS.length-1);
    S.gems-=ASCENSION_REQS[tier].gems;
    S.ascensions=(S.ascensions||0)+1;
    // Full reset (keep ascensions + achievements)
    const keepAch=[...S.achDone];const keepAsc=S.ascensions;const keepCodes=[...S.codesUsed];
    const fresh=JSON.parse(JSON.stringify(DEF_STATE));
    S=fresh;S.ascensions=keepAsc;S.achDone=keepAch;S.codesUsed=keepCodes;
    if(autoRoll){clearInterval(autoRoll);autoRoll=null;}
    if(autoFight){clearInterval(autoFight);autoFight=null;}
    curEnemy=null;curEnemyHp=0;
    toast(`ASCENSION ${keepAsc}! Massive permanent bonuses!`);
    renderAll();save();
}

// === SEASONAL AURA ROLL INJECTION ===
// Seasonal auras have a small chance to appear on ANY roll regardless of zone
function getSeasonalRoll(){
    if(!S.seasonalActive)return null;
    if(Math.random()<0.005){
        const pool=AURAS.filter(a=>SEASONAL_AURAS.includes(a.id));
        return pool[Math.floor(Math.random()*pool.length)];
    }
    return null;
}

// === PET LEVELING ===
function getPetLevel(petId){return S.petLevels[petId]||1;}
function getPetLevelCost(petId){return getPetLevel(petId);} // costs 1 dupe per level
function getPetBonusMult(petId){return 1+(getPetLevel(petId)-1)*0.25;} // +25% per level

function levelUpPet(petId){
    const lvl=getPetLevel(petId);const cost=getPetLevelCost(petId);
    if(!S.pets[petId]||S.pets[petId]<cost+1){toast(`Need ${cost} extra ${PETS.find(p=>p.id===petId).name} dupes!`);return;}// +1 because you keep 1
    S.pets[petId]-=cost;
    S.petLevels[petId]=(S.petLevels[petId]||1)+1;
    toast(`Pet leveled up! Lv.${S.petLevels[petId]} (+${((S.petLevels[petId]-1)*25)}% bonus)`);
    renderInv();save();
}

// Override petBonus to include levels
const _origPetBonus=petBonus;
function petBonusWithLevels(type){
    let t=0;
    for(const pid of S.activePets){
        const p=PETS.find(x=>x.id===pid);
        if(p&&(p.bonus.type===type||p.bonus.type==='all')){
            t+=p.bonus.value*getPetBonusMult(pid);
        }
    }
    return t;
}
// Replace petBonus reference — we redefine it
// (The original petBonus is already defined; we patch it below in init)

// === EXPEDITIONS ===
const EXPEDITION_TYPES=[
    {id:'exp_gold',name:'Gold Hunt',icon:'🪙',duration:300,reward:{gold:()=>Math.floor(500*getGoldMult()*(1+S.level*0.1))}},
    {id:'exp_dust',name:'Dust Mine',icon:'✨',duration:600,reward:{dust:()=>Math.floor(50+S.level*5)}},
    {id:'exp_stones',name:'Stone Search',icon:'🔮',duration:900,reward:{enchantStones:()=>Math.random()<0.4?1:0}},
    {id:'exp_gems',name:'Gem Expedition',icon:'💎',duration:1200,reward:{gems:()=>Math.floor(5+S.level*0.5)}},
    {id:'exp_egg',name:'Egg Hunt',icon:'🥚',duration:1800,reward:{gold:()=>Math.floor(2000*getGoldMult()),gems:()=>3}},
];

function sendExpedition(petId,expType){
    if(S.expeditions.length>=S.maxExpeditions){toast('Max expeditions active!');return;}
    if(!S.pets[petId]||S.pets[petId]<1){toast('No pet!');return;}
    if(S.activePets.includes(petId)){toast('Unequip pet first!');return;}
    if(S.expeditions.some(e=>e.petId===petId)){toast('Pet already on expedition!');return;}
    const exp=EXPEDITION_TYPES.find(x=>x.id===expType);if(!exp)return;
    S.expeditions.push({petId,type:expType,startTime:Date.now(),duration:exp.duration*1000});
    toast(`${PETS.find(p=>p.id===petId).name} sent on ${exp.name}!`);
    renderExpeditions();save();
}

function collectExpedition(idx){
    const exp=S.expeditions[idx];if(!exp)return;
    if(Date.now()-exp.startTime<exp.duration){toast('Not done yet!');return;}
    const type=EXPEDITION_TYPES.find(x=>x.id===exp.type);
    let rewardStr='';
    for(const[res,fn]of Object.entries(type.reward)){
        const val=fn();if(val>0){S[res]=(S[res]||0)+val;rewardStr+=`+${val} ${res} `;}
    }
    S.expeditions.splice(idx,1);
    toast(`Expedition complete! ${rewardStr.trim()}`);
    renderExpeditions();updateRes();save();
}

// === AUTO-SELL ===
function setAutoSell(level){S.autoSellBelow=level;save();}
function toggleAutoSellRarity(rarity){
    if(!uLvl('auto_sell_unlock')){toast('Buy "Auto Sell" from Shop first!');return;}
    if(!S.autoSellRarities)S.autoSellRarities={};
    S.autoSellRarities[rarity]=!S.autoSellRarities[rarity];save();renderAutoSellCheckboxes();
}
function tryAutoSell(auraId){
    if(!uLvl('auto_sell_unlock'))return;
    if(!S.autoSellRarities)return;
    const a=AURAS.find(x=>x.id===auraId);if(!a)return;
    if(!S.autoSellRarities[a.rarity])return;
    const entries=S.auras[auraId];if(!entries||!entries.length)return;
    const idx=entries.length-1;
    if(S.equippedAuras.some(e=>e.id===auraId&&e.mod===entries[idx].mod))return;
    let dv=SELL_VAL[a.rarity]||1;
    if(entries[idx].mod){const m=MODIFIERS.find(x=>x.id===entries[idx].mod);if(m)dv*=m.pMult;}
    dv=Math.floor(dv*getEventBonus('sellMult'));
    entries.splice(idx,1);if(!entries.length)delete S.auras[auraId];
    S.dust+=dv;S.totalDust+=dv;
}
function renderAutoSellCheckboxes(){
    const container=document.getElementById('auto-sell-checkboxes');if(!container)return;
    const lock=document.getElementById('auto-sell-lock');
    if(!uLvl('auto_sell_unlock')){container.innerHTML='<span style="font-size:.68rem;color:var(--dim)">🔒 Buy from Shop to unlock</span>';if(lock)lock.textContent='(Locked)';return;}
    if(lock)lock.textContent='(Active)';
    container.innerHTML='';
    const rarities=['common','uncommon','rare','epic','legendary','mythic','divine','cosmic'];
    for(const r of rarities){
        const checked=(S.autoSellRarities&&S.autoSellRarities[r])?'checked':'';
        const color=getRarity(r).color;
        container.innerHTML+=`<label style="font-size:.68rem;display:flex;align-items:center;gap:3px;cursor:pointer"><input type="checkbox" ${checked} onchange="toggleAutoSellRarity('${r}')" style="accent-color:${color}"><span style="color:${color}">${getRarity(r).name}</span></label>`;
    }
}

// === TOWER MILESTONES ===
const TOWER_MILESTONES=[
    {floor:5,reward:{gems:20,enchantStones:1}},
    {floor:10,reward:{gems:50,enchantStones:2}},
    {floor:15,reward:{gems:100,dust:500}},
    {floor:20,reward:{gems:200,enchantStones:3}},
    {floor:25,reward:{gems:300,enchantStones:5}},
    {floor:30,reward:{gems:500,dust:2000}},
    {floor:40,reward:{gems:1000,enchantStones:8}},
    {floor:50,reward:{gems:2000,dust:10000,enchantStones:10}},
    {floor:75,reward:{gems:5000,enchantStones:20}},
    {floor:100,reward:{gems:10000,dust:50000,enchantStones:30}},
    {floor:150,reward:{gems:20000,dust:100000,enchantStones:50}},
    {floor:200,reward:{gems:50000,dust:250000}},
    {floor:300,reward:{gems:100000,dust:500000}},
    {floor:500,reward:{gems:250000,dust:1000000}},
    {floor:1000,reward:{gems:1000000,dust:5000000}},
];

function claimTowerMilestone(floor){
    if(S.towerFloor<=floor)return;
    if(S.towerRewardsClaimed.includes(floor))return;
    const ms=TOWER_MILESTONES.find(m=>m.floor===floor);if(!ms)return;
    S.towerRewardsClaimed.push(floor);
    for(const[r,v]of Object.entries(ms.reward))S[r]=(S[r]||0)+v;
    const rwStr=Object.entries(ms.reward).map(([r,v])=>`+${v} ${r}`).join(', ');
    toast(`Tower F${floor} milestone! ${rwStr}`);
    updateRes();save();
}

// === RENDER NEW SYSTEMS ===
function renderTrade(){
    // Check if needs refresh
    if(!S.tradeStock||!S.tradeStock.length||Date.now()>=S.tradeRefresh)refreshTrade();
    const container=document.getElementById('trade-grid');if(!container)return;
    container.innerHTML='';
    const rem=Math.max(0,Math.ceil((S.tradeRefresh-Date.now())/1000));
    const mins=Math.floor(rem/60),secs=rem%60;
    document.getElementById('trade-timer').textContent=`Refreshes in: ${mins}m ${secs}s`;
    for(let i=0;i<S.tradeStock.length;i++){
        const t=S.tradeStock[i];const a=AURAS.find(x=>x.id===t.aura);if(!a)continue;
        const r=getRarity(a.rarity);const ci=t.currency==='dust'?'✨':'🪙';
        const card=document.createElement('div');card.className=`inv-card rarity-${a.rarity}`;
        card.innerHTML=`<span class="item-icon">${a.icon}</span><div class="item-name">${a.name}</div><div class="item-rarity" style="color:${r.color}">${r.name}</div><div class="item-power">${ci}${fmt(t.cost)}</div>`;
        card.addEventListener('click',()=>buyTrade(i));container.appendChild(card);
    }
}
function renderAscension(){
    const container=document.getElementById('ascension-info');if(!container)return;
    const tier=Math.min(S.ascensions||0,ASCENSION_REQS.length-1);
    const req=ASCENSION_REQS[tier];
    container.innerHTML=`<strong>Ascensions: ${S.ascensions||0}</strong><br>
        Next: ${req.rebirths} Rebirths & ${fmt(req.gems)} Gems<br>
        You: ${S.rebirths} Rebirths, ${fmt(S.gems)} Gems<br><br>
        <em>Ascension resets EVERYTHING (except achievements & ascension level)</em><br>
        <em>Gives: +${ASC_BONUS.luck*100}% Luck, +${ASC_BONUS.power*100}% Power, +${ASC_BONUS.xp*100}% XP, +${ASC_BONUS.gold*100}% Gold per ascension</em>`;
    if(S.ascensions>0){
        container.innerHTML+=`<br><br><div style="color:var(--glow)">Current bonuses: 🍀+${(S.ascensions*ASC_BONUS.luck*100)}% | ⚔️+${(S.ascensions*ASC_BONUS.power*100)}% | 📖+${(S.ascensions*ASC_BONUS.xp*100)}% | 🪙+${(S.ascensions*ASC_BONUS.gold*100)}%</div>`;
    }
}

// === NEW FEATURE RENDERS ===
function renderFusionSelects(){
    const s1=document.getElementById('fusion-aura1');const s2=document.getElementById('fusion-aura2');
    if(!s1||!s2)return;s1.innerHTML='';s2.innerHTML='';
    const owned=Object.keys(S.auras).filter(id=>S.auras[id]&&S.auras[id].length>0);
    for(const id of owned){const a=AURAS.find(x=>x.id===id)||(S.hybrids&&S.hybrids[id]);if(!a)continue;
        const label=`${a.icon} ${a.name}${a.isHybrid?' [HYBRID]':''}`;
        s1.innerHTML+=`<option value="${id}">${label}</option>`;
        s2.innerHTML+=`<option value="${id}">${label}</option>`;
    }
}
function renderGearUpgrades(){
    const grid=document.getElementById('gear-upgrade-grid');if(!grid)return;grid.innerHTML='';
    const owned=Object.keys(S.gear).filter(id=>S.gear[id]>=3);
    if(!owned.length){grid.innerHTML='<span style="font-size:.72rem;color:var(--dim)">Need 3+ of a gear to upgrade</span>';return;}
    for(const gId of owned){
        const g=GEAR.find(x=>x.id===gId);const lvl=S.gearUpgrades[gId]||0;
        if(lvl>=5)continue;
        const btn=document.createElement('button');btn.className='btn-sm';
        btn.textContent=`${g.icon} ${g.name} +${lvl}→+${lvl+1}`;
        btn.addEventListener('click',()=>{upgradeGear(gId);renderGearUpgrades();renderInv();});
        grid.appendChild(btn);
    }
    if(!grid.children.length)grid.innerHTML='<span style="font-size:.72rem;color:var(--dim)">All maxed or need more copies</span>';
}
function renderHallOfFame(){
    const list=document.getElementById('hall-of-fame-list');if(!list)return;list.innerHTML='';
    const hall=S.hallOfFame||[];
    if(!hall.length){list.innerHTML='<div style="text-align:center;color:var(--dim);padding:20px">No legendary+ pulls yet. Keep rolling!</div>';return;}
    for(const entry of hall.slice(0,30)){
        const a=AURAS.find(x=>x.id===entry.auraId);if(!a)continue;
        const r=getRarity(entry.rarity||a.rarity);
        const time=new Date(entry.time).toLocaleString();
        list.innerHTML+=`<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:var(--bg3);border-radius:var(--rs);border-left:3px solid ${r.color}">
            <span>${a.icon} <strong style="color:${r.color}">${a.name}</strong> (${r.name})${entry.mod?' ['+entry.mod+']':''}</span>
            <span style="font-size:.6rem;color:var(--dim)">${time}</span></div>`;
    }
}
function renderCharTitles(){
    const div=document.getElementById('char-titles');if(!div)return;div.innerHTML='';
    const unlocked=S.titlesUnlocked||['newbie'];
    for(const t of TITLES){
        const u=unlocked.includes(t.id);const eq=S.equippedTitle===t.id;
        const el=document.createElement('div');
        el.style.cssText=`padding:4px 8px;border-radius:var(--rs);font-size:.68rem;cursor:${u?'pointer':'default'};border:1px solid ${eq?'var(--legendary)':'var(--border)'};background:${eq?'rgba(245,158,11,.1)':'var(--bg3)'};color:${u?'var(--text)':'var(--dim)'}`;
        el.textContent=u?t.name:'🔒 ???';el.title=t.desc;
        if(u)el.addEventListener('click',()=>{equipTitle(t.id);renderCharTitles();});
        div.appendChild(el);
    }
}
function renderCharMilestones(){
    const div=document.getElementById('char-milestones');if(!div)return;div.innerHTML='';
    const unique=Object.keys(S.auras||{}).length;
    for(const ms of COLLECTION_MILESTONES){
        const claimed=(S.collectionMilestonesClaimed||[]).includes(ms.count);
        const reached=unique>=ms.count;
        div.innerHTML+=`<div style="padding:4px 8px;border-radius:var(--rs);font-size:.65rem;border:1px solid ${claimed?'#10b981':reached?'var(--legendary)':'var(--border)'};color:${claimed?'#10b981':reached?'var(--legendary)':'var(--dim)'}">
            ${ms.label}${claimed?' ✓':` (${unique}/${ms.count})`}</div>`;
    }
}

// === WHEEL RENDER ===
function renderWheel(){
    const wheel=document.getElementById('wheel');if(!wheel)return;
    wheel.innerHTML='';
    const count=WHEEL_PRIZES.length;
    const segAngle=360/count;
    const colors=['#9ca3af','#22c55e','#3b82f6','#a855f7','#f59e0b','#6b7280','#10b981','#06b6d4','#ec4899','#ef4444','#374151'];
    // Build conic-gradient
    let gradient='conic-gradient(';
    for(let i=0;i<count;i++){
        const c=colors[i%colors.length];
        const start=(i/count*100).toFixed(2);
        const end=((i+1)/count*100).toFixed(2);
        gradient+=`${c} ${start}% ${end}%${i<count-1?',':''}`;
    }
    gradient+=')';
    wheel.style.background=gradient;
    // Add text labels
    for(let i=0;i<count;i++){
        const label=document.createElement('div');
        label.className='wheel-label';
        const angle=segAngle*i+segAngle/2-90; // center of segment, offset so 0 is top
        const rad=angle*Math.PI/180;
        const dist=42; // % from center
        const x=Math.cos(rad)*dist;
        const y=Math.sin(rad)*dist;
        label.style.transform=`translate(${x}px,${y}px) rotate(${angle+90}deg)`;
        label.textContent=WHEEL_PRIZES[i].name.split(' ').slice(0,2).join(' ');
        wheel.appendChild(label);
    }
    document.getElementById('wheel-spins').textContent=S.wheelSpins||0;
}

// === PET LEVEL PANEL ===
function renderPetLevelPanel(){
    const grid=document.getElementById('pet-level-grid');if(!grid)return;grid.innerHTML='';
    const owned=Object.keys(S.pets).filter(id=>S.pets[id]>0);
    if(!owned.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:var(--dim);padding:20px">No pets to level. Hatch some eggs!</div>';return;}
    owned.sort((a,b)=>ri(PETS.find(x=>x.id===b)?.rarity||'common')-ri(PETS.find(x=>x.id===a)?.rarity||'common'));
    for(const pid of owned){
        const p=PETS.find(x=>x.id===pid);const r=getRarity(p.rarity);
        const lvl=getPetLevel(pid);const cost=getPetLevelCost(pid);
        const canLevel=S.pets[pid]>cost; // need more than cost (keep at least 1)
        const card=document.createElement('div');card.className=`inv-card rarity-${p.rarity}`;
        card.innerHTML=`<span class="item-icon">${p.icon}</span>
            <div class="item-name">${p.name}</div>
            <div class="item-rarity" style="color:${r.color}">Lv.${lvl} (x${getPetBonusMult(pid).toFixed(2)})</div>
            <div class="item-power">${p.desc}</div>
            <div style="font-size:.6rem;color:var(--dim);margin-top:3px">Owned: ${S.pets[pid]} | Cost: ${cost} dupes</div>
            <button class="btn-sm" style="margin-top:4px;font-size:.6rem" ${canLevel?'':'disabled'}>⬆️ Level Up</button>`;
        card.querySelector('button').addEventListener('click',()=>{levelUpPet(pid);renderPetLevelPanel();});
        grid.appendChild(card);
    }
}
