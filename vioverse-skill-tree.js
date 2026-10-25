'use strict';
/* Moonwood Skill Tree v1.0.1 — new visuals on the mounted card face, and a full tree on Characters. */
function vvSkillGlyph(kind){
 const path={
 leaf:'<path class="glyph-main" d="M9 39C10 17 28 7 42 6c1 16-12 32-29 33M12 37c10-11 15-17 26-25M22 21l-3-7M27 16l8 3M17 29l11 2"/>',
 flash:'<path class="glyph-fill" d="M27 3 10 27h13l-3 18 19-27H26z"/><path class="glyph-main" d="m27 8-11 16h10l-3 13"/>',
 butterfly:'<path class="glyph-main" d="M24 23C8 6 2 13 5 25c2 9 11 8 19-2m0 0c16-17 22-10 19 2-2 9-11 8-19-2M24 24C13 38 18 43 24 33c6 10 11 5 0-9M24 13v22m-3-25-3-4m9 4 3-4"/><path class="glyph-fill" d="m15 20 3-4 4 5zM33 20l-3-4-4 5z"/>',
 crystal:'<path class="glyph-fill" d="m24 3 15 13-4 21-11 8-11-8-4-21z"/><path class="glyph-main" d="m24 3-6 13 6 29 6-29-6-13M9 16h30M13 37l11 8 11-8"/>',
 moon:'<path class="glyph-main" d="M31 5A19 19 0 1 0 43 32 18 18 0 0 1 31 5z"/><path class="glyph-main" d="m36 14 2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>'
 }[kind]||'';
 return `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">${path}</svg>`;
}
function vvSkillNode(title,description,kind,state,extras=''){
 return `<div class="vv-skill-node state-${state}">
  <div class="vv-skill-glyph">${vvSkillGlyph(kind)}</div>
  <div class="vv-skill-info"><h4>${title}</h4><p>${description}</p>${extras}</div>
 </div>`;
}
function vvTree(){
 const root=vvSkillNode('Forest Fundamentals','The Grove welcomed you.','leaf','complete','<span class="vv-skill-status done">✦ Learned</span>');
 const quick=vvSkillNode('Swift Hands','Gathering mastery · <span data-vv-rank>'+s.skillSpent+'</span> / 5','flash',s.skillSpent>0?'complete':'available','<span class="vv-skill-status gold">Growth path</span>');
 const sight=vvSkillNode('Moon Sight','Future discovery talents','butterfly','planned','<span class="vv-skill-status planned">✧ Coming later</span>');
 const mastery=vvSkillNode('Forest Mastery','Strengthen Seraphine’s gathering speed.','crystal','available',
 `<span class="vv-skill-status gold">Rank <span data-vv-rank>${s.skillSpent}</span> / 5</span>
 <div class="vv-skill-action">${vvButton('✦ Spend 1 point','skill',s.skill<1||s.skillSpent>=5)}</div>`);
 return `<div class="vv-cardface vv-treeface vv-tree-v2" data-vv-back ${flipped?'':'hidden'}>
 <div class="vv-tree-header"><div class="vv-kicker" style="justify-content:center">SERAPHINE · EPIC</div><h3>✧ Moonwood Skill Tree</h3><p>Available: <strong class="vv-skill-points-pulse"><span data-vv-points>${s.skill}</span> points</strong></p></div>
 ${root}<div class="vv-skill-connect"></div><div class="vv-skill-split">${quick}${sight}</div>
 <div class="vv-skill-join"></div><div class="vv-skill-master">${mastery}</div>
 <div class="vv-tree-actions"><button class="vv-button" data-action="skilldetails">✧ Expand Skill Tree</button>${vvButton('↶ Back to portrait','flip',false,'ghost')}</div></div>`;
}
function vvFullTree(){
 const efficiency=Math.round((8/speed()-1)*100);
 const root=vvSkillNode('Forest Fundamentals','The first promise between Seraphine and the Whispering Grove.','leaf','complete','<span class="vv-skill-status done">✦ Learned · Foundation</span>');
 const quick=vvSkillNode('Swift Hands','Forest Mastery grants 6% faster gathering per rank.','flash',s.skillSpent>0?'complete':'available',
 `<span class="vv-skill-status gold">✧ Mastery rank <span data-vv-rank>${s.skillSpent}</span> / 5</span>`);
 const sight=vvSkillNode('Moon Sight','A future branch to strengthen rare magical discoveries.','butterfly','planned','<span class="vv-skill-status planned">◇ Planned ability</span>');
 const mastery=vvSkillNode('Forest Mastery','Invest skill points earned through Woodcutting levels.','crystal','available',
 `<span class="vv-skill-status gold">Rank <span data-vv-rank>${s.skillSpent}</span> / 5 · Speed bonus +<span data-vv-boost>${s.skillSpent*6}</span>%</span>
 <div style="max-width:280px;margin:10px 0">${vvTrack(s.skillSpent/5*100,'vv-skill-progress')}</div>
 <div class="vv-skill-action">${vvButton('✦ Upgrade Forest Mastery','skill',s.skill<1||s.skillSpent>=5)}</div>`);
 const awakening=vvSkillNode(s.awakened?'Awakening I · Unlocked':'Awakening I · Sealed',
  'The Moonwood remembers the one who restored its heart.','moon',s.awakened?'awakened':'planned',
  `<span class="vv-skill-status ${s.awakened?'done':'planned'}">${s.awakened?'✦ Awakened':'◇ Complete the Legacy to awaken'}</span>`);
 return `<section id="vv-skill-tree" style="scroll-margin-top:24px;margin-top:23px">
 ${vvHead('Moonwood constellation','The Forest Skill Tree','An ornate record of Seraphine’s talents, progress, and future paths.','✦ <span data-vv-points>'+s.skill+'</span> points available')}
 <div class="vv-skill-layout">
 <aside class="vv-skill-aside">
 <div class="vv-skill-portrait" aria-label="Seraphine"></div>
 ${vvPanel('✦ Seraphine · Epic',`<p class="vv-skill-lore">The Forest Whisperer draws power from the roots of the Ancient Moonwood. Every Woodcutting level can strengthen her gathering mastery.</p>
 ${vvStat('Woodcutting','Lv. '+level(s.profXp))}
 ${vvTrack(pct(s.profXp),null,true)}
 ${vvStat('Unspent points','<strong data-vv-points>'+s.skill+'</strong>')}
 ${vvStat('Current gathering cycle','<span data-vv-speed>'+speed().toFixed(1)+'</span>s')}
 ${vvStat('Total efficiency','<span data-vv-efficiency>'+efficiency+'</span>%')}
 <div class="vv-actions" style="margin-top:16px">${vvLink('✧ Back to Characters','Characters','ghost')}</div>`)}
 </aside>
 <div class="vv-skill-map"><div class="vv-skill-map-inner">
 <div class="vv-skill-map-head"><div class="vv-kicker">FOREST WHISPERER · WOODCUTTING</div><h3>Paths of the Ancient Grove</h3><p>Follow the moonlit branches and awaken the talents waiting within the Moonwood.</p>
 <div class="vv-skill-resources"><span class="vv-tag">✧ <strong data-vv-points>${s.skill}</strong> skill points</span><span class="vv-tag">✦ Mastery <strong data-vv-rank>${s.skillSpent}</strong> / 5</span></div></div>
 <div class="vv-skill-nodes">
 <div style="max-width:520px;margin:auto">${root}</div>
 <div class="vv-skill-connect"></div><div class="vv-skill-split">${quick}${sight}</div>
 <div class="vv-skill-join"></div><div class="vv-skill-master">${mastery}</div>
 <div class="vv-skill-connect"></div><div style="max-width:520px;margin:auto">${awakening}</div>
 </div>
 <div class="vv-skill-footer"><small>✦ Forest Mastery is playable now. Moon Sight is planned; Awakening I is unlocked through Legacy progression.</small>${vvLink('View Moonwood Legacy →','Legacy','ghost')}</div>
 </div></div></div></section>`;
}
const vvBaseCharacters=vvCharacters;
vvCharacters=function(){
 const base=vvBaseCharacters();
 const last=base.lastIndexOf('</div>');
 if(last<0)return base+vvFullTree();
 return base.slice(0,last)+vvFullTree()+base.slice(last);
};
/* Navigate to the full skill tree without running the old card flip handler. */
document.addEventListener('click',event=>{
 const target=event.target.closest('[data-action="skilldetails"]');
 if(!target)return;
 event.preventDefault();event.stopImmediatePropagation();
 page='Characters';flipped=false;render();
 const section=document.getElementById('vv-skill-tree');if(section)section.scrollIntoView({block:'start',behavior:'instant'});
},true);
/* Upgrade the skill tree in-place: preserve DOM, card scroll, scroll position and focus. */
document.addEventListener('click',event=>{
 const target=event.target.closest('[data-action="skill"]');
 if(!target||!target.closest('.vv-tree-v2,.vv-skill-map'))return;
 event.preventDefault();event.stopImmediatePropagation();
 if(s.skill<1||s.skillSpent>=5)return;
 s.skill--;s.skillSpent++;save();toast('✦ Forest Mastery improved · rank '+s.skillSpent+'/5');
 document.querySelectorAll('[data-vv-points]').forEach(node=>node.textContent=s.skill);
 document.querySelectorAll('[data-vv-rank]').forEach(node=>node.textContent=s.skillSpent);
 document.querySelectorAll('[data-vv-boost]').forEach(node=>node.textContent=s.skillSpent*6);
 document.querySelectorAll('[data-vv-speed]').forEach(node=>node.textContent=speed().toFixed(1));
 document.querySelectorAll('[data-vv-efficiency]').forEach(node=>node.textContent=Math.round((8/speed()-1)*100));
 const bar=document.querySelector('#vv-skill-progress .fill');if(bar)bar.style.width=(s.skillSpent/5*100)+'%';
 document.querySelectorAll('.vv-tree-v2 [data-action="skill"],.vv-skill-map [data-action="skill"]').forEach(btn=>{btn.disabled=s.skill<1||s.skillSpent>=5});
 refreshLiveStats();
},true);
render();
