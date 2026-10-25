// Standalone, dependency-free regression checks for Vioverse v1.7.0.
// Run: node scripts/check-mega-patch.mjs
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const version=JSON.parse(readFileSync(new URL('../version.json',import.meta.url),'utf8'));
const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
assert(scripts.length,'Inline JavaScript must exist');
for(const code of scripts)new Function(code);
assert(html.includes("const BUILD_VERSION='"+version.version+"'"),'Game and version.json builds must match');
const begin=html.indexOf('/* v1.7.0 — The Forest Remembers:');
const end=html.indexOf("document.addEventListener('click',event=>{",begin);
assert(begin>=0&&end>begin,'Mega patch logic not found');
const code=html.slice(begin,end);
const tests=new Function(`
const alerts=[],journal=[];
let s={wood:300,essence:40,butterfly:1,restored:false,xp:0,mega:{}};
const level=x=>1+Math.floor(Math.sqrt(x/45));
const fmt=x=>Math.floor(x).toLocaleString();
const VV_STORY=[{name:'Seraphine',lv:1},{name:'Elowen',lv:5},{name:'Lira',lv:10},{name:'Nyx',lv:15},{name:'Ciel',lv:30}];
const toast=x=>alerts.push(x),note=x=>journal.push(x);
const window={},save=()=>{},render=()=>{},vvPanel=(title,html)=>title+html,vvButton=(...v)=>v.join(''),vvLink=(...v)=>v.join(''),vvTrack=()=>'',vvStat=()=>'',page='Home';
${code}
const corrupt=vvSanitizeMega({materials:{ore:-12,fish:'6',herbs:Infinity},crafted:['hook','hook','bad'],equipped:'hook',bond:{Seraphine:99}});
if(corrupt.materials.ore!==0||corrupt.materials.fish!==6||corrupt.crafted.length!==1||corrupt.bond.Seraphine!==5)throw Error('Invalid save sanitization');
s.mega=vvSanitizeMega({});
vvMegaWork('mining');if(s.mega.materials.ore!==0)throw Error('Mining unlocked before level 5');
s.xp=720;vvMegaWork('mining');if(s.mega.materials.ore!==2||s.mega.professions.mining!==10)throw Error('Mining reward incorrect');
vvMegaWork('mining');if(s.mega.materials.ore!==2)throw Error('Cooldown allowed duplicate');
vvMegaCraft('lantern');if(!s.mega.crafted.includes('lantern')||s.wood!==270)throw Error('Craft cost not paid');
vvMegaCraft('lantern');if(s.wood!==270)throw Error('Duplicate item purchase');
vvMegaRestore('lanternGrove');if(s.mega.sites.lanternGrove)throw Error('Site restored before chapter completion');
s.restored=true;vvMegaRestore('lanternGrove');if(!s.mega.sites.lanternGrove||s.wood!==200)throw Error('Restoration cost or flag');
vvMegaTalk('Seraphine');vvMegaTalk('Seraphine');if(s.mega.bond.Seraphine!==1)throw Error('Bond cooldown allowed duplicate');
if(!vvMegaWorld().includes('Lanterns in the Mist'))throw Error('World scene did not change');
if(!vvMegaWorkshop().includes('Forest Talisman'))throw Error('Crafting UI not rendered');
if(!vvMegaBonds().includes('Seraphine'))throw Error('Bond UI not rendered');
if(!vvMegaAchievements().includes('Lightkeeper'))throw Error('Achievements UI not rendered');
return {checks:14,journal:journal.length};
`);
const result=tests();
console.log('Vioverse mega patch checks passed:',result.checks,'checks; evaluated',scripts.length,'inline JavaScript block(s).');
