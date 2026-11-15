(function(){
  const page=document.body.dataset.page;if(!page||page==="home")return;
  const L=()=>({ar:"ar",en:"fr",fr:"fr"})[lang]||"fr", ar=()=>lang==="ar";
  const T=(f,a,e)=>ar()?a:(lang==="en"?(e||f):f);
  const sh=document.createElement("div");sh.id="meal-sheet";document.body.appendChild(sh);
  sh.addEventListener("click",e=>{if(e.target===sh)closeMeal();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMeal();});
  function inCart(id){
    if(page==="famille")return !!(famQty&&famQty[id]);
    if(page==="employee")return (weekPlan[wpActive]||[]).includes(id);
    if(page==="couple")return (couplePlan||[]).includes(id);
    return cart.includes(id);
  }
  window.closeMeal=function(){sh.classList.remove("open");sh.innerHTML="";};
  window.mealAdd=function(id){
    if(page==="famille")famAdj(id,1);
    else if(page==="sportif")toggleCart(id);
    else if(!inCart(id))wpAssign(id);
    closeMeal();
  };
  window.showMeal=function(id){
    const d=dishes.find(x=>x.id==id);if(!d)return;
    const tags=[];
    if(d.f==="vegan"||d.f==="vegetarian")tags.push(T("🌱 Végétarien","🌱 نباتي","🌱 Vegetarian"));
    if(d.p>=35)tags.push(T("💪 Riche en protéines","💪 بروتين عالٍ","💪 High protein"));
    if(d.cal<=400)tags.push(T("🥗 Léger","🥗 خفيف","🥗 Light"));
    if(d.tag==="Spicy")tags.push(T("🌶️ Épicé","🌶️ حار","🌶️ Spicy"));
    if(d.badge)tags.push("⭐ "+d.badge);
    const ing=ar()?d.ing_ar:d.ing_fr, al=ar()?d.al_ar:d.al_fr;
    const have=inCart(d.id);
    const lbl=page==="sportif"||page==="employee"||page==="couple"||page==="famille";
    sh.innerHTML=`<div class="ms-box" role="dialog" aria-modal="true">
      <div class="ms-ph"><img src="${d.img}" alt=""><button class="ms-x" onclick="closeMeal()" aria-label="close">✕</button><span class="ms-pr" dir="ltr">${d.price} MAD</span></div>
      <div class="ms-bd">
        <h3 class="ms-nm">${d.name}</h3>
        ${tags.length?`<div class="ms-tg">${tags.map(t=>`<span>${t}</span>`).join("")}</div>`:""}
        <div class="ms-mac"><div><b>${d.cal}</b><small>kcal</small></div><div><b>${d.p}g</b><small>${T("Protéines","بروتين","Protein")}</small></div><div><b>${d.c}g</b><small>${T("Glucides","كربوهيدرات","Carbs")}</small></div><div><b>${d.f_g}g</b><small>${T("Lipides","دهون","Fat")}</small></div></div>
        <div class="ms-sec"><h4>${T("Ingrédients","المكونات","Ingredients")}</h4><p>${ing}</p></div>
        <div class="ms-sec al"><h4>⚠ ${T("Allergènes","مسببات الحساسية","Allergens")}</h4><p>${al}</p></div>
        <div class="ms-sec"><p>⏱ ${T("Préparation","التحضير","Prep")}: ${d.t} min</p></div>
        <button class="ms-add ${have?"done":""}" onclick="mealAdd(${d.id})">${have?"✓ "+T("Déjà dans ma commande","موجود في طلبك","In your order"):T("Ajouter à ma commande","أضف إلى طلبي","Add to my order")}</button>
      </div></div>`;
    sh.classList.add("open");
  };
  // ⓘ buttons on persona-page cards
  const list=document.getElementById("dishes-list");
  function decorate(){
    if(!list)return;
    list.querySelectorAll(".dish-card").forEach(c=>{
      if(c.querySelector(".ms-i"))return;
      const ph=c.querySelector(".dish-photo"),btn=c.querySelector(".add-btn");if(!ph||!btn)return;
      const id=+btn.getAttribute("onclick").match(/\d+/)[0];
      const dd=dishes.find(x=>x.id==id);
      const bd=c.querySelector(".dish-body");
      if(bd&&dd&&!bd.querySelector(".pk-ing2")){const g=document.createElement("div");g.className="pk-ing2";g.textContent=ar()?dd.ing_ar:dd.ing_fr;const nm=bd.querySelector(".dish-name");if(nm)nm.insertAdjacentElement("afterend",g);}
      const b=document.createElement("button");b.className="ms-i";b.textContent="ⓘ";b.setAttribute("aria-label","info");b.onclick=e=>{e.stopPropagation();showMeal(id);};ph.appendChild(b);
    });
  }
  let hv=false;
  const bar=document.createElement("div");bar.className="mv-bar";
  function bar_(){bar.innerHTML=`<button class="${hv?"":"on"}" onclick="mealView(false)">▦ ${T("Vertical","عمودي","Vertical")}</button><button class="${hv?"on":""}" onclick="mealView(true)">☰ ${T("Horizontal","أفقي","Horizontal")}</button>`;}
  window.mealView=function(h){hv=h;list.classList.toggle("list-h",hv);bar_();};
  if(list&&page!=="employee"){list.parentNode.insertBefore(bar,list);bar_();}
  const _sl2=setLang;setLang=function(l){_sl2(l);bar_();decorate();};
  if(list){const mo=new MutationObserver(()=>{mo.disconnect();decorate();mo.observe(list,{childList:true});});mo.observe(list,{childList:true});decorate();}
  // employee ⓘ → sheet (override inline details)
  window.empInfo=function(ev,id){ev.stopPropagation();showMeal(id);};
})();
