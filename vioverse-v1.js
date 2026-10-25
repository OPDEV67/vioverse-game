'use strict';
/* Vioverse v1.0 — art-direction pass. Gameplay and stored save schema are unchanged. */
const vvIcons={Home:'⌂',Characters:'♙',Expeditions:'✧',Discoveries:'🦋',Gathering:'🌿',Inventory:'♧',Missions:'▤',Legacy:'☾',Journal:'✎',Gacha:'✦',Shop:'♜','Patch Notes':'📜','Update Game':'↻'};
const vvPages=['Home','Characters','Expeditions','Discoveries','Gathering','Inventory','Missions','Legacy','Journal','Gacha','Shop','Patch Notes','Update Game'];
function vvButton(text,action,disabled=false,extra=''){return `<button type="button" class="vv-button ${extra}" data-action="${action}" ${disabled?'disabled':''}>${text}</button>`}
function vvLink(text,to,extra=''){return `<button type="button" class="vv-button ${extra}" data-page="${to}">${text}</button>`}
function vvHead(kicker,title,subtitle,badge=''){return `<div class="vv-heading"><div><div class="vv-kicker">${kicker}</div><h2>${title}</h2><p>${subtitle}</p></div>${badge?`<span class="vv-area-pill">${badge}</span>`:''}</div>`}
function vvTrack(percent,id='',green=false){return `<div class="vv-track ${green?'green':''}" ${id?`id="${id}"`:''}><div class="fill" style="width:${Math.max(0,Math.min(100,Number(percent)||0))}%"></div></div>`}
function vvStat(label,num){return `<div class="vv-statline"><span>${label}</span><strong>${num}</strong></div>`}
function vvPanel(title,inner,sub=''){return `<section class="vv-panel"><div class="vv-panel-head"><h3>${title}</h3>${sub?`<span class="vv-tag">${sub}</span>`:''}</div>${inner}</section>`}
function vvSection(content){return `<div class="vv-view">${content}</div>`}
function vvLocked(n,i){
 const rarity=['rare','epic','mythic','legendary'][i], desc=['A new companion awaits beneath the silver moon.','Different stories and rare traits will emerge.','More companions will join your forest journey.','Legends awaken beyond the farthest grove.'][i];
 const open=level(s.xp)>=n;
 return `<article class="vv-companion ${rarity}" aria-label="Companion slot ${i+2}"><div class="vv-cardface vv-locked"><span class="vv-locked-symbol">♙</span><h3>Companion ${i+2}</h3><p>${open?'Level requirement reached':'Unlocks at Player Lv. '+n}</p><div class="vv-ornament" style="width:100%;margin:9px 0"><span>✧</span></div><p>${desc}</p><span class="vv-lock-pill">${open?'◇ Companion coming later':'🔒 Locked'}</span></div></article>`;
}
function vvTree(){
 return `<div class="vv-cardface vv-treeface" data-vv-back ${flipped?'':'hidden'}>
 <div class="vv-kicker" style="justify-content:center;margin:11px 0 0">SERAPHINE · WOODCUTTING</div><h3 class="vv-tree-title">✧ The Forest Skill Tree</h3>
 <p class="vv-muted" style="text-align:center;margin:0 0 14px">${s.skill} skill points · ${s.skillSpent}/5 Forest Mastery</p>
 <div class="vv-tree-node"><strong>🌲 Forest Fundamentals</strong><small>A gift of the Whispering Grove</small></div>
 <div class="vv-tree-connect">│<br>✦</div>
 <div class="vv-tree-branch"><div class="vv-tree-node"><strong>⚡ Swift Hands</strong><small>Speed +6% per mastery rank</small></div><div class="vv-tree-node"><strong>🦋 Moon Sight</strong><small>Discovery talents · planned</small></div></div>
 <div class="vv-tree-connect">╲ ✧ ╱</div>
 <div class="vv-tree-node gold"><strong>✦ Forest Mastery</strong><small>Rank ${s.skillSpent} / 5</small><div style="margin-top:10px">${vvButton('Spend skill point','skill',s.skill<1||s.skillSpent>=5)}</div></div>
 <p class="vv-muted" style="text-align:center;margin:10px 0">Permanent upgrades · earns points from Woodcutting levels.</p>
 ${vvButton('↶ Return to portrait','flip',false,'ghost')}</div>`;
}
function vvHeroCard(){
 return `<article class="vv-companion epic" id="vv-seraphine-card" aria-label="Seraphine companion card">
 <div class="vv-cardface" data-vv-front ${flipped?'hidden':''}>
 <div class="vv-card-portrait"><span class="vv-epic-tag">EPIC ✦ ${s.awakened?'AWAKENED I':'FOREST'}</span></div>
 <div class="vv-cardbody"><div class="vv-subtitle">✦ FOREST WHISPERER ✦</div><h3>Seraphine</h3>
 ${vvStat('<span id="char-level">Character Lv. '+level(s.xp)+'</span>','<span id="char-percent">'+Math.floor(pct(s.xp))+'%</span>')}
 ${vvTrack(pct(s.xp),'char-progress')}
 ${vvStat('<span id="prof-level">🌿 Woodcutting Lv. '+level(s.profXp)+'</span>','<span id="prof-percent">'+Math.floor(pct(s.profXp))+'%</span>')}
 ${vvTrack(pct(s.profXp),'prof-progress',true)}
 ${vvStat('Auto gathering','<span id="gather-time">'+s.progress.toFixed(1)+' / '+speed().toFixed(1)+'s</span>')}
 ${vvTrack(s.progress/speed()*100,'gather-progress',true)}
 ${vvButton('✦ View skill tree','flip')}</div>
 </div>
 ${vvTree()}</article>`;
}
function vvHome(){
 const cards=`<div class="vv-card-stage" id="vv-card-scroll"><div class="vv-cards">${vvHeroCard()}${[5,10,15,30].map(vvLocked).join('')}</div></div>`;
 return vvSection(vvHead('The moonlit companions','My Companions','One active companion · five planned slots · swipe to browse','✧ Whispering Grove')+
 cards+
 `<div class="vv-bottom">
 ${vvPanel('✧ Current Area',`<div class="vv-tile-row"><span>🌙 Whispering Grove</span><span class="vv-gold">Lv. 1–10</span></div><p class="vv-muted">An enchanted forest alive with forgotten spirits and silver flowers.</p>${vvLink('Explore the Grove →','Expeditions','ghost')}`)}
 ${vvPanel('🌿 Profession Overview',`<div class="vv-tile-row"><span>🌳 Woodcutting</span><b>Lv. ${level(s.profXp)}</b></div><div class="vv-tile-row"><span>⛏ Mining</span><small>Unlock Lv. 5</small></div><div class="vv-tile-row"><span>🎣 Fishing</span><small>Unlock Lv. 10</small></div>${vvLink('Open Gathering →','Gathering','ghost')}`)}
 ${vvPanel('▤ Journey Objective',`<p class="vv-muted">${nextStep()}</p><div class="vv-actions">${vvLink('View Legacy →','Legacy')}</div>`)}
 ${vvPanel('✦ Quick Actions',`<div style="display:grid;gap:9px">${vvLink('✧ Discoveries','Discoveries')}${vvLink('♙ Characters','Characters','ghost')}${vvLink('✎ Moonveil Journal','Journal','ghost')}</div>`)}
 </div>`);
}
function vvCharacters(){
 return vvSection(vvHead('Companion archive','Characters','Meet your companions, inspect talents, and follow each awakening.','1 active · 5 planned')+
 `<div class="vv-roster"><div class="vv-character-feature"><img src="assets/seraphine.webp" alt="Seraphine, silver-haired Forest Whisperer"><div class="vv-feature-caption"><span class="vv-tag">✦ Epic · Woodcutting</span><h2>Seraphine</h2><p class="vv-muted">The Forest Whisperer · Guardian of the Moonwood</p></div></div>
 <div style="display:grid;gap:15px">
 ${vvPanel('✦ Companion Profile',`<p class="vv-muted">A quiet forest guide bound to the moonlit roots. Seraphine gathers resources automatically while your story unfolds.</p>${vvStat('Character level',level(s.xp))}${vvTrack(pct(s.xp))}${vvStat('Woodcutting', 'Lv. '+level(s.profXp))}${vvTrack(pct(s.profXp),null,true)}${vvStat('Gathering cycle',speed().toFixed(1)+' seconds')}${vvStat('Awakening',s.awakened?'✦ Awakening I':'Not yet awakened')}`,'ACTIVE')}
 ${vvPanel('✧ Branching Talents',`<div class="vv-skill-table"><div class="vv-skill-tile"><span>🌲</span><strong>Forest Fundamentals</strong><p>Gathering basics · learned</p></div><div class="vv-skill-tile"><span>⚡</span><strong>Swift Hands</strong><p>Improves gathering with mastery.</p></div><div class="vv-skill-tile"><span>🦋</span><strong>Moon Sight</strong><p>Future discovery talents.</p></div><div class="vv-skill-tile"><span>✦</span><strong>Forest Mastery</strong><p>Rank ${s.skillSpent}/5 · ${s.skill} points to spend</p></div></div><div class="vv-actions" style="margin-top:15px">${vvButton('Spend 1 skill point','skill',s.skill<1||s.skillSpent>=5)}${vvLink('Awakening path →','Legacy','ghost')}</div>`)}
 </div></div>
 <div class="vv-ornament"><span>✦ COMPANION ROSTER ✦</span></div><div class="vv-grid">${[5,10,15].map((n,i)=>`<div class="vv-panel" style="text-align:center"><span style="font-size:27px;color:${['#9dc2ff','#dea6ff','#ff9bd7'][i]}">✦</span><h3>Companion Slot ${i+2}</h3><p class="vv-muted">Player Lv. ${n} milestone · character recruitment is planned.</p><span class="vv-tag">${level(s.xp)>=n?'Milestone reached':'Locked'}</span></div>`).join('')}</div>`);
}
function vvExpeditions(){
 const ev=activeEvent();
 const choices=ev.choices.map((c,i)=>{const disabled=!!(s.patch02&&((c[1]==='clearroots'&&s.wood<8)||(c[1]==='helpspirit'&&s.wood<5)||(c[1]==='unseal'&&level(s.profXp)<2)));return `<div class="vv-choice"><span>✧ ${escapeText(c[0])}</span>${vvButton('Choose →','choose'+i,disabled)}</div>`}).join('');
 return vvSection(vvHead('The forest never ends','Endless Expeditions','Every choice leaves a trace. No combat, no stamina—only discovery.','✦ '+s.expeditions+' explorations')+
 `<div class="vv-scene"><div class="vv-scene-foreground"><div class="vv-kicker">Whispering Grove</div><h2>${s.restored?'The Grove Remembers':'A Path Beneath the Moon'}</h2><p>${s.restored?'The restored Moonwood shimmers among the ancient trees.':'Every path leads toward a different memory, hidden beneath the violet canopy.'}</p></div></div>
 <div class="vv-columns" style="margin-top:17px">${vvPanel('✧ '+escapeText(ev.title),`<p class="vv-muted">${escapeText(ev.desc)}</p><div class="vv-ornament"><span>CHOOSE YOUR PATH</span></div>${choices}<p class="vv-muted" style="margin:15px 0 0">Your choices can change routes, alliances, and future encounters.</p>`,'LIVE ENCOUNTER')}
 <div style="display:grid;gap:16px">
 ${vvPanel('☾ The World Remembers',`<div class="vv-tile-row"><span>🍃 Silverleaf trail</span><b>${s.moonPath?'Found':'Unknown'}</b></div><div class="vv-tile-row"><span>🕯 Lantern spirit</span><b>${s.spiritHelped?'Ally':'Unknown'}</b></div><div class="vv-tile-row"><span>🌿 Root passage</span><b>${s.rootSeal?'Opened':'Sealed'}</b></div><div class="vv-tile-row"><span>🌙 Forgotten Moonwood</span><b>${s.shrineFound?'Found':'Hidden'}</b></div>`)}
 ${vvPanel('📜 Expedition Chronicle',`<div class="log">${s.log.length?s.log.slice(0,9).map(x=>`<p>${escapeText(x)}</p>`).join(''):'<p class="vv-muted">Your first memory is still waiting to be written.</p>'}</div>`)}
 </div></div>`);
}
function vvDiscoveries(){
 const outcomes=[['Common','Glowing Herb','✿','#b0afc0','A small wonder of the night.'],['Uncommon','Forest Spirit','🐇','#7be0ba','Spirits grow close to kind travelers.'],['Rare','Moonlit Tree','♣','#78a5ff','Hidden boughs hold old magic.'],['Epic','Hidden Cavern','◆','#d69bff','Crystal chambers wait below.'],['Legendary','Ancient Guardian','♛','#f5c389','A legendary protector of the Grove.']];
 return vvSection(vvHead('The world reveals its secrets','Magical Discoveries','Rare encounters, mysterious spirits, and memories that persist in your Journal.','🦋 '+s.discoveryCount+' recorded')+
 `<div class="vv-discovery-main"><div class="vv-discovery-art"><img src="assets/lunar_discovery.webp" alt="The luminous Lunar Butterfly of the Whispering Grove"><div><div class="vv-kicker" style="justify-content:center">✧ Moonveil Discovery</div><h2>A Magical Discovery!</h2><p>The forest reveals its wonders to those who listen.</p></div></div>
 ${vvPanel('☾ Lunar Butterfly',`<div class="vv-tag">✦ Rare spirit encounter</div><h2 style="font-size:25px;margin:15px 0 10px">Wings of Moonlight</h2><p class="vv-muted">A rare spirit appears while Seraphine gathers or explores. Its wings glimmer with the light of the moon.</p><div class="vv-ornament"><span>DISCOVERY RECORD</span></div><div class="vv-loot-grid"><div class="vv-loot"><span class="vv-loot-icon">🦋</span><strong>${s.butterfly} Butterflies</strong><small>Collected</small></div><div class="vv-loot"><span class="vv-loot-icon">✧</span><strong>${s.essence} Essence</strong><small>Current amount</small></div><div class="vv-loot"><span class="vv-loot-icon">✎</span><strong>${s.discoveryCount} Entries</strong><small>Recorded</small></div><div class="vv-loot"><span class="vv-loot-icon">☾</span><strong>Moonwood</strong><small>Legacy</small></div></div><div style="margin-top:18px">${vvLink('Open Discovery Journal →','Journal')}</div>`,'DISCOVERED IN GROVE')}
 </div>
 <div class="vv-ornament"><span>✦ OTHER POSSIBLE DISCOVERIES ✦</span></div>
 <div class="vv-discoveries">${outcomes.map(x=>`<div class="vv-discovery-tile" style="--tile-color:${x[3]}"><div class="vv-artbox">${x[2]}</div><span class="vv-tag">${x[0]}</span><h3>${x[1]}</h3><p>${x[4]}</p></div>`).join('')}</div>
 <div style="margin-top:20px">${vvPanel('📖 Discovery History',`<div class="log">${s.log.filter(x=>/discover|butterfly|Moonlit|Butterfly/i.test(x)).slice(0,12).map(x=>`<p>${escapeText(x)}</p>`).join('')||'<p class="vv-muted">Your journal is awaiting its first magical discovery.</p>'}</div>`)}</div>`);
}
function vvGathering(){
 const profs=[['🌳','Woodcutting',1,level(s.profXp),'Active · automatic'],['⛏','Mining',5,0,'Planned profession'],['🎣','Fishing',10,0,'Planned profession'],['🌿','Herbalism',15,0,'Planned profession']];
 return vvSection(vvHead('Under the forest canopy','Gathering Professions','Your companions gather even while you are away. Up to eight hours of offline progress.','✧ Always gathering')+
 `<div class="vv-scene" style="min-height:240px"><div class="vv-scene-foreground"><h2>Seraphine · Forest Whisperer</h2><p>Moonwood yields to patient hands. Gathering never needs a start button.</p></div></div>
 <div class="vv-grid" style="margin-top:18px">${profs.map((x,i)=>`<div class="vv-panel"><span style="font-size:29px">${x[0]}</span><h3 style="margin:8px 0">${x[1]}</h3><span class="vv-tag">${i===0?'ACTIVE':'MILESTONE LV. '+x[2]}</span><p class="vv-muted">${x[4]}</p>${vvStat('Profession level',i===0?'Lv. '+x[3]:'Not yet implemented')}${vvTrack(i===0?pct(s.profXp):0,null,i===0)}</div>`).join('')}</div>
 ${vvPanel('✧ Gathering Record',`<div class="vv-grid"><div class="vv-mini-metric"><span>🪵</span><div><b>${fmt(s.wood)}</b><small>Moonwood collected</small></div></div><div class="vv-mini-metric"><span>✦</span><div><b>${fmt(s.cycles)}</b><small>Gathering cycles</small></div></div><div class="vv-mini-metric"><span>⚡</span><div><b>${speed().toFixed(1)}s</b><small>Time per cycle</small></div></div></div><p class="vv-muted">Profession levels and bonuses update automatically as Seraphine gathers.</p>`,'LIVE IDLE')}`);
}
function vvInventory(){
 const items=[['🪵','Moonwood',s.wood,'Gathered from trees and expeditions'],['✧','Moon Essence',s.essence,'Earned through magical discoveries'],['🦋','Lunar Butterfly',s.butterfly,'Rare spirit used for Awakening I']];
 return vvSection(vvHead('Treasures of the grove','Inventory','Everything you have earned is stored in your current browser save.','✧ '+items.length+' resource types')+
 `<div class="vv-grid">${items.map(x=>`<div class="vv-panel"><div class="vv-mini-metric"><span>${x[0]}</span><div><b>${fmt(x[2])}</b><small>${x[1]}</small></div></div><p class="vv-muted">${x[3]}</p></div>`).join('')}</div>
 <div class="vv-columns" style="margin-top:17px">${vvPanel('🌙 Crafting & Equipment',`<p class="vv-muted">Equipment, crafting materials, and equipment slots are planned features. Your current resources are ready for Legacy restoration.</p>${vvLink('See Legacy requirements →','Legacy')}`)}${vvPanel('✎ Safekeeping',`<p class="vv-muted">Your inventory and progress are saved automatically in this browser. You can export a backup from the Journal.</p>${vvLink('Open Journal →','Journal','ghost')}`)}</div>`);
}
function vvMissions(){
 const goals=[['Explore the Whispering Grove',s.expeditions>0,'Make your first expedition choice.','Expeditions'],['Find the Forgotten Moonwood',s.shrineFound,'Locate the lost tree.','Expeditions'],['Decode the restoration ritual',s.clue,'Learn the moonlit inscription.','Legacy'],['Awaken Seraphine',s.awakened,'Collect the required resources.','Legacy'],['Restore the Ancient Tree',s.restored,'Bring Moonwood back to life.','Legacy']];
 return vvSection(vvHead('The quest board','Missions & Milestones','Your story goals, remembered choices, and next steps in one place.','✧ '+goals.filter(x=>x[1]).length+'/'+goals.length+' milestones')+
 `<div class="vv-columns">${vvPanel('✦ Story Milestones',goals.map((x,i)=>`<div class="vv-progress-step ${x[1]?'done':''}"><div class="vv-progress-number">${x[1]?'✓':i+1}</div><div style="flex:1"><h3>${x[0]}</h3><p class="vv-muted">${x[2]}</p></div>${vvLink(x[1]?'View':'Go →',x[3],'ghost')}</div>`).join(''))}
 ${vvPanel('☾ The Next Chapter',`<div class="vv-tag">CURRENT OBJECTIVE</div><h3 style="margin-top:13px">${nextStep()}</h3><p class="vv-muted">These are progression milestones, not daily chores. Claimable daily mission rewards are planned for a future release.</p>${vvLink('Explore the Grove →','Expeditions')}`)}</div>`);
}
function vvLegacy(){
 const readyAwake=s.clue&&s.wood>=20&&s.essence>=8&&s.butterfly>=1;const readyRestore=s.awakened&&s.wood>=40&&s.essence>=12;
 const milestones=[['Discover the Forgotten Moonwood','Explore the Grove and discover the forgotten tree.',s.shrineFound],['Learn the ancient restoration ritual','Investigate its hidden inscription.',s.clue],['Seraphine · Awakening I','20 Wood · 8 Essence · 1 Lunar Butterfly. Grants +15% gathering.',s.awakened],['Restore the Ancient Moonwood','40 Wood · 12 Essence. Grants a permanent +10% gathering boost.',s.restored]];
 return vvSection(vvHead('A forest that remembers','The Moonwood Legacy','A permanent story of Seraphine, kindness, and the Ancient Moonwood Tree.','☾ '+milestones.filter(x=>x[2]).length+'/4 chapters')+
 `<div class="vv-scene"><div class="vv-scene-foreground"><div class="vv-kicker">${s.restored?'An awakened world':'An ancient promise'}</div><h2>${s.restored?'Moonwood Reborn':'The Ancient Moonwood'}</h2><p>What was forgotten beneath the roots can bloom again.</p></div></div>
 <div class="vv-columns" style="margin-top:18px">
 ${vvPanel('✧ The Restoration Path',milestones.map((x,i)=>`<div class="vv-progress-step ${x[2]?'done':''}"><div class="vv-progress-number">${x[2]?'✓':i+1}</div><div><h3>${x[0]}</h3><p class="vv-muted">${x[1]}</p></div></div>`).join(''))}
 <div style="display:grid;gap:16px">${vvPanel('✦ Seraphine · Awakening I',`<p class="vv-muted">Awaken the Forest Whisperer and enrich every gathering cycle.</p>${vvStat('Wood',fmt(s.wood)+' / 20')}${vvStat('Essence',fmt(s.essence)+' / 8')}${vvStat('Lunar Butterfly',fmt(s.butterfly)+' / 1')}<div class="vv-actions" style="margin-top:16px">${s.awakened?'<span class="vv-tag">✓ Awakened</span>':vvButton('Awaken Seraphine','awaken',!readyAwake)}</div>`)}
 ${vvPanel('☾ Restore the Moonwood',`<p class="vv-muted">The Grove transforms forever once the Moonwood is reborn.</p>${vvStat('Wood',fmt(s.wood)+' / 40')}${vvStat('Essence',fmt(s.essence)+' / 12')}<div class="vv-actions" style="margin-top:16px">${s.restored?'<span class="vv-tag">✓ Grove restored</span>':vvButton('Restore Ancient Tree','restore',!readyRestore)}</div>`)}
 ${vvPanel('✎ Next Step',`<p class="vv-muted">${nextStep()}</p>${vvLink('Return to Expeditions →','Expeditions','ghost')}`)}
 </div></div>`);
}
function vvJournal(){
 const entries=[['🌲','First Gathering',s.cycles>0,'Seraphine began collecting Moonwood.'],['🦋','Lunar Butterfly',s.discoveryCount>0||s.butterfly>0,'A brilliant spirit in the violet flowers.'],['☾','Forgotten Moonwood',s.shrineFound,'An ancient tree calls from the Grove.'],['📜','Restoration Ritual',s.clue,'Secrets revealed within the inscription.'],['✦','Seraphine Awakening',s.awakened,'A companion embraced her first awakening.'],['🌸','Moonwood Reborn',s.restored,'The forest is restored.'],['🕯','Lantern Spirit',s.spiritHelped,'A new ally remembers your kindness.'],['🍃','Silverleaf Trail',s.moonPath,'A secret path was discovered.']];
 return vvSection(vvHead('An illuminated chronicle','Moonveil Journal','Every discovery and decision becomes a page of your own story.','✎ '+entries.filter(x=>x[2]).length+'/'+entries.length+' entries')+
 `<div class="vv-columns">${vvPanel('✎ Recorded Discoveries',`<div class="vv-books">${entries.map(x=>`<div class="vv-book ${x[2]?'':'locked'}"><div class="vv-book-icon">${x[2]?x[0]:'◇'}</div><div><strong>${x[2]?x[1]:'Undiscovered entry'}</strong><p>${x[2]?x[3]:'Explore and gather to reveal this chapter.'}</p></div></div>`).join('')}</div>`,'THE CODEX')}
 <div style="display:grid;gap:16px">${vvPanel('☾ Recent Memories',`<div class="log">${s.log.length?s.log.slice(0,18).map(x=>`<p>${escapeText(x)}</p>`).join(''):'<p class="vv-muted">Nothing has been written here yet.</p>'}</div>`)}
 ${vvPanel('✧ Save & Restore',`<p class="vv-muted">Progress is saved automatically. Export a backup before experimenting with major patches.</p><div class="vv-actions">${vvButton('↓ Export save','exportsave')}<label class="vv-button ghost" style="cursor:pointer">↑ Import save<input id="save-import" type="file" accept=".json,application/json" hidden></label></div><p class="vv-muted vv-small">Importing a save replaces the current browser progress. Export first.</p>`)}
 </div></div>`);
}
function vvSoon(name,icon,detail){return vvSection(vvHead('On the horizon',name,detail,'✦ In development')+
 `<div class="vv-columns"><div class="vv-scene" style="min-height:400px"><div class="vv-scene-foreground"><div style="font-size:70px;color:#e6adff;text-shadow:0 0 22px #a352ef">${icon}</div><h2>Coming to Vioverse</h2><p>This system isn't playable yet. We won't spend or invent currencies before the feature is ready.</p></div></div>${vvPanel('✦ A Future Chapter',`<p class="vv-muted">${detail}</p><p class="vv-muted">The game currently focuses on Seraphine, idle Woodcutting, memorable Expeditions, Discoveries, and Moonwood restoration.</p>${vvLink('Back to your Companions →','Home')}`)}</div>`);
}
function vvPatches(){
 const p=PATCHES[patchIndex];const status=patchIndex===1&&s.patch02?'Applied':p.status;
 return vvSection(vvHead('Behind the moonlit scenes','Patch Notes','A living record of the updates shaping Vioverse.','v'+BUILD_VERSION+' · Royal Interface')+
 `<div class="vv-columns">${vvPanel('✦ '+p.name,`<div class="vv-tag">${p.version} · ${status}</div><p class="vv-muted" style="margin:18px 0">${p.summary}</p>${p.details.map(x=>`<div class="vv-tile-row"><span>✦ ${x}</span></div>`).join('')}<div class="vv-actions" style="margin-top:20px">${vvButton('← Previous','prevpatch',patchIndex===0,'ghost')}${vvButton('Next →','nextpatch')}${patchIndex===1?vvButton(s.patch02?'✓ Expedition patch active':'Activate Expedition Patch 02','applypatch02',s.patch02):''}</div>`,'ARCHIVE')}
 ${vvPanel('☾ Current Design Release',`<div class="vv-tag">v1.0.0 · MOONLIT ROYAL</div><h3 style="margin:18px 0 8px">A new Vioverse interface</h3><p class="vv-muted">Ornate companion cards, a new Characters tab, redesigned Expeditions, discovery galleries, profession and inventory screens, and a stable card-flip interaction.</p><p class="vv-muted">Save compatibility is maintained, and automatic update checks still run every five seconds.</p>${vvLink('Explore the redesigned home →','Home')}`)}
 </div>`);
}
function vvUpdates(){
 const remote=updateInfo.manifest;
 return vvSection(vvHead('Always growing','Game Updates','The Grove checks for new builds automatically while your browser is open.','Installed v'+BUILD_VERSION)+
 `<div class="vv-columns">${vvPanel('✦ Update Status',`<div class="vv-update-status"><span>✧</span><div><strong>${updateInfo.state==='available'?'New update detected':'Moonlit synchronization'}</strong><p class="vv-muted">${escapeText(updateInfo.message)}</p></div></div>${remote&&updateInfo.state==='available'? `<h3>v${escapeText(remote.version)} — ${escapeText(remote.title||'New update')}</h3><p class="vv-muted">${escapeText(remote.notes||'')}</p>`:''}<div class="vv-actions">${vvButton('↻ Check now','checkupdate',updateInfo.state==='checking')}${updateInfo.state==='available'?vvButton('Install update','installupdate'):''}</div>`,'5-SECOND CHECKS')}
 ${vvPanel('☾ Your Progress Is Safe',`<p class="vv-muted">Game progress is saved in this browser. Keep using the same website address so your save stays available.</p><p class="vv-muted">On your computer, the local server pulls published GitHub changes. On GitHub Pages, updates become available after deployment.</p>${vvLink('Back up your save →','Journal','ghost')}`)}</div>`);
}
function vvRender(){
 const nav=document.getElementById('nav'),main=document.getElementById('main');if(!nav||!main)return;
 const old=document.getElementById('vv-card-scroll');if(old)scrollPos=old.scrollLeft;
 nav.innerHTML=vvPages.map(n=>`<button type="button" data-page="${n}" class="${page===n?'active':''}" ${page===n?'aria-current="page"':''}><span class="vv-nav-icon" aria-hidden="true">${vvIcons[n]}</span><span class="vv-nav-label">${n}</span></button>`).join('');
 const screens={Home:vvHome,Characters:vvCharacters,Expeditions:vvExpeditions,Discoveries:vvDiscoveries,Gathering:vvGathering,Inventory:vvInventory,Missions:vvMissions,Legacy:vvLegacy,Journal:vvJournal,Gacha:()=>vvSoon('Spirit Gacha','✦','New companion summoning and banners will arrive in a later update.'),Shop:()=>vvSoon('Moonlit Shop','♜','Decorations and optional convenience purchases are not implemented yet.'),'Patch Notes':vvPatches,'Update Game':vvUpdates};
 main.innerHTML=(screens[page]||vvHome)();
 if(page==='Home'){const sc=document.getElementById('vv-card-scroll');if(sc)sc.scrollLeft=scrollPos}
 document.getElementById('wood').textContent=fmt(s.wood);document.getElementById('essence').textContent=fmt(s.essence);document.getElementById('butterfly').textContent=fmt(s.butterfly);document.getElementById('level').textContent=level(s.xp);
 const rank=document.getElementById('vv-level-caption');if(rank)rank.textContent='Lv. '+level(s.xp);
 const xp=document.querySelector('.vv-level-track i');if(xp)xp.style.width=pct(s.xp)+'%';
}
/* The original flip handler rerendered the whole page; stop it before its bubbling listener.
   Toggle only visibility of two mounted card faces. No animation, no scrollbar reset, no flashing. */
document.addEventListener('click',event=>{
 const target=event.target.closest('[data-action="flip"]');if(!target)return;
 const card=target.closest('#vv-seraphine-card');if(!card)return;
 event.preventDefault();event.stopImmediatePropagation();flipped=!flipped;
 const front=card.querySelector('[data-vv-front]'),back=card.querySelector('[data-vv-back]');
 if(front&&back){front.hidden=flipped;back.hidden=!flipped}
},true);
/* Keep background render stable during idle ticks and maintain header level display. */
const vvOriginalStats=refreshLiveStats;
refreshLiveStats=function(){vvOriginalStats();const rank=document.getElementById('vv-level-caption');if(rank)rank.textContent='Lv. '+level(s.xp);const xp=document.querySelector('.vv-level-track i');if(xp)xp.style.width=pct(s.xp)+'%'};
render=vvRender;render();
