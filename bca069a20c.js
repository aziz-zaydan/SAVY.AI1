(function(){
if(document.body.dataset.page!=="employee")return;
const ar=()=>lang==="ar", T=(f,a)=>ar()?a:f;
const intro=document.createElement("div");intro.id="emp-intro";
const menu=document.getElementById("menu");menu.parentNode.insertBefore(intro,menu);
const bar=document.createElement("div");bar.id="emp-bar";document.body.appendChild(bar);

function casaPseudoNow(){
  const p=Object.fromEntries(new Intl.DateTimeFormat("en-GB",{timeZone:"Africa/Casablanca",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date()).map(x=>[x.type,x.value]));
  return Date.UTC(+p.year,+p.month-1,+p.day,+p.hour%24,+p.minute);
}
function left(){
  const c=weekInfo().close, target=Date.UTC(c.getUTCFullYear(),c.getUTCMonth(),c.getUTCDate(),21,0);
  const m=Math.max(0,Math.floor((target-casaPseudoNow())/6e4));
  return {d:Math.floor(m/1440),h:Math.floor(m%1440/60),m:m%60};
}
function clockTxt(){
  const l=left(), w=weekInfo();
  const parts=ar()?[l.d?l.d+" يوم":"",l.h+" س",l.m+" د"]:[l.d?l.d+" j":"",l.h+" h",l.m+" min"];
  return `⏳ ${T("Commande de la semaine du","طلب أسبوع")} ${fmtD(w.days[0])} ${T("ferme dans","يُغلق بعد")} <b>${parts.filter(Boolean).join(" ")}</b>`;
}
function auto(k){
  const emp=dishes.filter(d=>(d.personas||[]).includes("employee"));
  const sorter={protein:(x,y)=>y.p-x.p,budget:(x,y)=>x.price-y.price,light:(x,y)=>x.cal-y.cal,veg:(x,y)=>y.p-x.p,mix:null}[k];
  let pool=emp.slice();
  if(k==="veg")pool=pool.filter(d=>d.f==="vegan"||d.f==="vegetarian");
  if(sorter)pool.sort(sorter);
  let pick=[];
  if(k==="mix"){const used=new Set();pool.sort((x,y)=>x.id-y.id);for(const d of pool){if(!used.has(d.cuis)){pick.push(d);used.add(d.cuis);}}for(const d of pool){if(!pick.includes(d))pick.push(d);}}
  else pick=pool;
  const days=(custom&&dayOn.some(Boolean))?[0,1,2,3,4].filter(i=>dayOn[i]):[0,1,2,3,4];
  dayOn=[false,false,false,false,false];weekPlan=[[],[],[],[],[]];dayOk=[false,false,false,false,false];
  days.forEach((i,n)=>{dayOn[i]=true;weekPlan[i]=[pick[n%pick.length].id];dayOk[i]=true;});
  wpActive=days[0];wpAdding=false;syncCart();renderPlans();scrollPanel();
}
function repeat(){
  try{const L=JSON.parse(localStorage.getItem("savy_emp_last"));
  dayOn=L.on;weekPlan=L.plan;dayOk=L.on.slice();wpActive=Math.max(0,L.on.indexOf(true));wpAdding=false;syncCart();renderPlans();
  scrollPanel();}catch(e){}
}
window.empRepeat=repeat;
function scrollPanel(){const e=document.getElementById("weekly-plan");if(e)e.scrollIntoView({behavior:"smooth",block:"start"});}
window.empAuto=auto;window.empScroll=scrollPanel;

function meals_(){return cart.length>0;}
function stage(){
  const on=[0,1,2,3,4].filter(i=>dayOn[i]), ok=on.filter(i=>dayOk[i]);
  return {on,ok,all:on.length>0&&ok.length===on.length};
}
function render(){
  const s=stage(), step=!s.on.length?1:s.all?3:2;
  const st=[["📅",T("Choisir les jours","اختر الأيام")],["🍽️",T("Choisir les plats","اختر الوجبات")],["✅",T("Confirmer","أكّد الطلب")]];
  intro.innerHTML=`
    </div>
    <div class="ei-pref"><div class="wk">📅 ${T("Semaine du","أسبوع")} ${fmtD(weekInfo().days[0])} – ${fmtD(weekInfo().days[4])}</div><b>${T("Qu'est-ce qui compte pour vous ?","ما الأهم بالنسبة لك؟")}</b><small>${T("Choisissez et nous proposons un plat par jour. Vous modifiez ensuite.","اختر وسنقترح لك طبقاً لكل يوم، وتعدّل بعدها ما تشاء")}</small><div class="pc">${[["protein","💪",T("Protéines","بروتين أكثر")],["budget","💰",T("Petit budget","ميزانية أقل")],["light","🥗",T("Léger","وجبات خفيفة")],["veg","🌱",T("Végétarien","نباتي")],["mix","🎲",T("Varié","تنويع")]].map(x=>`<button onclick="empAuto('${x[0]}')">${x[1]} ${x[2]}</button>`).join("")}</div></div>
    <div class="ei-steps">${st.map((x,i)=>`<div class="${i+1<step?"done":i+1===step?"now":""}"><span>${i+1<step?"✔":x[0]}</span>${x[1]}</div>`).join("")}</div>`;
  if(s.all&&meals_()){try{void(0)&&localStorage.setItem("savy_emp_last",JSON.stringify({on:dayOn,plan:weekPlan,n:cart.length,t:cartTotal()}));}catch(e){}}
  // bottom bar
  const tot=[0,1,2,3,4].reduce((a,i)=>a+(dayOn[i]?dayTotal(i):0),0), meals=[0,1,2,3,4].reduce((a,i)=>a+(dayOn[i]?weekPlan[i].length:0),0), cur=wpActive, curArr=weekPlan[cur]||[];
  const any=[0,1,2,3,4].some(i=>dayOn[i]&&((weekPlan[i]||[]).length||dayOk[i]));
  const curOpen=dayOn[cur]&&!dayOk[cur]&&curArr.length>0;
  let label,fn,go=false,sec="";
  if(!s.on.length){label=T("Choisir mes jours","اختر أيامك");fn="empScroll()";}
  else if(!any){const nx=s.on.find(i=>!dayOk[i]);label=T("Choisir les plats","اختر وجبات")+" "+(nx!==undefined?DN[ar()?"ar":"fr"][nx]:"");fn="empScroll()";}
  else{label=T("Confirmer et continuer","تأكيد والمتابعة")+" 🛵";fn="empFinish()";go=true;
    if(curOpen&&nextDay(cur)<5)sec=`<button class="eb-fin" onclick="wpConfirmDay()">${T("Jour suivant","يوم آخر")} ＋</button>`;}
  const tot2=cartTotal(), pending=[0,1,2,3,4].reduce((n,i)=>n+(dayOn[i]&&!dayOk[i]?(weekPlan[i]||[]).length:0),0);
  const sub=s.on.length?`${s.ok.length}/${s.on.length} ${T("jours confirmés","أيام مؤكدة")} · ${meals} ${T("repas","وجبة")}`:T("Aucun jour choisi","لم تختر أي يوم بعد");
  bar.innerHTML=`<div class="eb-sum"><small>${sub}</small><b dir="ltr">${paySplit(tot).co?paySplit(tot).em:tot} MAD</b>${paySplit(tot).co?`<small>${T("Part entreprise","حصة الشركة")} ${paySplit(tot).co} · ${T("Total","الإجمالي")} ${tot} MAD</small>`:""}</div>${sec}<button class="${go?"go":""}" onclick="${fn}">${label}</button>`;
}
let showChips=false;
function chips(){
  const box=document.getElementById("weekly-plan");if(!box)return;
  const lbl=box.querySelector(".wp-lbl"), row=lbl&&lbl.nextElementSibling;
  if(!row||!row.classList.contains("wp-pay"))return;
  const has=false, hide=false;
  lbl.style.display=row.style.display=hide?"none":"";
  const old=box.querySelector(".ei-chg");if(old)old.remove();
  if(has){const b=document.createElement("button");b.className="ei-chg";b.textContent=showChips?T("Masquer les jours","إخفاء الأيام"):T("✏️ Changer les jours","✏️ تغيير الأيام");b.onclick=()=>{showChips=!showChips;chips();};row.insertAdjacentElement("afterend",b);}
}
window.empToggleDays=function(){const b=document.getElementById("weekly-plan");b.classList.toggle("open");renderPlans();};
function fold(){
  const box=document.getElementById("weekly-plan");if(!box)return;
  box.querySelectorAll(".ei-daysum").forEach(e=>e.remove());
  const kids=[...box.children];
  const lbls=kids.filter(k=>k.classList.contains("wp-lbl")).slice(0,2);
  const chips=kids.find(k=>k.classList.contains("wp-pay"));
  const days=kids.find(k=>k.classList.contains("wp-days"));
  const note=kids.find(k=>k.classList.contains("wp-note")&&!k.closest(".wp-menu"));
  [...lbls,chips,days,note].forEach(e=>e&&e.classList.add("emp-fold"));
  const head=box.querySelector(".wp-head");if(!head)return;
  const sum=document.createElement("div");sum.className="ei-daysum";
  sum.innerHTML=`<span class="dl">${T("Jours :","أيامك:")}</span>`+[0,1,2,3,4].map(i=>dayOn[i]
    ?`<div class="dp ${i===wpActive?"act":""} ${dayOk[i]?"ok":""}" onclick="wpPick(${i})">${DN[ar()?"ar":"fr"][i]} <b>${dayOk[i]?"✔":(weekPlan[i]||[]).length}</b>${i===wpActive?`<u onclick="event.stopPropagation();empOff(${i})">✕</u>`:""}</div>`
    :`<div class="dp off" onclick="empOn(${i})">${DN[ar()?"ar":"fr"][i]} <b>＋</b></div>`).join("");
  head.insertAdjacentElement("afterend",sum);
}
function thumbs(){
  const box=document.getElementById("weekly-plan");if(!box)return;
  const on=[0,1,2,3,4].filter(i=>dayOn[i]);
  box.querySelectorAll(".wp-day").forEach((el,k)=>{const i=on[k],n=(weekPlan[i]||[]).length;
    el.innerHTML=`<b>${DN[ar()?"ar":"fr"][i]}</b>${n?`<span class="dn">${n}</span><em class="dk ${dayOk[i]?"ok":""}">${dayOk[i]?"✔":"•"}</em>`:`<em>+</em>`}`;});
}
let custom=false;
window.empOn=function(i){custom=true;dayOn[i]=true;wpActive=i;wpAdding=false;syncCart();renderPlans();};
window.empOff=function(i){custom=true;dayOn[i]=false;weekPlan[i]=[];dayOk[i]=false;wpAdding=false;
  if(!dayOn[wpActive]){const o=dayOn.findIndex((x,j)=>x&&!dayOk[j]);const k=o>-1?o:dayOn.indexOf(true);if(k>-1)wpActive=k;}
  syncCart();renderPlans();};
let sortBy="",view="grid";
window.empView=function(v){view=v;renderPlans();};
window.empSort=function(k){sortBy=sortBy===k?"":k;renderPlans();};
window.empInfo=function(ev,id,btn){ev.stopPropagation();const card=btn.closest(".wp-dish");let d=card.querySelector(".pk-det");if(d){d.remove();return;}const x=dish_(id);d=document.createElement("div");d.className="pk-det";d.innerHTML=`<b>${T("Ingrédients","المكونات")}:</b> ${ar()?x.ing_ar:x.ing_fr}<br><b>⚠ ${T("Allergènes","الحساسية")}:</b> ${ar()?x.al_ar:x.al_fr}`;card.appendChild(d);};
window.empCopyAll=function(){const src=weekPlan[wpActive].slice();[0,1,2,3,4].forEach(i=>{if(dayOn[i]){weekPlan[i]=src.slice();dayOk[i]=true;}});syncCart();renderPlans();scrollPanel();};
function picker(){
  const m=document.getElementById("wp-menu");if(!m)return;
  m.querySelectorAll(".pk-sort,.pk-tray,.pk-days,.pk-add,.pk-info,.pk-copy,.pk-det,.pk-x,.pk-addtile,.pk-tag,.pk-ing").forEach(e=>e.remove());
  const grid=m.querySelector(".wp-grid");if(!grid)return;
  const picking=!!grid.querySelector('.wp-dish[onclick^="wpAssign"]');
  const cur=weekPlan[wpActive]||[];
  if(picking){
    const sortBar=document.createElement("div");sortBar.className="pk-sort";
    sortBar.innerHTML=`<button class="pk-v ${view==="grid"?"on":""}" onclick="empView('grid')">▦</button><button class="pk-v ${view==="list"?"on":""}" onclick="empView('list')">☰</button>`+[["p",T("💪 Plus de protéines","💪 الأعلى بروتيناً")],["c",T("💰 Moins cher","💰 الأرخص")]].map(([k,l])=>`<button class="${sortBy===k?"on":""}" onclick="empSort('${k}')">${l}</button>`).join("");
    grid.classList.toggle("pk-list",view==="list");
    grid.parentNode.insertBefore(sortBar,grid);
    if(sortBy){const key={p:d=>-d.p,c:d=>d.price,k:d=>d.cal}[sortBy];const cards=[...grid.children];cards.sort((a,b)=>{const ia=+a.getAttribute("onclick").match(/\d+/)[0],ib=+b.getAttribute("onclick").match(/\d+/)[0];return key(dish_(ia))-key(dish_(ib));}).forEach(c=>grid.appendChild(c));}
    if(cur.length){const t=document.createElement("div");t.className="pk-tray";t.innerHTML=`<span>${T("Mon choix","اخترت")}:</span>`+cur.map(id=>`<button onclick="wpAssign(${id})">${ar()?dish_(id).ar:dish_(id).name} ✕</button>`).join("");grid.parentNode.insertBefore(t,sortBar);}
    if(cur.length){const dd=document.createElement("div");dd.className="pk-days";
      dd.innerHTML=`<span>${T("Aussi pour","نفس الوجبات أيضاً ليوم")}:</span>`+[0,1,2,3,4].filter(i=>i!==wpActive).map(i=>{const same=dayOn[i]&&dayOk[i]&&JSON.stringify(weekPlan[i])===JSON.stringify(cur);return `<button class="${same?"on":""}" onclick="empApply(${i})">${same?"✓ ":""}${DN[ar()?"ar":"fr"][i]}</button>`;}).join("")+`<button class="pk-skip" onclick="empSkip()">${T("Passer ce jour","⏭ تخطَّ هذا اليوم")}</button>`;
      grid.parentNode.insertBefore(dd,sortBar);}
    else{const dd=document.createElement("div");dd.className="pk-days";dd.innerHTML=`<button class="pk-skip" onclick="empSkip()">${T("Passer ce jour","⏭ تخطَّ هذا اليوم")}</button>`;grid.parentNode.insertBefore(dd,sortBar);}
    grid.querySelectorAll('.wp-dish[onclick^="wpAssign"]').forEach(c=>{
      const id=+c.getAttribute("onclick").match(/\d+/)[0];
      const ph=c.querySelector(".wp-ph");if(!ph)return;
      const a=document.createElement("span");a.className="pk-add";a.textContent=c.classList.contains("sel")?"✓":"+";a.style.display="flex";a.style.alignItems="center";a.style.justifyContent="center";
      const ck=ph.querySelector(".wp-ck");if(ck)ck.remove();
      const i=document.createElement("button");i.className="pk-info";i.textContent="ⓘ";i.onclick=e=>empInfo(e,id,i);
      ph.appendChild(a);ph.appendChild(i);
      const x=dish_(id),tg=[];
      if(x.f==="vegan"||x.f==="vegetarian")tg.push(T("🌱 Végétarien","🌱 نباتي"));
      if(x.p>=35)tg.push(T("💪 Riche en protéines","💪 بروتين عالٍ"));
      if(x.cal<=400)tg.push(T("🥗 Léger","🥗 خفيف"));
      if(x.tag==="Spicy")tg.push(T("🌶️ Épicé","🌶️ حار"));
      if(tg.length){const g=document.createElement("span");g.className="pk-tag";g.textContent=tg[0];c.insertBefore(g,c.querySelector(".wp-nm"));}
      const ing=document.createElement("div");ing.className="pk-ing";ing.textContent=ar()?x.ing_ar:x.ing_fr;c.appendChild(ing);
    });
  }else{
    grid.querySelectorAll(".wp-dish.sel").forEach(c=>{const rm=c.querySelector(".wp-rm");const ph=c.querySelector(".wp-ph");if(!rm||!ph)return;const x=document.createElement("button");x.className="pk-x";x.textContent="✕";x.setAttribute("onclick",rm.getAttribute("onclick"));ph.appendChild(x);});
    if(grid.querySelector(".wp-dish.sel")){const t=document.createElement("div");t.className="pk-addtile";t.innerHTML=`<i>＋</i>${T("Ajouter un plat","أضف طبقاً")}`;t.setAttribute("onclick","wpAddMore()");grid.appendChild(t);}
    const act=m.querySelector(".wp-act");
    if(act&&!act.querySelector(".pk-copy")&&[0,1,2,3,4].filter(i=>dayOn[i]&&i!==wpActive).length){const b=document.createElement("button");b.className="pk-copy";b.textContent=T("📋 Même choix pour tous les jours","📋 نفس الوجبات لكل الأيام المختارة");b.onclick=empCopyAll;b.style.gridColumn="1/-1";act.appendChild(b);}
  }
}
function nextDay(from){let n=from+1;while(n<5&&dayOn[n]&&dayOk[n])n++;return n;}
const _wc=wpConfirmDay;
wpConfirmDay=function(){const i=wpActive;_wc();
  if(!custom&&!dayOn.some((o,j)=>o&&!dayOk[j])){const n=nextDay(i);if(n<5){dayOn[n]=true;wpActive=n;wpAdding=false;syncCart();renderPlans();}}
  const e=document.querySelector(".ei-daysum")||document.getElementById("weekly-plan");if(e)e.scrollIntoView({behavior:"smooth",block:"start"});
};
window.empSkip=function(){custom=true;const i=wpActive;dayOn[i]=false;weekPlan[i]=[];dayOk[i]=false;wpAdding=false;
  const n=nextDay(i);if(n<5&&!(dayOn[n]&&dayOk[n])){dayOn[n]=true;wpActive=n;}else{const o=dayOn.findIndex((x,j)=>x&&!dayOk[j]);if(o>-1)wpActive=o;else{const k=dayOn.lastIndexOf(true);if(k>-1)wpActive=k;}}
  syncCart();renderPlans();};
window.empFinish=function(){[0,1,2,3,4].forEach(i=>{if(dayOn[i]){if(weekPlan[i].length)dayOk[i]=true;else{dayOn[i]=false;dayOk[i]=false;}}});if(!dayOn[wpActive]){const k=dayOn.indexOf(true);if(k>-1)wpActive=k;}syncCart();renderPlans();openWhatsApp();};
(function(){const sum=document.getElementById("ck-sum");if(!sum)return;const r=document.createElement("div");r.id="ck-recap";sum.insertAdjacentElement("afterend",r);
  const _rc=renderCheckout;renderCheckout=function(){_rc();const L=ar()?"ar":"fr";
    r.innerHTML=[0,1,2,3,4].filter(i=>dayOn[i]&&dayOk[i]).map(i=>`<div class="rr"><div><b>${dayLabel(i)}</b><small>${weekPlan[i].map(id=>ar()?dish_(id).ar:dish_(id).name).join(" + ")}</small><div class="rt">${["12:00","12:30","13:00","13:30"].map(x=>`<button class="${x===(dayWin[i]||wpWin)?"on":""}" onclick="empWin(${i},'${x}')">${x}</button>`).join("")}</div></div><span dir="ltr">${dayTotal(i)} MAD</span></div>`).join("");};
})();
let dayWin=[null,null,null,null,null];
window.empWin=function(i,v){dayWin[i]=v;renderPlans();};
const _wset=wpSet;wpSet=function(k,v){if(k==="win")dayWin=[null,null,null,null,null];_wset(k,v);};
const _bcm=buildCartMessage;buildCartMessage=function(){const o=_bcm();if(o&&persona==="employee"){let t=o.text;const w=[0,1,2,3,4].filter(i=>dayOn[i]&&dayOk[i]).map(i=>DN.fr[i]+" "+(dayWin[i]||wpWin)).join(", ");t=t.replace(/🕛 Créneau: .*? \(une livraison pour la semaine\)/,"🕛 Créneaux: "+w);o.text=t;}return o;};
window.empApply=function(i){
  const src=weekPlan[wpActive].slice();if(!src.length||i===wpActive)return;
  if(dayOn[i]&&dayOk[i]&&JSON.stringify(weekPlan[i])===JSON.stringify(src)){dayOn[i]=false;weekPlan[i]=[];dayOk[i]=false;}
  else{dayOn[i]=true;weekPlan[i]=src;dayOk[i]=true;}
  syncCart();renderPlans();
};
const _rp=renderPlans;renderPlans=function(){_rp();render();};
const _sl=setLang;setLang=function(l){_sl(l);render();};
setInterval(()=>{const c=document.getElementById("ei-clock");if(c)c.innerHTML=clockTxt();},30000);
(function(){const box=document.getElementById("weekly-plan");if(!box)return;let busy=false;
  const mo=new MutationObserver(()=>{if(busy)return;busy=true;mo.disconnect();try{render();fold();picker();}catch(e){console.error(e);}mo.observe(box,{childList:true,subtree:true});mo.takeRecords();busy=false;});
  mo.observe(box,{childList:true,subtree:true});})();
window.addEventListener('load',()=>setTimeout(()=>{if(!dayOn.some(Boolean)){dayOn[0]=true;wpActive=0;syncCart();renderPlans();}},50));
})();
