/* Vioverse 1.1 — Full-screen interactive skill constellation */
(function vv2Setup(){
  'use strict';
  const NODES=[
    {id:'foundation',name:'Forest Fundamentals',icon:'leaf',x:50,y:12,
     summary:'The first promise between Seraphine and the Whispering Grove.',
     story:'This foundation is learned from the beginning. It opens the Forest skill tree and connects Seraphine to the Moonwood.',
     category:'Foundation'},
    {id:'swift',name:'Swift Hands',icon:'flash',x:27,y:30,
     summary:'The practical gathering branch of the Forest Whisperer.',
     story:'Swift Hands mirrors the bonus granted by Forest Mastery. Each invested Mastery rank strengthens gathering efficiency by six percentage points of the speed multiplier.',
     category:'Growth path'},
    {id:'moon',name:'Moon Sight',icon:'moon',x:73,y:30,
     summary:'Sense rare discoveries hidden in moonlit places.',
     story:'A future discovery talent branch. Its abilities and upgrade costs are not playable yet.',
     category:'Discovery path'},
    {id:'nature',name:"Nature's Gift",icon:'leaf',x:13,y:52,
     summary:'An untouched path of resource refinement.',
     story:'Nature’s Gift is reserved for future gathering talents. It currently grants no bonuses and cannot consume skill points.',
     category:'Future growth'},
    {id:'lunar',name:'Lunar Blessing',icon:'butterfly',x:87,y:52,
     summary:'Draw closer to the spirits of the moon.',
     story:'A future magical discovery branch inspired by the Lunar Butterfly. It is visible as a preview only.',
     category:'Future discovery'},
    {id:'spirit',name:'Spirit Bond',icon:'moon',x:28,y:72,
     summary:'Strengthen the bond between Seraphine and forest spirits.',
     story:'A future companion-and-spirit path. It is not yet a purchasable skill.',
     category:'Future connection'},
    {id:'roots',name:'Deep Roots',icon:'crystal',x:72,y:72,
     summary:'Ancient roots remember the choices made in the Grove.',
     story:'A future branch tied to Moonwood restoration and deeper expeditions. The complete talent will arrive in a later update.',
     category:'Future legacy'},
    {id:'mastery',name:'Forest Mastery',icon:'crystal',x:50,y:88,
     summary:'Spend Woodcutting skill points to gather more efficiently.',
     story:'Forest Mastery is the currently playable upgrade. Every rank adds +6% to Seraphine’s gathering speed multiplier, up to rank five.',
     category:'Playable mastery'}
  ];
  let selected='mastery';
  let lastSignature='';
  const state={
    foundation:()=> 'learned',
    swift:()=> s.skillSpent>0?'learned':'active',
    moon:()=> 'planned',
    nature:()=> 'planned',
    lunar:()=> 'planned',
    spirit:()=> 'planned',
    roots:()=> s.awakened?'planned':'locked',
    mastery:()=> s.skillSpent>=5?'maxed':'active'
  };
  const speedAt=rank=>8/(1+.35+rank*.06+(s.awakened?.15:0)+(s.restored?.1:0));
  const escapeValue=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function badge(label,value){return `<div class="vv2-stat"><span>${label}</span><strong>${value}</strong></div>`}
  function btn(label,action,extra=''){return `<button class="vv2-cta ${extra}" type="button" data-vv2-action="${action}">${label}</button>`}
  function nodeGlyph(item){return vvSkillGlyph(item.icon)}
  function mapSvg(){
    const paths=[
      'M350 95 Q240 107 189 210','M350 95 Q460 107 511 210',
      'M189 210 Q124 266 91 364','M511 210 Q576 266 609 364',
      'M189 210 Q251 265 350 350','M511 210 Q449 265 350 350',
      'M91 364 Q115 450 196 504','M609 364 Q585 450 504 504',
      'M196 504 Q259 580 350 616','M504 504 Q441 580 350 616',
      'M350 350 Q350 481 350 616'
    ];
    const stars=[[350,36],[350,670],[34,350],[670,350],[120,120],[580,120],[110,582],[590,582],[226,93],[484,93],[226,610],[484,610]];
    return `<svg class="vv2-connectors" viewBox="0 0 700 700" role="presentation" aria-hidden="true">
      <defs>
        <linearGradient id="vv2Branch" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#975cff"/><stop offset=".45" stop-color="#f4c9ff"/><stop offset="1" stop-color="#b962ff"/>
        </linearGradient>
      </defs>
      <circle class="ring" cx="350" cy="350" r="310"/>
      <circle class="ring thin" cx="350" cy="350" r="274"/>
      <circle class="ring thin" cx="350" cy="350" r="226"/>
      ${paths.map(d=>`<path class="arc" d="${d}"/>`).join('')}
      ${stars.map(([x,y])=>`<path class="spark" d="M${x} ${y-7}L${x+5} ${y}L${x} ${y+7}L${x-5} ${y}Z"/>`).join('')}
      ${[[350,95],[189,210],[511,210],[91,364],[609,364],[196,504],[504,504],[350,616]].map(([x,y])=>`<path class="crystal" d="M${x} ${y-13}l7 13-7 13-7-13Z"/>`).join('')}
    </svg>`;
  }
  function renderNodes(){
    return NODES.map(n=>{
      const st=state[n.id]();
      const short=n.id==='mastery'?'MASTER '+s.skillSpent+'/5':n.name;
      const lock=st==='planned'||st==='locked'?'<span class="vv2-lock" aria-hidden="true">🔒</span>':'';
      return `<button class="vv2-node ${st}" type="button" data-vv2-node="${n.id}"
        data-short="${short}" style="--x:${n.x}%;--y:${n.y}%"
        title="${n.name}" aria-label="${n.name} — ${st==='planned'?'future talent':st}"
        aria-pressed="${selected===n.id?'true':'false'}" aria-controls="vv2-inspector">
        ${nodeGlyph(n)}${lock}
      </button>`;
    }).join('');
  }
  function inspector(){
    const n=NODES.find(n=>n.id===selected)||NODES[7];
    const st=state[n.id]();
    const playable=n.id==='mastery';
    const isFoundation=n.id==='foundation';
    const swift=n.id==='swift';
    const maxed=s.skillSpent>=5;
    const nextSpeed=maxed?speedAt(5):speedAt(s.skillSpent+1);
    const status=playable?(maxed?'MAX RANK':'UPGRADE AVAILABLE'):
      isFoundation?'LEARNED':swift?(s.skillSpent>0?'PASSIVE ACTIVE':'TIED TO MASTERY'):'FUTURE TALENT';
    let rows='';
    if(playable){
      rows=badge('Current rank',`${s.skillSpent} / 5`)+
        badge('Current gathering time',speed().toFixed(2)+' sec')+
        badge('Current Mastery efficiency','+'+(s.skillSpent*6)+'%')+
        (maxed?`<p class="vv2-note">Forest Mastery is at maximum rank. Your invested skill points remain saved.</p>`:
          `<h4 class="vv2-h4">NEXT RANK PREVIEW</h4>
           <div class="vv2-perk"><span>Gathering speed multiplier</span><strong>+${(s.skillSpent+1)*6}%</strong></div>
           <div class="vv2-perk"><span>Estimated gathering cycle</span><strong>${nextSpeed.toFixed(2)}s</strong></div>
           <h4 class="vv2-h4">REQUIREMENTS</h4>
           <div class="vv2-requirement ${s.skill<1?'no':''}"><span>✧ Skill points</span>
           <strong>${s.skill} / 1 ${s.skill>=1?'✓':'· Need 1'}</strong></div>`);
    }else if(isFoundation){
      rows=`<div class="vv2-perk"><span>Skill tree access</span><strong>Unlocked ✓</strong></div>
       <div class="vv2-perk"><span>Cost</span><strong>Free</strong></div>`;
    }else if(swift){
      rows=`<div class="vv2-perk"><span>Linked Mastery rank</span><strong>${s.skillSpent} / 5</strong></div>
       <div class="vv2-perk"><span>Efficiency from Mastery</span><strong>+${s.skillSpent*6}%</strong></div>
       <p class="vv2-note">Swift Hands uses the existing Forest Mastery bonus. It does not cost a second skill point.</p>`;
    }else{
      rows=`<div class="vv2-perk"><span>Skill availability</span><strong>Not yet playable</strong></div>
       <p class="vv2-note">This branch is a design preview. No currency or skill points can be spent on it yet.</p>`;
    }
    const action=playable?(maxed?`<button type="button" class="vv2-cta" disabled>✦ Maximum Rank Reached</button>`:
      `<button type="button" class="vv2-cta" data-vv2-action="upgrade" ${s.skill<1?'disabled':''}>✦ Upgrade Forest Mastery</button>`):
       `<button type="button" class="vv2-cta alt" data-vv2-action="${swift?'select-mastery':'back-tree'}">${swift?'View Forest Mastery →':'✦ Explore the constellation'}</button>`;
    return `<div class="vv2-selection">
      <div class="vv2-selection-glyph">${nodeGlyph(n)}</div>
      <div class="vv2-selection-name"><h3>${escapeValue(n.name)}</h3><span class="vv2-chip">${status}</span></div>
    </div>
    <p class="vv2-details-text">${escapeValue(n.story)}</p>
    <div class="vv2-divider"></div>
    <h4 class="vv2-h4">CURRENT PATH</h4>${rows}
    <div class="vv2-details-buttons">${action}
      <button class="vv2-cta alt" type="button" data-page="Legacy">☾ View Moonwood Legacy</button>
    </div>`;
  }
  function layout(){
    return `<section class="vv2-root" id="vv2-skill-page">
      <div class="vv2-head">
        <div><div class="vv2-eyebrow">Moonwood Constellation</div>
        <h2>The Forest Skill Tree</h2>
        <p>Seraphine · Forest Whisperer · Permanent Woodcutting Mastery</p></div>
        <div class="vv2-points"><span aria-hidden="true">✧</span><div><strong data-vv2-points>${s.skill}</strong>
        <small> skill points available</small></div></div>
      </div>
      <div class="vv2-layout">
        <aside class="vv2-side left" aria-label="Companion profile">
          <div class="vv2-surface vv2-portrait">
            <img src="assets/seraphine.webp" alt="Seraphine the Forest Whisperer">
            <div class="vv2-portrait-dim"></div>
            <div class="vv2-portrait-top"><span class="vv2-rarity">EPIC ✦ FOREST</span><span class="ornament">✧</span></div>
            <div class="vv2-portrait-caption"><h3>Seraphine</h3><p>Forest Whisperer</p>
              <div class="vv2-level-label"><span>Character Lv. <b data-vv2-charlevel>${level(s.xp)}</b></span>
              <span data-vv2-charpct>${Math.floor(pct(s.xp))}%</span></div>
              <div class="vv2-progress"><i id="vv2-charbar" style="width:${pct(s.xp)}%"></i></div>
            </div>
          </div>
          <div class="vv2-surface vv2-panel">
            <h3>✧ Companion Overview</h3>
            ${badge('🌿 Woodcutting','Lv. <span data-vv2-proflevel>'+level(s.profXp)+'</span>')}
            <div class="vv2-progress" style="margin:7px 0 9px"><i id="vv2-profbar" style="width:${pct(s.profXp)}%"></i></div>
            ${badge('✧ Available skill points','<span data-vv2-points>'+s.skill+'</span>')}
            ${badge('✦ Forest Mastery','Rank <span data-vv2-rank>'+s.skillSpent+'</span> / 5')}
            ${badge('⚡ Gathering time','<span data-vv2-speed>'+speed().toFixed(2)+'</span>s')}
            ${badge('☾ Awakening',s.awakened?'<span class="vv2-active">Awakening I</span>':'Awaiting Moonwood')}
            <p class="vv2-aside-note">The Forest remembers the path you choose. Skill upgrades are saved in this browser.</p>
            <div class="vv2-divider"></div>
            <button type="button" class="vv2-cta alt" data-page="Characters">← Back to Characters</button>
          </div>
        </aside>
        <div class="vv2-center">
          <div class="vv2-map-border">
            <div class="vv2-map-title"><span>✦</span><strong>THE LIVING CONSTELLATION</strong><span>✦</span></div>
            <div class="vv2-stage-scroll">
              <div class="vv2-map" id="vv2-constellation" aria-label="Interactive Forest Skill Tree">
                ${mapSvg()}
                <div class="vv2-core"><img src="assets/seraphine.webp" alt="" aria-hidden="true"></div>
                ${renderNodes()}
              </div>
            </div>
            <div class="vv2-map-foot"><b>✧ Four paths · One whispering forest</b>
              <div class="vv2-legend"><span><i style="--c:#75dcb6"></i> Learned</span>
              <span><i style="--c:#ebc486"></i> Active</span>
              <span><i style="--c:#936caf"></i> Planned</span></div>
            </div>
          </div>
          <div class="vv2-subnav" aria-label="Select a skill">
            ${['foundation','swift','moon','mastery'].map(id=>{
              const n=NODES.find(q=>q.id===id);
              return `<button class="vv2-navbtn" type="button" data-vv2-node="${id}" aria-pressed="${selected===id?'true':'false'}">${id==='mastery'?'✦':id==='moon'?'☾':'❖'} ${n.name}</button>`;
            }).join('')}
          </div>
        </div>
        <aside class="vv2-side right" aria-label="Selected skill details">
          <div class="vv2-surface vv2-panel">
            <h3>✦ Selected Skill</h3>
            <div id="vv2-inspector" aria-live="polite">${inspector()}</div>
          </div>
          <div class="vv2-surface vv2-panel">
            <h3>☾ The Grove Remembers</h3>
            <p class="vv2-lore">“Every tree has a story. We simply need to listen.”</p>
            <div class="vv2-divider"></div>
            ${badge('Awakening I',s.awakened?'Unlocked ✓':'Requires Legacy')}
            ${badge('Woodcutting level','<span data-vv2-proflevel>'+level(s.profXp)+'</span>')}
            <div class="vv2-details-buttons">
              <button type="button" class="vv2-cta alt" data-vv2-action="reset" ${s.skillSpent<=0?'disabled':''}>↶ Reset Forest Mastery</button>
            </div>
            <p class="vv2-help">Reset refunds spent Forest Mastery points. You’ll be asked to confirm; no other progress is removed.</p>
          </div>
        </aside>
      </div>
      <div class="vv2-footer">
        <p>✧ Forest Mastery is playable today. Other branches preview future additions, and never spend your points.</p>
        <div class="vv2-footer-actions">
          <button type="button" class="vv2-cta alt" data-page="Characters">← Characters</button>
          <button type="button" class="vv2-cta" data-page="Legacy">☾ Moonwood Legacy →</button>
        </div>
      </div>
    </section>`;
  }
  function navRender(){
    const nav=document.getElementById('nav');
    nav.innerHTML=vvPages.map(n=>`<button type="button" data-page="${n}" class="${page===n?'active':''}"
      ${page===n?'aria-current="page"':''}><span class="vv-nav-icon" aria-hidden="true">${vvIcons[n]}</span>
      <span class="vv-nav-label">${n}</span></button>`).join('');
  }
  function renderPage(){
    navRender();
    const main=document.getElementById('main');
    main.innerHTML=layout();
    document.getElementById('wood').textContent=fmt(s.wood);
    document.getElementById('essence').textContent=fmt(s.essence);
    document.getElementById('butterfly').textContent=fmt(s.butterfly);
    document.getElementById('level').textContent=level(s.xp);
    const rank=document.getElementById('vv-level-caption');
    if(rank)rank.textContent='Lv. '+level(s.xp);
    const xp=document.querySelector('.vv-level-track i');
    if(xp)xp.style.width=pct(s.xp)+'%';
    lastSignature='';
    sync();
  }
  function setText(selector,value){
    document.querySelectorAll(selector).forEach(el=>{
      const t=String(value);
      if(el.textContent!==t)el.textContent=t;
    });
  }
  function sync(){
    if(page!=='Skill Tree')return;
    setText('[data-vv2-points]',s.skill);
    setText('[data-vv2-rank]',s.skillSpent);
    setText('[data-vv2-speed]',speed().toFixed(2));
    setText('[data-vv2-proflevel]',level(s.profXp));
    setText('[data-vv2-charlevel]',level(s.xp));
    setText('[data-vv2-charpct]',Math.floor(pct(s.xp))+'%');
    for(const [id,p] of [['vv2-charbar',pct(s.xp)],['vv2-profbar',pct(s.profXp)]]){
      const bar=document.getElementById(id);
      if(bar)bar.style.width=Math.max(0,Math.min(100,p))+'%';
    }
    NODES.forEach(n=>{
      const st=state[n.id]();
      document.querySelectorAll(`[data-vv2-node="${n.id}"]`).forEach(el=>{
        if(el.classList.contains('vv2-node')){
          el.className='vv2-node '+st;
          if(n.id==='mastery')el.setAttribute('data-short','MASTER '+s.skillSpent+'/5');
          el.setAttribute('aria-pressed',selected===n.id?'true':'false');
        }else{
          el.setAttribute('aria-pressed',selected===n.id?'true':'false');
        }
      });
    });
    const reset=document.querySelector('[data-vv2-action="reset"]');
    if(reset)reset.disabled=s.skillSpent<=0;
    const signature=[selected,s.skill,s.skillSpent,s.awakened,s.restored,level(s.profXp)].join('|');
    if(signature!==lastSignature){
      const el=document.getElementById('vv2-inspector');
      if(el)el.innerHTML=inspector();
      lastSignature=signature;
    }
  }
  function selectNode(id){
    if(!NODES.some(n=>n.id===id))return;
    selected=id;
    lastSignature='';
    sync();
    if(window.matchMedia && window.matchMedia('(max-width: 840px)').matches){
      const inspect=document.getElementById('vv2-inspector');
      if(inspect)inspect.scrollIntoView({block:'nearest',behavior:'smooth'});
    }
  }
  function upgrade(){
    if(s.skill<1||s.skillSpent>=5)return;
    s.skill--;
    s.skillSpent++;
    save();
    toast('✦ Forest Mastery improved · rank '+s.skillSpent+'/5');
    selected='mastery';
    lastSignature='';
    sync();
  }
  function resetMastery(){
    if(s.skillSpent<=0)return;
    if(!window.confirm('Refund '+s.skillSpent+' invested Forest Mastery points? Your character, resources, and other progress will stay intact.'))return;
    const refund=s.skillSpent;
    s.skill+=refund;
    s.skillSpent=0;
    save();
    toast('✦ '+refund+' Forest Mastery points refunded');
    selected='mastery';
    lastSignature='';
    sync();
  }
  // Turn the character-card action into a real page transition.
  const originalHero=vvHeroCard;
  vvHeroCard=function(){
    return originalHero().replace('data-action="flip"','data-page="Skill Tree"')
      .replace('✦ View skill tree','✦ Open Skill Tree');
  };
  const baseCharacters=typeof vvBaseCharacters==='function'?vvBaseCharacters:vvCharacters;
  vvCharacters=function(){
    const original=baseCharacters();
    const i=original.lastIndexOf('</div>');
    const action=`<div class="vv-panel" style="margin-top:17px;text-align:center">
      <div class="vv-kicker" style="justify-content:center">MOONWOOD CONSTELLATION</div>
      <h3>The Forest Skill Tree</h3>
      <p class="vv-muted">Open Seraphine’s interactive skill constellation, choose a node, and spend Forest Mastery points.</p>
      <div class="vv-actions" style="justify-content:center"><button class="vv-button" data-page="Skill Tree">✦ Open Full Skill Tree →</button></div>
    </div>`;
    return i>=0?original.slice(0,i)+action+original.slice(i):original+action;
  };
  if(!vvPages.includes('Skill Tree'))vvPages.splice(vvPages.indexOf('Characters')+1,0,'Skill Tree');
  vvIcons['Skill Tree']='✧';
  const previousRender=render;
  render=function(){
    if(page==='Skill Tree'){renderPage();return;}
    previousRender();
  };
  const previousRefresh=refreshLiveStats;
  refreshLiveStats=function(){
    previousRefresh();
    if(page==='Skill Tree')sync();
  };
  document.addEventListener('click',function(event){
    const el=event.target.closest('[data-vv2-node],[data-vv2-action]');
    if(!el)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if(el.dataset.vv2Node)selectNode(el.dataset.vv2Node);
    else if(el.dataset.vv2Action==='upgrade')upgrade();
    else if(el.dataset.vv2Action==='reset')resetMastery();
    else if(el.dataset.vv2Action==='select-mastery')selectNode('mastery');
    else if(el.dataset.vv2Action==='back-tree')selectNode('mastery');
  },true);
  render();
})();
