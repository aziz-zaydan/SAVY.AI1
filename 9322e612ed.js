(function(){
  if(document.body.dataset.page!=="home")return;
  const D={
   employee:{ar:["موظف/ة","غداء المكتب من الإثنين إلى الجمعة"],fr:["Employé(e)","Déjeuner au bureau, du lundi au vendredi"],en:["Employee","Office lunch, Monday to Friday"]},
   sportif:{ar:["رياضي/ة","بروتين وسعرات محسوبة لهدفك"],fr:["Sportif/ve","Protéines et calories calculées"],en:["Athlete","Protein and calories counted for your goal"]},
   famille:{ar:["عائلة","أطباق للمشاركة لـ 2 إلى 6 أشخاص"],fr:["Famille","Plats à partager, 2 à 6 personnes"],en:["Family","Plates to share, 2 to 6 people"]},
   couple:{ar:["زوجان","عشاء لشخصين في الموعد الذي تختاره"],fr:["Couple","Dîner à deux à l'heure choisie"],en:["Couple","Dinner for two at your time"]}
  };
  const Q={ar:"لمن تطلب اليوم؟",fr:"Vous commandez pour qui ?",en:"Who are you ordering for?"};
  const TR={ar:"✅ بدون التزام · الدفع نقداً عند التوصيل",fr:"✅ Sans engagement · Paiement cash à la livraison",en:"✅ No commitment · Cash on delivery"};
  function render(){
    const l=(typeof lang!=="undefined"&&D.employee[lang])?lang:"fr";
    document.querySelectorAll(".ht").forEach(a=>{const d=D[a.dataset.k][l];a.querySelector(".ht-t").textContent=d[0];a.querySelector(".ht-d").textContent=d[1];});
    renderD(l);const q=document.getElementById("ht-q");if(q)q.textContent=Q[l];
    const t=document.getElementById("hero-trust");if(t)t.textContent=TR[l];
  }
  // photo ribbon
  const hero=document.querySelector(".hero3 .h2-copy");
  if(hero&&typeof dishes!=="undefined"){
    const imgs=dishes.map(d=>`<img src="${d.img}" alt="" loading="lazy">`).join("");
    const r=document.createElement("div");r.className="ht-ribbon";r.innerHTML=`<div class="ht-rib">${imgs}${imgs}</div>`;
    hero.insertBefore(r,hero.firstChild);
    // dishes carousel
    const sec=document.createElement("section");sec.id="ht-dishes";
    sec.innerHTML=`<h2 id="hd-t"></h2><p id="hd-s"></p><div class="hd-row">${dishes.map(d=>`<button class="hd" onclick="openWelcome()"><img src="${d.img}" alt="" loading="lazy"><b data-id="${d.id}"></b><span>${d.price} MAD</span></button>`).join("")}</div>`;
    document.getElementById("hero").insertAdjacentElement("afterend",sec);
  }
  const HT={ar:["من أطباق الشيف","اضغط على أي طبق واختر فئتك لتطلبه"],fr:["Du menu du chef","Touchez un plat et choisissez votre profil pour commander"],en:["From the chef's menu","Tap a dish and pick your profile to order"]};
  function renderD(l){const h=HT[l];const t=document.getElementById("hd-t"),s=document.getElementById("hd-s");if(t)t.textContent=h[0];if(s)s.textContent=h[1];document.querySelectorAll("#ht-dishes b[data-id]").forEach(b=>{const d=dishes.find(x=>x.id==b.dataset.id);b.textContent=l==="ar"?d.ar:d.name;});}
  const _sl=setLang;setLang=function(l){_sl(l);render();};
  render();
})();
