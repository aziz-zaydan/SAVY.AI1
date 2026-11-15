(function(){
const $=id=>document.getElementById(id);
const ar=()=>lang==="ar";
const T=(fr,a)=>ar()?a:fr;
let profile=false;
function place(){
  const plan=$("persona-plan"),calc=$("nutri-calc");if(!plan||!calc||$("sp-calc-btn"))return;
  const btn=document.createElement("button");btn.id="sp-calc-btn";btn.type="button";
  plan.insertAdjacentElement("afterend",btn);btn.insertAdjacentElement("afterend",calc);
  btn.onclick=()=>{calc.classList.toggle("open");label();};
  label();
}
function label(){
  const b=$("sp-calc-btn"),c=$("nutri-calc");if(!b)return;
  const open=c&&c.classList.contains("open");
  b.classList.toggle("done",profile&&!open);
  b.textContent=open?T("✕ Fermer","✕ إغلاق"):(profile?T("✓ Objectif personnalisé — modifier","✓ هدفك محسوب — عدّل"):T("🧮 Calculer mes besoins","🧮 احسب احتياجاتي"));
}
/* calculator personalises the plan target */
const _calc=calcNutri;
calcNutri=function(){
  _nc.goal=sportGoal==="cut"?"cut":sportGoal==="bulk"?"bulk":"maintain";
  _calc();
  const kc=parseInt(String($("nc-kcal").textContent).replace(/[^0-9]/g,"")),p=parseInt($("nc-prot").textContent);
  if(kc&&p){SP_GOALS[sportGoal].kcal=kc;SP_GOALS[sportGoal].p=p;profile=true;
    const c=$("nutri-calc");if(c)c.classList.remove("open");renderPlans();label();}
};
const _spg=spGoal;
spGoal=function(k){_spg(k);if(profile){calcNutri();}};
/* one order bar */
function bar(){
  const t=$("mob-bar-title"),s=$("mob-bar-sub"),b=$("mob-bar-btn");if(!t||!b)return;
  const n=cart.length;
  if(n){
    t.textContent=T(`🛒 ${n} plat${n>1?"s":""} · ${cartTotal()} MAD`,`🛒 ${n} وجبة · ${cartTotal()} MAD`);
    s.textContent=T("💵 Cash à la livraison · 45 min","💵 كاش عند التوصيل · 45 دقيقة");
    b.textContent=T("Commander","اطلب الآن");b.onclick=()=>openWhatsApp();
  }else{
    t.textContent=T("🛵 Livraison en 45 min","🛵 توصيل خلال 45 دقيقة");
    s.textContent=T("💵 Cash à la livraison · Tétouan","💵 كاش عند التوصيل · تطوان");
    b.textContent=T("Choisir un plat","اختر وجبتك");b.onclick=()=>document.getElementById("menu").scrollIntoView({behavior:"smooth"});
  }
}
const _sc=syncCart;syncCart=function(){_sc.apply(this,arguments);bar();};
const _sl=setLang;setLang=function(l){_sl(l);label();bar();};
place();label();bar();
})();
