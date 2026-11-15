(function(){
  try{if(localStorage.getItem("savy_menu")!=="2"){localStorage.removeItem("savy_last");localStorage.setItem("savy_menu","2");}}catch(x){}
  var page=document.body.getAttribute("data-page")||"";
  var $=function(i){return document.getElementById(i);};
  var D={hours:{open:"10:00",close:"21:30"},lead:60,slots:["12:30","13:30","19:30","20:30"],
    fees:{"Tétouan":0,"M'diq":0,"Martil":0},freeFrom:0,min:{},feeFree:["employee"],
    promo:{SAVY10:{pct:10,first:true}},soldOut:[],stock:{},lowStockAt:5,daily:null,perSlot:8,loyaltyEvery:10};
  var C=window.SAVY_CFG||{};for(var k in D)if(C[k]==null)C[k]=D[k];
  function T(f,a,e){return lang==="ar"?a:(lang==="en"?e:f);}
  function get(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v;}catch(e){return d;}}
  function set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  function mins(s){var a=s.split(":");return +a[0]*60+ +a[1];}
  function nowMin(){var d=new Date();return d.getHours()*60+d.getMinutes();}
  function pad(n){return (n<10?"0":"")+n;}
  function dayKey(off){var d=new Date();d.setDate(d.getDate()+off);return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());}
  var hasSlot=(page==="sportif"||page==="famille");
  var isOpen=function(){var n=nowMin();return n>=mins(C.hours.open)&&n<=mins(C.hours.close)-45;};
  /* ---------- availability: sold out / daily menu ---------- */
  try{
    var stk=C.stock||{};
    if(C.soldOut.length||C.daily||Object.keys(stk).length){
      for(var i=dishes.length-1;i>=0;i--){var id=dishes[i].id;
        if(C.soldOut.indexOf(id)>=0||(stk[id]!=null&&Number(stk[id])<=0)||(C.daily&&C.daily.indexOf(id)<0))dishes.splice(i,1);}
    }
  }catch(e){}
  /* ---------- slots ---------- */
  var counts={};
  function slotOptions(){
    var n=nowMin(),o=[];
    if(isOpen())o.push({v:"now",key:"",label:T("⚡ Dès que possible","⚡ في أقرب وقت","⚡ ASAP")});
    C.slots.forEach(function(s){if(mins(s)>=n+C.lead&&mins(s)<=mins(C.hours.close))o.push({v:"t:"+s,key:dayKey(0)+" "+s,label:s});});
    if(o.length<3||!isOpen())C.slots.forEach(function(s){o.push({v:"d:"+s,key:dayKey(1)+" "+s,label:T("Demain ","غداً ","Tomorrow ")+s});});
    return o;
  }
  var slot=null;
  function curSlot(){var o=slotOptions();if(!slot||!o.some(function(x){return x.v===slot;}))slot=o[0].v;return o.filter(function(x){return x.v===slot;})[0];}
  function slotText(){var s=curSlot();if(s.v==="now")return "dès que possible (≈45 min)";return (s.v.charAt(0)==="d"?"Demain ":"Aujourd'hui ")+s.v.slice(2);}
  function full(s){return s.key&&counts[s.key]>=C.perSlot;}
  function loadCounts(){
    try{
      if(typeof GOOGLE_SHEET_URL==="undefined"||!GOOGLE_SHEET_URL||GOOGLE_SHEET_URL.indexOf("PASTE")>=0)return;
      fetch(GOOGLE_SHEET_URL+"?action=slots&days="+dayKey(0)+","+dayKey(1)).then(function(r){return r.json();}).then(function(j){if(j&&j.ok){counts=j.slots||{};renderBox();}}).catch(function(){});
    }catch(e){}
  }
  /* ---------- money ---------- */
  var promo=null,orderId="";
  function sub(){try{return cartTotal();}catch(e){return 0;}}
  function fee(){
    if(C.feeFree.indexOf(page)>=0)return 0;
    var s=sub();if(C.freeFrom&&s>=C.freeFrom)return 0;
    return C.fees[ck.city]||0;
  }
  function disc(){return promo?Math.round(sub()*promo.pct/100):0;}
  function pay(){return Math.max(0,sub()-disc()+fee());}
  function newId(){var d=new Date();return "SV-"+pad(d.getMonth()+1)+pad(d.getDate())+"-"+Math.random().toString(36).slice(2,5).toUpperCase();}
  /* ---------- message ---------- */
  try{
    var _ct=ckTail;
    ckTail=function(){
      var r=_ct.apply(this,arguments).replace(/\n\n\(Code SAVY10[^)]*\)/,""),add="";
      if(orderId)add+="\n🧾 N°: "+orderId;
      if(hasSlot)add+="\n🕛 Créneau: "+slotText();
      if(fee()||disc()){
        add+="\n💳 Sous-total "+sub()+(fee()?" + Livraison "+fee():"")+(disc()?" − Remise "+disc()+(promo?" ("+promo.code+")":""):"")+" → À payer: "+pay()+" MAD";
      }
      var n=get("savy_orders",0)+1;
      if(n%C.loyaltyEvery===0)add+="\n🎁 SAVY Club: commande n°"+n+" — plat offert";
      return r+add;
    };
    var _so=sendOrderWhatsApp;
    sendOrderWhatsApp=function(re){
      if(!re){set("savy_orders",get("savy_orders",0)+1);
        if(hasSlot)try{set("savy_last",{p:page,c:cart.slice()});}catch(e){}}
      return _so.apply(this,arguments);
    };
    var _ss=saveToSheets;
    saveToSheets=function(d){try{d.order_id=orderId;d.slot=hasSlot?curSlot().key||"asap":"";d.fee=fee();d.discount=disc();d.payable=pay();d.promo=promo?promo.code:"";}catch(e){}return _ss.call(this,d);};
    var _sub=submitCheckout;
    submitCheckout=function(){
      var m=(C.min[page]!=null?C.min[page]:(C.min.default||0)),er=$("ck-err");
      if(m&&sub()<m){er.textContent=T("Commande minimum : "+m+" MAD","الحد الأدنى للطلب: "+m+" درهم","Minimum order: "+m+" MAD");return;}
      if(hasSlot){var s=curSlot();if(full(s)){er.textContent=T("Ce créneau est complet, choisissez un autre.","هذا الموعد ممتلئ، اختر موعداً آخر.","This slot is full, please pick another.");return;}}
      return _sub.apply(this,arguments);
    };
    var _oc=openCheckout;
    openCheckout=function(){orderId=newId();loadCounts();return _oc.apply(this,arguments);};
  }catch(e){}
  /* ---------- checkout block ---------- */
  function renderBox(){
    var host=$("sx-box");
    if(!host){
      var notes=$("ck-notes");if(!notes)return;var lab=notes.closest("label");if(!lab)return;
      host=document.createElement("div");host.id="sx-box";lab.parentNode.insertBefore(host,lab);
    }
    var h="";
    if(hasSlot){
      curSlot();
      h+='<div class="ck-sec">🕛 '+T("Heure de livraison","وقت التسليم","Delivery time")+'</div>';
      if(!isOpen())h+='<div class="sx-warn">🌙 '+T("Cuisine fermée ("+C.hours.open+"–"+C.hours.close+"). Choisissez un créneau.","المطبخ مغلق الآن ("+C.hours.open+"–"+C.hours.close+"). اختر موعداً.","Kitchen closed ("+C.hours.open+"–"+C.hours.close+"). Pick a slot.")+'</div>';
      h+='<div class="wp-pay">'+slotOptions().map(function(x){var f=full(x);
        return '<button class="'+(x.v===slot?"on":"")+(f?" sx-full":"")+'" '+(f?"disabled ":"")+'data-sx-slot="'+x.v+'">'+x.label+(f?" · "+T("complet","ممتلئ","full"):"")+'</button>';}).join("")+'</div>';
    }
    /* promo */
    h+='<div class="sx-promo"><input id="sx-code" placeholder="'+T("Code promo","كود الخصم","Promo code")+'" value="'+(promo?promo.code:"")+'" autocapitalize="characters"><button data-sx-apply>'+T("Appliquer","تطبيق","Apply")+'</button></div><div class="sx-pm" id="sx-pm"></div>';
    /* summary */
    if(fee()||disc()||C.fees["Tétouan"]||C.freeFrom){
      h+='<div class="sx-sum"><div><span>'+T("Sous-total","المجموع","Subtotal")+'</span><b>'+sub()+' MAD</b></div>'+
        (disc()?'<div><span>'+T("Remise","الخصم","Discount")+'</span><b>−'+disc()+' MAD</b></div>':"")+
        '<div><span>'+T("Livraison","التوصيل","Delivery")+'</span><b>'+(fee()?fee()+" MAD":T("Gratuite","مجاني","Free"))+'</b></div>'+
        '<div class="tt"><span>'+T("À payer","المطلوب دفعه","To pay")+'</span><b>'+pay()+' MAD</b></div></div>';
    }else if(disc()){
      h+='<div class="sx-sum"><div><span>'+T("Remise","الخصم","Discount")+'</span><b>−'+disc()+' MAD</b></div><div class="tt"><span>'+T("À payer","المطلوب دفعه","To pay")+'</span><b>'+pay()+' MAD</b></div></div>';
    }
    var n=get("savy_orders",0),L=C.loyaltyEvery,rem=L-(n%L),dots="";for(var i=0;i<L;i++)dots+='<i class="'+(i<n%L?"on":"")+'"></i>';
    h+='<div class="sx-loy"><div class="sx-lt">🎁 SAVY Club</div><div class="sx-dots">'+dots+'</div><div class="sx-ls">'+
      (rem===1?T("Cette commande est offerte en plat bonus !","هذا الطلب تحصل فيه على طبق هدية!","This order earns a free dish!"):
        T("Encore "+rem+" commandes pour un plat offert","بقي "+rem+" طلبات لتحصل على طبق هدية","Only "+rem+" more orders until a free dish"))+'</div></div>';
    if(hasSlot)h+='<button class="sx-share" data-sx-share>🔗 '+T("Partager mon panier","شارك سلتي","Share my cart")+'</button>';
    host.innerHTML=h;
    var pm=$("sx-pm");if(pm&&promo)pm.textContent="✅ "+promo.code+" −"+promo.pct+"%";
  }
  document.addEventListener("click",function(e){
    var t=e.target.closest?e.target:null;if(!t)return;
    var b=t.closest("[data-sx-slot]");if(b){slot=b.getAttribute("data-sx-slot");renderBox();return;}
    if(t.closest("[data-sx-apply]")){
      var c=($("sx-code").value||"").trim().toUpperCase(),p=C.promo[c],pm=$("sx-pm");
      if(!c){promo=null;renderBox();return;}
      if(!p){promo=null;renderBox();$("sx-pm").textContent="❌ "+T("Code invalide","كود غير صالح","Invalid code");return;}
      if(p.first&&get("savy_orders",0)>0){promo=null;renderBox();$("sx-pm").textContent="❌ "+T("Réservé à la 1ère commande","خاص بأول طلب فقط","First order only");return;}
      promo={code:c,pct:p.pct};renderBox();return;
    }
    if(t.closest("[data-sx-share]")){
      var u=location.href.split("#")[0].split("?")[0]+"?cart="+cart.join(",");
      var ti=T("Mon panier SAVY","سلة SAVY الخاصة بي","My SAVY cart");
      if(navigator.share){navigator.share({title:ti,url:u}).catch(function(){});}
      else{try{navigator.clipboard.writeText(u);}catch(x){}var s=t.closest("[data-sx-share]");s.textContent="✅ "+T("Lien copié","تم نسخ الرابط","Link copied");}
    }
  },true);
  try{var _rc=renderCheckout;renderCheckout=function(){var r=_rc.apply(this,arguments);renderBox();return r;};}catch(e){}
  /* ---------- allergen filter ---------- */
  var AL=[["Gluten","غلوتين","Gluten"],["Œufs","بيض","Eggs"],["Lait","حليب","Milk"],["Poisson","سمك","Fish"],["Fruits à coque","مكسرات","Nuts"],["Soja","صويا","Soy"],["Sésame","سمسم","Sesame"],["Crustacés","قشريات","Shellfish"]];
  var avoid=[];
  function bad(d){var a=(d.al_fr||"");return avoid.some(function(x){return a.indexOf(x)>=0;});}
  try{
    var _f=dishes.filter;
    dishes.filter=function(fn,th){return _f.call(this,function(d,i,a){return !(avoid.length&&bad(d))&&fn.call(th,d,i,a);});};
  }catch(e){}
  function drawAl(){
    var el=$("sx-al");if(!el)return;
    el.innerHTML='<span class="sx-al-t">🚫 '+T("Sans","بدون","Without")+'</span>'+AL.map(function(x){
      return '<button class="'+(avoid.indexOf(x[0])>=0?"on":"")+'" data-al="'+x[0]+'">'+T(x[0],x[1],x[2])+'</button>';}).join("");
  }
  /* ---------- reorder / shared cart ---------- */
  function loadCart(ids){
    try{var ok=ids.filter(function(id){return dishes.some(function(d){return d.id===id;});});
      if(!ok.length)return false;cart=ok.slice();if(typeof renderDishes==="function")renderDishes();syncCart();return true;}catch(e){return false;}
  }
  function init(){
    var list=$("dishes-list");
    if(list&&!$("sx-al")){
      var a=document.createElement("div");a.id="sx-al";list.parentNode.insertBefore(a,list);drawAl();
      a.addEventListener("click",function(e){var b=e.target.closest("[data-al]");if(!b)return;
        var v=b.getAttribute("data-al"),i=avoid.indexOf(v);if(i>=0)avoid.splice(i,1);else avoid.push(v);drawAl();renderDishes();});
      var _s=setLang;setLang=function(l){_s(l);drawAl();};
    }
    var hero=$("persona-hero"),anchor=$("trust-strip")||hero;
    if(hero&&!isOpen()&&!$("sx-closed")){
      var c=document.createElement("div");c.id="sx-closed";anchor.insertAdjacentElement("afterend",c);
      var dc=function(){c.textContent="🌙 "+T("Cuisine fermée — commandez pour un créneau plus tard.","المطبخ مغلق الآن — يمكنك الطلب لموعد لاحق.","Kitchen closed — you can order for a later slot.");};
      dc();var _s2=setLang;setLang=function(l){_s2(l);dc();};
    }
    if(hasSlot){
      var q=(location.search.match(/[?&]cart=([\d,]+)/)||[])[1];
      if(q&&loadCart(q.split(",").map(Number).filter(Boolean)))return;
      var last=get("savy_last",null);
      if(last&&last.p===page&&last.c&&last.c.length&&!$("sx-re")&&hero){
        var d=document.createElement("button");d.id="sx-re";(($("sx-closed"))||anchor).insertAdjacentElement("afterend",d);
        var draw=function(){d.innerHTML="🔁 "+T("Refaire ma dernière commande","كرّر طلبي الأخير","Repeat my last order")+" <b>("+last.c.length+")</b>";};
        draw();d.onclick=function(){if(loadCart(last.c))d.remove();};
        var _s3=setLang;setLang=function(l){_s3(l);if(d.isConnected)draw();};
      }
    }
    if(page==="employee"&&!$("sx-sub")&&hero){
      var s=document.createElement("div");s.id="sx-sub";var mw=document.querySelector(".menu-slider-wrap");(mw||anchor).insertAdjacentElement("afterend",s);
      var W=C.weekly||{discount:10},DAYS=[["Lun","الاثنين","Mon"],["Mar","الثلاثاء","Tue"],["Mer","الأربعاء","Wed"],["Jeu","الخميس","Thu"],["Ven","الجمعة","Fri"]];
      var pick=[],ppl=1,open_=false,F={};
      (function(){try{var mb=JSON.parse(localStorage.getItem("savy_member")||"null")||{},ck=JSON.parse(localStorage.getItem("savy_ck")||"null")||{};
        F.name=mb.name||ck.name||"";F.phone=mb.phone||ck.phone||"";F.city=mb.city||ck.city||"";F.company=(mb.extra&&mb.extra.company)||"";F.address=ck.address||"";
        var z=parseInt(mb.extra&&mb.extra.size,10);if(z>0)ppl=Math.min(50,z);}catch(e){}
        var n=new Date();n.setDate(n.getDate()+((8-n.getDay())%7||7));F.start=n.toISOString().slice(0,10);})();
      function pool(){var r=dishes.filter(function(x){return (x.personas||[]).indexOf("employee")>-1&&(C.soldOut||[]).indexOf(x.id)<0;});var mn=r.filter(function(x){return x.course==="main";});return mn.length?mn:r;}
      function esc2(v){return String(v||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');}
      function dn(x){return lang==="ar"?(x.ar||x.name):x.name;}
      function sums(){var t=0;pick.forEach(function(id){var x=dishes.filter(function(y){return y.id===id;})[0];if(x)t+=x.price;});var d=W.discount||0;return{raw:t*ppl,net:Math.round(t*ppl*(100-d)/100)};}
      function d2(){
        var P=pool();if(!P.length){s.style.display="none";return;}
        if(!pick.length)pick=DAYS.map(function(_,i){return P[i%P.length].id;});
        var act=pick.filter(function(v){return v;}).length,m=sums(),save=m.raw-m.net,per=Math.round(m.net/ppl),free=(C.feeFree||[]).indexOf(page)>-1;
        var h='<div class="sx-hd"><div class="sx-st">📅 '+T("Abonnement hebdomadaire","الاشتراك الأسبوعي","Weekly subscription")+'</div>'+(W.discount?'<span class="sx-off">-'+W.discount+'%</span>':'')+'</div>'+
          '<div class="sx-sd">'+T("Votre semaine de déjeuners au bureau, sans y penser.","غداء أسبوعك في المكتب بلا تفكير.","A week of office lunches, sorted.")+'</div>'+
          '<div class="sx-ben">'+(free?'<span>🛵 '+T("Livraison offerte","توصيل مجاني","Free delivery")+'</span>':'')+'<span>🍽️ '+T("Plat au choix chaque jour","طبق تختاره لكل يوم","A dish of your choice daily")+'</span>'+(save>0?'<span>💰 '+T("Économie","توفير","Save")+' '+save+' MAD</span>':'')+'</div><div class="sx-wk">';
        DAYS.forEach(function(dd,i){
          var x=dishes.filter(function(y){return y.id===pick[i];})[0];
          if(!x){h+='<div class="sx-row sx-off-row"><b class="sx-day">'+T(dd[0],dd[1],dd[2])+'</b><div class="sx-dn"><strong>'+T("Jour annulé","اليوم ملغى","Day cancelled")+'</strong><small>'+T("Aucun repas ce jour","لا وجبة في هذا اليوم","No meal this day")+'</small></div><button type="button" class="sx-undo" data-undo="'+i+'">↩ '+T("Rétablir","استرجاع","Restore")+'</button></div>';return;}
          h+='<div class="sx-row" data-open="'+i+'" role="button" tabindex="0"><b class="sx-day">'+T(dd[0],dd[1],dd[2])+'</b>'+(x.img?'<img src="'+x.img+'" alt="" loading="lazy">':'<i>'+(x.e||"🍽️")+'</i>')+
            '<div class="sx-dn"><strong>'+dn(x)+'</strong><small><span dir="ltr">'+x.price+' MAD</span> · <span dir="ltr">'+x.cal+' kcal</span></small></div><span class="sx-ch" aria-hidden="true">▾</span>'+
            '<button type="button" class="sx-x" data-skip="'+i+'" aria-label="'+T("Annuler ce jour","إلغاء هذا اليوم","Cancel this day")+'">✕</button></div>';
        });
        h+='</div><div class="sx-grid"><div class="sx-f sx-pp"><span>'+T("Personnes","الأشخاص","People")+'</span><div class="sx-step"><button type="button" data-st="-1" aria-label="-">−</button><b>'+ppl+'</b><button type="button" data-st="1" aria-label="+">+</button></div></div>'+
          '<label class="sx-f"><span>'+T("Début","البداية","Start")+'</span><input type="date" data-f="start" value="'+F.start+'"></label>'+
          '<label class="sx-f sx-w2"><span>'+T("Entreprise","الشركة","Company")+'</span><input type="text" data-f="company" value="'+esc2(F.company)+'"></label>'+
          '<label class="sx-f sx-w2"><span>'+T("Adresse de livraison","عنوان التسليم","Delivery address")+'</span><input type="text" data-f="address" value="'+esc2(F.address)+'" placeholder="'+T("Rue, immeuble, étage","الشارع، العمارة، الطابق","Street, building, floor")+'"></label></div>'+
          '<div class="sx-wsum"><div><small>'+T("Total","المجموع","Total")+' · '+act+' '+T("jours","أيام","days")+'</small><div class="sx-tot">'+(W.discount?'<s>'+m.raw+'</s> ':'')+'<b>'+m.net+' MAD</b></div></div>'+(ppl>1?'<small class="sx-per"><span dir="ltr">≈ '+per+' MAD</span> / '+T("personne","شخص","person")+'</small>':'')+'</div>'+
          '<button class="sx-go" data-sx-sub'+(act?'':' disabled')+'>💬 '+T("Envoyer ma commande sur WhatsApp","أرسل طلبي عبر واتساب","Send my order on WhatsApp")+'</button>'+
          '<div class="sx-fn">'+(act?'':T("Choisissez au moins un jour.","اختر يوماً واحداً على الأقل. ","Pick at least one day.")+' ')+T("Confirmation et paiement convenus avec nous sur WhatsApp.","نؤكد الطلب ونتفق على الدفع معك عبر واتساب.","We confirm and agree payment with you on WhatsApp.")+'</div>';
        s.innerHTML=h;
      }

      var PK=null;
      function closePk(){if(PK){PK.remove();PK=null;document.removeEventListener("keydown",escPk);}}
      function escPk(e){if(e.key==="Escape")closePk();}
      function openPk(i){
        closePk();var P=pool(),dd=DAYS[i];
        PK=document.createElement("div");PK.id="sx-pk";
        PK.innerHTML='<div class="pk-bd"></div><div class="pk-box" role="dialog" aria-modal="true"><div class="pk-grab"></div><div class="pk-top"><h4>'+T("Plat du ","اختر طبق يوم ","Pick the dish for ")+T(dd[0],dd[1],dd[2])+'</h4><button type="button" class="pk-close" aria-label="x">✕</button></div><div class="pk-list">'+
          P.map(function(y){var on=y.id===pick[i];return '<button type="button" class="pk-card'+(on?' on':'')+'" data-pick="'+y.id+'">'+(y.img?'<img src="'+y.img+'" alt="" loading="lazy">':'<i>'+(y.e||"🍽️")+'</i>')+
            '<span class="pk-n"><strong>'+dn(y)+'</strong><small><span dir="ltr">'+y.cal+' kcal</span> · <span dir="ltr">P '+y.p+'g</span>'+(y.t?' · <span dir="ltr">'+y.t+' min</span>':'')+'</small></span><span class="pk-p"><span dir="ltr">'+y.price+' MAD</span>'+(on?'<em>✓</em>':'')+'</span></button>';}).join("")+'</div>'+
          '<button type="button" class="pk-skip" data-pskip>🚫 '+T("Annuler ce jour","إلغاء هذا اليوم","Cancel this day")+'</button></div>';
        document.body.appendChild(PK);document.addEventListener("keydown",escPk);
        requestAnimationFrame(function(){PK&&PK.classList.add("open");var on=PK&&PK.querySelector(".pk-card.on");on&&on.scrollIntoView({block:"center"});});
        PK.addEventListener("click",function(e){
          if(e.target.closest(".pk-close")||e.target.classList.contains("pk-bd")){closePk();return;}
          var c=e.target.closest("[data-pick]");if(c){pick[i]=+c.getAttribute("data-pick");closePk();d2();return;}
          if(e.target.closest("[data-pskip]")){pick[i]=0;closePk();d2();}
        });
      }
      d2();var _s4=setLang;setLang=function(l){_s4(l);d2();};
      s.addEventListener("change",function(e){
        var t=e.target;
        if(t.hasAttribute("data-d")){pick[+t.getAttribute("data-d")]=+t.value;d2();}
        else if(t.hasAttribute("data-f")){F[t.getAttribute("data-f")]=t.value.trim();}
        else if(t.hasAttribute("data-ppl")){ppl=Math.max(1,Math.min(50,parseInt(t.value,10)||1));d2();}
      });
      s.addEventListener("click",function(e){
        var sk=e.target.closest("[data-skip]");if(sk){pick[+sk.getAttribute("data-skip")]=0;d2();return;}
        var un=e.target.closest("[data-undo]");if(un){var P0=pool(),k=+un.getAttribute("data-undo");pick[k]=P0[k%P0.length].id;d2();return;}
        var op=e.target.closest("[data-open]");if(op){openPk(+op.getAttribute("data-open"));return;}
        var st=e.target.closest("[data-st]");if(st){ppl=Math.max(1,Math.min(50,ppl+(+st.getAttribute("data-st"))));d2();return;}
        if(!e.target.closest("[data-sx-sub]"))return;
        try{window.gtag&&gtag("event","subscription_request",{page:page});}catch(x){}
        var m=sums(),L=DAYS.map(function(dd,i){var x=dishes.filter(function(y){return y.id===pick[i];})[0];return x?"• "+dd[0]+": "+x.name+" ("+x.price+" MAD)":null;}).filter(Boolean).join("\n");if(!L)return;
        if(!F.company||!F.address){var el=s.querySelector('[data-f="'+(!F.company?"company":"address")+'"]');if(el){el.focus();el.style.borderColor="#d33";return;}}
        try{var o=JSON.parse(localStorage.getItem("savy_ck")||"{}");o.address=F.address;localStorage.setItem("savy_ck",JSON.stringify(o));}catch(x){}
        var msg="Salam SAVY ! Abonnement hebdomadaire entreprise 💼\n👤 "+F.name+(F.phone?" · "+F.phone:"")+"\n🏢 "+F.company+"\n📍 "+F.address+(F.city?", "+F.city:"")+"\n📅 Début: "+F.start+"\n👥 Personnes: "+ppl+"\n🗓️ Jours: "+pick.filter(Boolean).length+"/5\n———\n"+L+"\n———\n💰 Total: "+m.net+" MAD"+(W.discount?" (-"+W.discount+"%)":"")+" / semaine";
        window.open("https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(msg),"_blank");
      });
    }
    if(C.soldOut.length||C.daily){try{renderDishes();}catch(e){}}
  }
  setTimeout(init,350);
  try{var _tt=toggleTheme;toggleTheme=function(){var h=document.documentElement;h.classList.add("sx-theme-anim");var r=_tt.apply(this,arguments);setTimeout(function(){h.classList.remove("sx-theme-anim");},600);return r;};}catch(e){}
})();
