// ============================================================
//  ВАЛЮТ-13 :: СОЗДАНИЕ ПЕРСОНАЖА — копия меню FALLOUT 1 (1997)
//  Чёрный фон, янтарные рамки, S.P.E.C.I.A.L. с +1/-1,
//  перки (+3 очка), черты, возраст/выпоротость/пол,
//  «Я — новый человек» / «Продолжить», случайный персонаж.
// ============================================================
(function(){
'use strict';

const TAGS=[['STRENGTH','СИЛА','Вы несёте больший вес и сильнее в ближнем бою.',
 'Влияет на: урон в ближнем бою, переносимый вес.'],
['PERCEPTION','ВОСПРИЯТИЕ','Вы лучше видите, слышите и чувствуете подвох.',
 'Влияет на: шанс попадания в бою, поиск тайников и ловушек.'],
['ENDURANCE','СТОЙКОСТЬ','Вы устойчивы к ядам, болезням и радиации.',
 'Влияет на: здоровье (HP) за уровень, сопротивление радиации.'],
['CHARISMA','ХАРИЗМА','Люди тянутся к вам, даже мутанты.',
 'Влияет на: цены торговли, поведение союзников.'],
['INTELLIGENCE','ИНТЕЛЛЕКТ','Вы хорошо обучаемы и понятливы.',
 'Влияет на: количество очков навыков за уровень.'],
['AGILITY','ЛОВКОСТЬ','Вы быстры и точны, тело слушается вас.',
 'Влияет на: очки действий (AP) за ход, скрытность.'],
['LUCK','УДАЧА','Кому-то везёт просто так. Вам — везёт.',
 'Влияет на: критические попадания, находки, азартные игры.']];

const SKILLS=[['SMALL ARMS','СТРЕЛКОВОЕ',0],['BIG ARMS','КРУПНОКАЛИБЕРНОЕ',0],
['MELEE','БЛИЖНИЙ БОЙ',5],['UNARMED','ОРУЖЕЙНИК',5],['THROWING','МЕТНИЕ',0],
['FIRST AID','МЕДПОМОЩЬ',5],['DOCTOR','ЛЕКАРЬ',0],['SNEAK','СКРЫТНОСТЬ',5],
['LOCKPICK','ВЗЛОМ ЗАМКОВ',5],['STEAL','КРАЖА',0],['TRAPS','ЛОВУШКИ',5],
['SCIENCE','НАУКА',0],['REPAIR','РЕМОНТ',0],['SPEECH','РЕЧЬ',5],
['BARTER','ТОРГОВЛЯ',5],['GAMBLING','АЗАРТНЫЕ ИГРЫ',5],['OUTDOORSMAN','ВЫЖИВАНИЕ',0]];

const PERKS=[
 ['FAST METABOLISM','УСКОРЖЕННЫЙ МЕТАБОЛИЗМ','Стимпак восстанавливает вдвое больше HP.','Требует: Стойкость 4'],
 ['NIGHT VISION','НОЧНОЕ ЗРЕНИЕ','Вы видите в темноте лучше обычного.','—'],
 ['QUICK HANDS','БЫСТРЫЕ РУКИ','Перезарядка оружия стоит на 1 AP меньше.','Требует: Ловкость 6'],
 ['STEREO SLUGGER','РАЗБИРАЮЩИЙСЯ В ОРУЖИИ','+5% к шансу крит. промаха по врагам.','Требует: Восприятие 5'],
 ['IRON BACK','ЖЕЛЕЗНАЯ СПИНА','Максимум переносимого веса увеличен на 50 кг.','Требует: Сила 6'],
 ['DAUNTING BLOW','СОКРУШАЮЩИЙ УДАР','+20% к урону ближнего боя.','Требует: Сила 5'],
 ['ACTION BOY','ЭНЕРГИЧНЫЙ','Больше очков действий (AP) каждый ход.','Требует: Ловкость 5'],
 ['BONUS HTH DAMAGE','БОНУС БЕЗОРУЖНОГО','+4 к урону без оружия.','Требует: Без оружия 65'],
 ['KILLSPREE','ЖАЖДА УБИЙСТВ','+10% урона после серии попаданий.','—'],
 ['MAGNETIC PERSONALITY','МАГНЕТИЗМ','Вам проще убеждать людей.','Требует: Харизма 6']];

const TRAITS=[
 ['FAST SHOT','СТРЕЛОК','+2 к первому выстрелу за ход, −2 к остальным.','—'],
 ['BLIND','СЛЕПОЙ','−10 ко всем проверкам восприятия, но +1 очко навыка.','—'],
 ['SMALL FRAME','ХРУПКОЕ ТЕЛО','−25 кг к переносимому весу.','—'],
 ['ONE HANDED','ОДНА ЛЕВАЯ','Владение одной рукой эффективнее на 25%.','Требует: Левая рука'],
 ['GOOD MANIERERS','ХОРОШИЕ МАНЕРЫ','−10 к торговле, но люди не злятся первыми.','—'],
 ['SKILLED','УМелец','+5 ко всем навыкам, но −10% к опыту.','—'],
 ['SEX APPEAL','СЕКСУАЛЬНОСТЬ','+5 к торговле и речи для привлекательных.','—'],
 ['RAGE','ЯРОСТЬ','+20% урона, но −20% защиты.','—']];

const AGES=[16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
const LVL=['ОЧ. МАЛО','МАЛО','НЕМНОГО','МНОГО','ОЧ. МНОГО'];
const GEND=['МУЖСКОЙ','ЖЕНСКИЙ'];

const c={tag:[5,5,5,5,5,5,5,5],skill:{},perk:[],trait:[],age:25,drunk:2,gender:0,name:'',pool:5};
SKILLS.forEach(s=>c.skill[s[0]]=s[2]);

let root=null,hudL=null,hudR=null,selTag=0;

function el(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;}
function btnRow(parent,label,cb,cls){const b=el('button','cc-btn'+(cls?' '+cls:''),label);b.onclick=cb;parent.appendChild(b);return b;}

// ------- рамка Fallout 1: двойная янтарная линия -------
function panel(cls){
 const p=el('div','cc-panel'+(cls?' '+cls:''));
 const inner=el('div','cc-inner');p.appendChild(inner);
 return {outer:p,inner:inner};
}

function open(onDone){
 if(root){root.style.display='flex';return;}
 root=el('div','cc-root');
 root.innerHTML='<div class="cc-frame">'
 +'<div class="cc-head">УБЕЖИЩЕ 13 · АННО 2161 · РЕГИСТРАЦИЯ НОВОГО ЖИТЕЛЯ</div>'
 +'<div class="cc-body">'
 +'<div class="cc-col cc-left"></div>'
 +'<div class="cc-col cc-mid"></div>'
 +'<div class="cc-col cc-right"></div>'
 +'</div><div class="cc-foot"></div></div>';
 document.body.appendChild(root);

 const left=root.querySelector('.cc-left');
 const mid=root.querySelector('.cc-mid');
 const right=root.querySelector('.cc-right');
 const foot=root.querySelector('.cc-foot');

 // ==== ЛЕВО: имя + S.P.E.C.I.A.L. ====
 const pn=panel();left.appendChild(pn.outer);
 const nameRow=el('div','cc-namerow');
 nameRow.appendChild(el('span','cc-lbl','ИМЯ:'));
 const inp=el('input','cc-input');inp.maxLength=15;inp.placeholder='Уроженец Убежища';
 inp.oninput=()=>{c.name=inp.value;};nameRow.appendChild(inp);pn.inner.appendChild(nameRow);

 const sp=el('div','cc-special');
 TAGS.forEach((t,i)=>{
  const row=el('div','cc-tag'+(i===selTag?' sel':''));
  const letter=el('span','cc-letter',t[0][0]);
  const nm=el('span','cc-tagname',t[1]);
  const minus=el('button','cc-mm','−');minus.onclick=(e)=>{e.stopPropagation();chgTag(i,-1);};
  const dots=el('span','cc-dots');
  const plus=el('button','cc-mm','+');plus.onclick=(e)=>{e.stopPropagation();chgTag(i,1);};
  row.append(letter,nm,minus,dots,plus);
  row.onclick=()=>{selTag=i;refreshSpecial();showDesc();};
  sp.appendChild(row);
 });
 pn.inner.appendChild(sp);
 const poolRow=el('div','cc-pool');poolRow.id='cc-pool';pn.inner.appendChild(poolRow);
 const rndBtn=btnRow(pn.inner,'⟳ СЛУЧАЙНЫЙ ПЕРСОНАЖ',rollAll,'cc-wide');

 // ==== ЦЕНТР: описание выбранного + перки + черты ====
 const d=panel('cc-descp');mid.appendChild(d.outer);
 d.outer.id='cc-desc';
 showDesc();

 const pk=panel();pk.outer.className='cc-panel cc-listp';
 pk.inner.appendChild(el('div','cc-cap','ПЕРКИ  (выберите до 3)'));
 const pl=el('div','cc-list');pk.inner.appendChild(pl);
 PERKS.forEach((p,i)=>{
  const it=el('div','cc-item'+(p[3].startsWith('Требует')&&!perkOK(i)?' off':''));
  it.innerHTML='<b>'+p[1]+'</b><span>'+p[2]+' <i>'+p[3]+'</i></span>';
  it.onclick=()=>{if(perkOK(i))tog(c.perk,i,3);renderPerks();};
  pl.appendChild(it);
 });
 mid.appendChild(pk.outer);

 const tr=panel();tr.outer.className='cc-panel cc-listp';
 tr.inner.appendChild(el('div','cc-cap','ЧЕРТЫ  (до 2)'));
 const tl=el('div','cc-list');tr.inner.appendChild(tl);
 TRAITS.forEach((p,i)=>{
  const it=el('div','cc-item');
  it.innerHTML='<b>'+p[1]+'</b><span>'+p[2]+' <i>'+p[3]+'</i></span>';
  it.onclick=()=>{tog(c.trait,i,2);renderTraits();};
  tl.appendChild(it);
 });
 mid.appendChild(tr.outer);

 // ==== ПРАВО: навыки + анкета ====
 const sk=panel();sk.outer.className='cc-panel cc-listp';
 sk.inner.appendChild(el('div','cc-cap','НАВЫКИ  (+5 очков, базовые отмечены ★)'));
 const sl=el('div','cc-list cc-skills');sk.inner.appendChild(sl);
 SKILLS.forEach(s=>{
  const it=el('div','cc-skill');
  it.innerHTML='<span>'+(s[2]>0?'★ ':'')+s[1]+'</span><b id="ccsk-'+s[0]+'">'+s[2]+'</b>';
  sl.appendChild(it);
 });
 right.appendChild(sk.outer);

 const q=panel();right.appendChild(q.outer);
 q.inner.appendChild(el('div','cc-cap','ЛИЧНОЕ ДЕЛО'));
 q.inner.appendChild(mkCycle('ВОЗРАСТ',()=>AGES.indexOf(c.age),(v)=>{c.age=AGES[v];},AGES.length));
 q.inner.appendChild(mkCycle('ВЫПОРОТНОСТЬ',()=>c.drunk,(v)=>{c.drunk=v;},LVL.length,LVL));
 q.inner.appendChild(mkCycle('ПОЛ',()=>c.gender,(v)=>{c.gender=v;},GEND.length,GEND));
 right.appendChild(q.outer);

 // ==== ФУТ ====
 btnRow(foot,'« Я — НОВЫЙ ЧЕЛОВЕК »',()=>{if(!c.name)c.name='Уроженец Убежища';close();onDone&&onDone(snapshot());},'cc-go');
 btnRow(foot,'ПРОДОЛЖИТЬ ▸',()=>{if(!c.name)c.name='Уроженец Убежища';close();onDone&&onDone(snapshot());});
 foot.appendChild(el('span','cc-hint','[Esc] — вернуться к игре без изменений'));
 const esc=el('button','cc-close','✕');esc.onclick=()=>{close();};foot.appendChild(esc);

 refreshSpecial();renderPerks();renderTraits();
}

function mkCycle(label,get,set,len,names){
 const row=el('div','cc-cycle');
 row.appendChild(el('span','cc-lbl',label));
 const m=el('button','cc-mm','◄');const v=el('span','cc-val');const p=el('button','cc-mm','►');
 const upd=()=>{v.textContent=names?names[get()]:String(get()+ (label==='ВОЗРАСТ'?0:1));};
 m.onclick=()=>{set((get()-1+len)%len);upd();};p.onclick=()=>{set((get()+1)%len);upd();};
 row.append(m,v,p);upd();return row;
}

function chgTag(i,d){
 const v=c.tag[i]+d;
 if(d>0){if(c.pool<=0||v>10)return;c.pool--;}
 else{if(v<1)return;c.pool++;}
 c.tag[i]=v;refreshSpecial();showDesc();updateDerived();
}
function perkOK(i){
 const t=c.tag;switch(PERKS[i][0]){
  case 'FAST METABOLISM':return t[2]>=4;case 'QUICK HANDS':return t[5]>=6;
  case 'STEREO SLUGGER':return t[1]>=5;case 'IRON BACK':return t[0]>=6;
  case 'DAUNTING BLOW':return t[0]>=5;case 'ACTION BOY':return t[5]>=5;
  case 'BONUS HTH DAMAGE':return (c.skill.UNARMED||0)>=65;case 'MAGNETIC PERSONALITY':return t[3]>=6;
  default:return true;}
}
function tog(arr,i,max){
 const x=arr.indexOf(i);
 if(x>=0)arr.splice(x,1);else{if(arr.length>=max)return;arr.push(i);}
}
function renderList(node,arr,data){
 [...node.children].forEach((ch,j)=>{ch.classList.toggle('on',arr.includes(j));});
}
function renderPerks(){renderList(root.querySelector('#cc-desc').nextSibling?document.querySelectorAll('.cc-list')[0]:document.querySelectorAll('.cc-list')[0],c.perk);}
function renderTraits(){renderList(document.querySelectorAll('.cc-list')[1],c.trait);}

function refreshSpecial(){
 const rows=root.querySelectorAll('.cc-tag');
 rows.forEach((r,i)=>{
  r.classList.toggle('sel',i===selTag);
  const dots=r.querySelector('.cc-dots');dots.textContent='●'.repeat(c.tag[i])+'○'.repeat(10-c.tag[i]);
 });
 document.getElementById('cc-pool').textContent='Свободных очков характеристик: '+c.pool+'  (всего S.P.E.C.I.A.L.: '+c.tag.reduce((a,b)=>a+b,0)+'/40)';
 updateDerived();
}
function showDesc(){
 const t=TAGS[selTag];
 const d=document.getElementById('cc-desc').querySelector('.cc-inner');
 d.innerHTML='<div class="cc-big">'+t[0]+'</div><h3>'+t[1]+'</h3><p>'+t[2]+'</p><p class="cc-note">'+t[3]+'</p>';
}
function updateDerived(){
 const hp=15+c.tag[2]*3, ap=5+Math.floor(c.tag[5]/2);
 const pts=SKILLS.filter(s=>s[2]>0).length; // базовые можно качать бесплатно
 let spent=0;SKILLS.forEach(s=>{spent+=c.skill[s[0]]-s[2];});
 SKILLS.forEach(s=>{const n=document.getElementById('ccsk-'+s[0]);if(n)n.textContent=c.skill[s[0]];});
 const f=document.querySelector('.cc-foot');if(!f)return;
 f.dataset.hp=hp;f.dataset.ap=ap;
}

function rollAll(){
 for(let i=0;i<7;i++){const a=Math.floor(Math.random()*7),b=Math.floor(Math.random()*7);
  const va=c.tag[a]+1,vb=c.tag[b]-1;if(va<=10&&vb>=1&&a!==b){c.tag[a]=va;c.tag[b]=vb;}}
 c.age=AGES[Math.floor(Math.random()*AGES.length)];
 c.drunk=Math.floor(Math.random()*LVL.length);
 c.perk=[];while(c.perk.length<3){const i=Math.floor(Math.random()*PERKS.length);if(!c.perk.includes(i)&&perkOK(i))c.perk.push(i);}
 c.trait=[];for(let k=0;k<2;k++){const i=Math.floor(Math.random()*TRAITS.length);if(!c.trait.includes(i))c.trait.push(i);}
 refreshSpecial();renderPerks();renderTraits();
}

function snapshot(){
 return {name:c.name||'Уроженец Убежища',tag:c.tag.slice(),
  hpMax:15+c.tag[2]*3,apMax:5+Math.floor(c.tag[5]/2),
  speedMul:0.9+c.tag[5]*0.03, dmgMul:0.85+c.tag[0]*0.06,
  crit:5+c.tag[6], perks:c.perk.map(i=>PERKS[i][1]), traits:c.trait.map(i=>TRAITS[i][1]),
  age:c.age,gender:c.gender};
}
function close(){if(root)root.style.display='none';}

window.CharCreate={open:open};
})();
