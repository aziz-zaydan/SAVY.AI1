(function(){
  var S=function(p,w){return '<svg class="ci" viewBox="0 0 24 24" width="'+(w||20)+'" height="'+(w||20)+'" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';};
  window.SAVY_ICONS={
    chat:S('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.5-4.3A8 8 0 1 1 21 12z"/><path d="M8.5 11.5h7M8.5 14.5h4"/>'),
    scan:S('<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3.2"/>'),
    day:S('<rect x="4" y="12" width="3.5" height="8" rx="1"/><rect x="10.25" y="4" width="3.5" height="16" rx="1"/><rect x="16.5" y="9" width="3.5" height="11" rx="1"/>'),
    me:S('<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20c.8-3.8 3.8-6 7.5-6s6.7 2.2 7.5 6"/>'),
    mic:S('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/>'),
    cam:S('<path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H8l1.2-1.8h5.6L16 6h1.5A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5z"/><circle cx="12" cy="12.5" r="3.4"/>'),
    send:S('<path d="M5 12l14-7-5 14-2.5-5.5z"/><path d="M11.5 13.5L19 5"/>',20),
    x:S('<path d="M6 6l12 12M18 6L6 18"/>',18),
    refresh:S('<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',18),
    down:S('<path d="M6 9l6 6 6-6"/>',18),
    wa:'<svg class="ci" viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.8-1.7-.8s-.4-.1-.6.1-.7.8-.8 1c-.2.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2s.2-1.100.2-1.200c-.1-.1-.3-.2-.5-.3z"/></svg>'
  };
  var I=window.SAVY_ICONS;
  function set(sel,h){var e=document.querySelector(sel);if(e){e.innerHTML=h;e.classList.add("ci-btn");}}
  var acts=document.querySelectorAll(".chat-header-actions .chat-action-btn");
  if(acts[0]){acts[0].innerHTML=I.refresh;acts[0].classList.add("ci-btn");}
  if(acts[1]){acts[1].innerHTML=I.wa;acts[1].classList.add("ci-btn");}
  set(".chat-close",I.x);set("#voice-btn",I.mic);set("#chat-send-btn",I.send);set("#chat-scroll-btn",I.down);
})();
(function(){
  if(typeof addBotMsg!=="function")return;
  var T=function(f,a,e){return lang==="ar"?a:(lang==="en"?e:f);};
  var CHIPS={
    employee:{fr:["Quel est le menu ?","Un déjeuner léger","Un repas complet rapide","Comment commander ?"],ar:["شنو كاين فالمنيو؟","بغيت شي حاجة خفيفة","وجبة كاملة وسريعة","كيفاش نطلب؟"],en:["What's on the menu?","Something light","A quick full meal","How do I order?"]},
    sportif:{fr:["Les plats les plus protéinés","Après l'entraînement","Plat pour sèche","Menu complet"],ar:["الأطباق الغنية بالبروتين","بعد التمرين","طبق للتنشيف","شنو كاين فالمنيو؟"],en:["Highest-protein dishes","After my workout","A cutting meal","Full menu"]},
    famille:{fr:["Menu pour 4 personnes","Plats pour les enfants","Pas trop cher","Voir le menu"],ar:["منيو لـ 4 أشخاص","أطباق للصغار","بثمن مناسب","شنو كاين فالمنيو؟"],en:["Menu for 4","Dishes for kids","Budget-friendly","See the menu"]},
    couple:{fr:["Un dîner pour deux","Pour un anniversaire","Entrée + plat + dessert","Voir le menu"],ar:["عشاء لشخصين","لعيد ميلاد","مقبلات + طبق + حلوى","شنو كاين فالمنيو؟"],en:["Dinner for two","For a birthday","Starter + main + dessert","See the menu"]}
  };
  function chips(){
    var el=document.getElementById("quick-chips");if(!el)return;
    var p=(typeof persona!=="undefined"&&CHIPS[persona])?persona:"employee";
    var l=lang==="ar"?"ar":(lang==="en"?"en":"fr");
    el.innerHTML="";
    CHIPS[p][l].forEach(function(t){
      var b=document.createElement("button");b.className="q-chip-enhanced"+(p==="couple"?" pink":"");b.textContent=t;
      b.addEventListener("click",function(){chatSendText(t);});el.appendChild(b);
    });
    var sc=document.createElement("button");sc.className="q-chip-enhanced";sc.textContent="📸 "+T("Scanner mon repas","صوّر وجبتي","Scan my meal");
    sc.addEventListener("click",function(){if(window.savyNx)savyNx.go("scan");});el.appendChild(sc);
    var pl=document.createElement("button");pl.className="q-chip-enhanced";pl.textContent="🗓️ "+T("Plan repas du jour","خطة وجبات اليوم","Today's meal plan");
    pl.addEventListener("click",function(){chatSendText(T("Génère mon plan repas pour aujourd'hui selon mes objectifs.","ولّد لي خطة وجبات لليوم حسب أهدافي.","Generate my meal plan for today based on my targets."));});el.appendChild(pl);
  }
  function find(id){for(var i=0;i<dishes.length;i++)if(dishes[i].id===id)return dishes[i];return null;}
  function nm(d){return lang==="ar"?d.ar:d.name;}
  function lowLeft(id){var C=window.SAVY_CFG||{},s=(C.stock||{})[id],t=C.lowStockAt||5;return(s!=null&&s>0&&s<=t)?s:0;}
  window.savyLowLeft=lowLeft;
  /* ---------- preference memory (with consent) ---------- */
  var MK="savy_prof",CK="savy_prof_ok",pending=null;
  function rd(k){try{return localStorage.getItem(k);}catch(e){return null;}}
  window.savyMem={
    get:function(){if(rd(CK)!=="1")return null;try{return JSON.parse(rd(MK)||"null");}catch(e){return null;}},
    offer:function(p){
      var ok=rd(CK);
      if(ok==="0")return;
      if(ok==="1"){this.merge(p);return;}
      pending=Object.assign(pending||{},p);
      var msgs=document.getElementById("chat-msgs");if(!msgs||document.getElementById("cx-consent"))return;
      var b=document.createElement("div");b.id="cx-consent";
      b.innerHTML="<span>🔒 "+T("Retenir tes préférences (objectif, goûts, allergies) sur cet appareil pour de meilleures suggestions ?","نحتفظ بتفضيلاتك (الهدف، الأذواق، الحساسية) على هذا الجهاز لاقتراحات أدق؟","Save your preferences (goal, tastes, allergies) on this device for better suggestions?")+"</span><div><button type=\"button\" data-y>"+T("Oui","نعم","Yes")+"</button><button type=\"button\" data-n>"+T("Non","لا","No")+"</button></div>";
      var self=this;
      b.querySelector("[data-y]").onclick=function(){try{localStorage.setItem(CK,"1");}catch(e){}self.merge(pending||{});pending=null;b.innerHTML="<span>✓ "+T("Enregistré localement.","تم الحفظ على جهازك فقط.","Saved on this device only.")+"</span><div><button type=\"button\" data-f>"+T("Effacer","مسح","Forget")+"</button></div>";b.querySelector("[data-f]").onclick=function(){self.clear();b.remove();};};
      b.querySelector("[data-n]").onclick=function(){try{localStorage.setItem(CK,"0");}catch(e){}pending=null;b.remove();};
      msgs.appendChild(b);msgs.scrollTop=msgs.scrollHeight;
    },
    merge:function(p){var cur={};try{cur=JSON.parse(rd(MK)||"{}")||{};}catch(e){}Object.assign(cur,p);try{localStorage.setItem(MK,JSON.stringify(cur));}catch(e){}},
    clear:function(){try{localStorage.removeItem(MK);localStorage.removeItem(CK);}catch(e){}}
  };
  function cards(wrap,ids){
    var list=ids.map(find).filter(Boolean);if(!list.length)return;
    var box=document.createElement("div");box.className="cx-cards";
    list.forEach(function(d){
      var c=document.createElement("div");c.className="cx-card";
      var inCart=(typeof cart!=="undefined"&&cart.indexOf(d.id)>=0);
      c.innerHTML='<img src="'+d.img+'" alt="" loading="lazy"><div class="cx-i"><b></b><span>'+d.price+' MAD · '+d.cal+' kcal · '+d.p+'g P</span></div><button type="button" class="cx-add"></button>';
      c.querySelector("b").textContent=nm(d);
      var lw=lowLeft(d.id);if(lw){var em=document.createElement("em");em.className="cx-low";em.textContent="🔥 "+T("Plus que "+lw+" portions","بقي "+lw+" حصص فقط","Only "+lw+" left");c.querySelector(".cx-i").appendChild(em);}
      var bt=c.querySelector(".cx-add");
      function paint(on){bt.classList.toggle("on",on);bt.textContent=on?"✓":"+";bt.setAttribute("aria-label",on?T("Ajouté","تمت الإضافة","Added"):T("Ajouter","أضف","Add"));}
      paint(inCart);
      bt.addEventListener("click",function(){
        toggleCart(d.id);
        var on=(typeof cart!=="undefined"&&cart.indexOf(d.id)>=0)||(typeof wpIsOn==="function"&&wpIsOn());
        paint(on);foot(wrap);
      });
      box.appendChild(c);
    });
    wrap.appendChild(box);
  }
  function foot(wrap){
    var f=wrap.querySelector(".cx-foot");
    var n=(typeof cart!=="undefined")?cart.length:0;
    var wp=(typeof wpIsOn==="function"&&wpIsOn());
    if(!n&&!wp){if(f)f.remove();return;}
    if(!f){f=document.createElement("button");f.type="button";f.className="cx-foot";
      f.addEventListener("click",function(){closeChat();var b=document.getElementById("mob-bar-btn");if(b)b.click();});
      wrap.appendChild(f);}
    f.textContent=wp?T("✓ Ajouté — continuer","✓ تمت الإضافة — تابع","✓ Added — continue"):("🛒 "+T("Voir mon panier","عرض السلة","View cart")+" ("+n+")");
  }
  function starters(msgs){
    if(document.getElementById("cx-start"))return;
    var g=document.createElement("div");g.id="cx-start";
    var A=[["📸",T("Scanner mon repas","صوّر وجبتك","Scan my meal"),T("Calories en 5 s","السعرات في 5 ثوان","Calories in 5s"),function(){if(window.savyNx)savyNx.go("scan");}],
      ["🎯",T("Mon objectif","حدّد هدفك","My target"),T("Calcul gratuit","حساب مجاني","Free calculation"),function(){if(window.savyNx)savyNx.go("me");}],
      ["🍽️",T("Repas complet","وجبة كاملة","Full meal"),T("Entrée + plat + dessert","مقبلات + طبق + حلوى","Starter + main + dessert"),function(){chatSendText(T("Compose-moi un repas complet avec entrée, plat et dessert.","ركّب لي وجبة كاملة: مقبلات وطبق رئيسي وحلوى.","Build me a full meal: starter, main and dessert."));}],
      ["🛵",T("Livraison 45 min","توصيل 45 دقيقة","45-min delivery"),T("Commander maintenant","اطلب الآن","Order now"),function(){chatSendText(T("Que me conseilles-tu à commander maintenant ?","شنو تنصحني نطلب دابا؟","What do you recommend I order now?"));}]];
    A.forEach(function(a){var b=document.createElement("button");b.type="button";b.className="cx-sc";b.innerHTML="<i>"+a[0]+"</i><b>"+a[1]+"</b><small>"+a[2]+"</small>";b.addEventListener("click",function(){g.remove();a[3]();});g.appendChild(b);});
    msgs.appendChild(g);
  }
  function type(last,msgs){
    try{
      if(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches)return;
      var bub=last.querySelector(".msg-bubble");if(!bub)return;
      var nodes=[].filter.call(bub.childNodes,function(n){return n.nodeType===3;});
      var full=nodes.map(function(n){return n.nodeValue;});var total=full.join("").length;
      if(total<20||total>600)return;
      nodes.forEach(function(n){n.nodeValue="";});
      var step=Math.max(2,Math.ceil(total/60)),pos=0;
      var iv=setInterval(function(){
        pos+=step;var left=pos;
        nodes.forEach(function(n,i){var s=full[i];n.nodeValue=s.slice(0,Math.max(0,Math.min(s.length,left)));left-=s.length;});
        msgs.scrollTop=msgs.scrollHeight;
        if(pos>=total){clearInterval(iv);nodes.forEach(function(n,i){n.nodeValue=full[i];});}
      },22);
    }catch(e){}
  }
  function quickBtns(last,list){
    var col=last.lastElementChild;if(!col||col.querySelector(".cx-next"))return;
    var w=document.createElement("div");w.className="cx-next cx-quick";
    list.slice(0,3).forEach(function(t){var b=document.createElement("button");b.type="button";b.textContent=t;b.addEventListener("click",function(){w.remove();chatSendText(t);});w.appendChild(b);});
    col.appendChild(w);
  }
  function upsell(){
    if(typeof cart==="undefined"||!cart.length||typeof dishes==="undefined")return null;
    var inC=cart.map(find).filter(Boolean),has=function(c){return inC.some(function(d){return d.course===c;});};
    var need=!has("dessert")?"dessert":(!has("starter")?"starter":null);if(!need||!has("main"))return null;
    var opts=dishes.filter(function(d){return d.course===need&&cart.indexOf(d.id)<0;}).sort(function(a,b){return a.price-b.price;});
    return opts.length?opts[0]:null;
  }
  function nextBtns(last){
    var col=last.lastElementChild;if(!col)return;
    var w=document.createElement("div");w.className="cx-next";
    var n=(typeof cart!=="undefined")?cart.length:0;
    var L=n?[["🛒 "+T("Finaliser ("+n+")","أكمل الطلب ("+n+")","Checkout ("+n+")"),function(){closeChat();var b=document.getElementById("mob-bar-btn");if(b)b.click();}]]:[["🍴 "+T("Suggère-moi un plat","اقترح لي طبقاً","Suggest a dish"),function(){chatSendText(T("Suggère-moi un plat à commander.","اقترح لي طبقاً نطلبو.","Suggest a dish to order."));}]];
    var u=upsell();if(u)L.splice(1,0,["➕ "+nm(u)+" · "+u.price+" MAD",function(){toggleCart(u.id);if(window.savyNxToast)savyNxToast("🛒 "+T("Ajouté au panier","تمت الإضافة للسلة","Added to cart"));}]);
    L.push(["🔥 "+T("Plus de choix","خيارات أكثر","More options"),function(){chatSendText(T("Montre-moi d'autres plats.","شوفني أطباق أخرى.","Show me more dishes."));}]);
    L.forEach(function(x){var b=document.createElement("button");b.type="button";b.textContent=x[0];b.addEventListener("click",function(){w.remove();x[1]();});w.appendChild(b);});
    col.appendChild(w);
  }
  /* photo button */
  (function(){
    var row=document.querySelector(".chat-input-row"),inp=document.getElementById("chat-inp");if(!row||!inp||document.getElementById("cx-photo"))return;
    var f=document.createElement("input");f.type="file";f.accept="image/*";f.hidden=true;f.id="cx-photo-f";
    var b=document.createElement("button");b.type="button";b.id="cx-photo";b.className="chat-voice-btn";b.title="Photo";b.innerHTML=window.SAVY_ICONS.cam;
    b.onclick=function(){f.click();};
    f.onchange=function(){if(f.files&&f.files[0]&&window.savyNx&&savyNx.photo)savyNx.photo(f.files[0]);f.value="";};
    row.insertBefore(b,inp);row.appendChild(f);
  })();
  var _a=addBotMsg;
  addBotMsg=function(text,isGlow,ids){
    _a(text,isGlow);
    var msgs=document.getElementById("chat-msgs");if(!msgs)return;
    var bots=msgs.querySelectorAll(".msg-bot");var last=bots[bots.length-1];
    if(ids&&ids.length&&last){var col=last.lastElementChild;cards(col,ids);}
    var qk=window.__cxQuick;window.__cxQuick=null;
    if(last)type(last,msgs);
    if(bots.length===1){chips();starters(msgs);}
    else if(last&&qk&&qk.length)quickBtns(last,qk);
    else if(last&&!last.querySelector(".cx-next")&&(!ids||!ids.length))nextBtns(last,ids);
    msgs.scrollTop=msgs.scrollHeight;
  };
})();

/* FAB pill */
(function(){
  var fab=document.getElementById("fab-main");if(!fab||fab.querySelector(".fab-lbl"))return;
  var T=function(f,a,e){return lang==="ar"?a:(lang==="en"?e:f);};
  var l=document.createElement("span");l.className="fab-lbl";fab.appendChild(l);
  function t(){l.textContent=T("Demande au chef","اسأل الشيف","Ask the chef");}
  t();var _sl=window.setLang;window.setLang=function(x){_sl.apply(this,arguments);t();};
  var last=window.scrollY||0,wrap=document.getElementById("fab-main-wrap");
  addEventListener("scroll",function(){var y=window.scrollY||0;if(y>last+6&&y>240)wrap.classList.add("min");else if(y<last-6||y<120)wrap.classList.remove("min");last=y;},{passive:true});
  setTimeout(function(){if((window.scrollY||0)>120)wrap.classList.add("min");},7000);
})();

/* in-page chef cards */
(function(){
  var T=function(f,a,e){return lang==="ar"?a:(lang==="en"?e:f);};
  var P=(typeof persona!=="undefined"&&persona)||document.body.getAttribute("data-page")||"home";
  var PROMPTS={
    home:[["🎯",["Je veux perdre du poids","بغيت نخسر الوزن","I want to lose weight"]],["💪",["Repas riche en protéines","وجبة غنية بالبروتين","High-protein meal"]],["💰",["Un repas pas cher","وجبة بثمن مناسب","A budget meal"]]],
    employee:[["⚡",["Un déjeuner rapide","غدا سريع للمكتب","A quick office lunch"]],["💰",["Pas trop cher","بثمن مناسب","Budget-friendly"]],["🥗",["Léger","شي حاجة خفيفة","Something light"]]],
    sportif:[["💪",["Les plus protéinés","الأغنى بالبروتين","Highest protein"]],["🏋️",["Après l'entraînement","بعد التمرين","After my workout"]],["🔥",["Pour la sèche","للتنشيف","For cutting"]]],
    famille:[["👨‍👩‍👧",["Menu pour 4","منيو لـ 4 أشخاص","Menu for 4"]],["🧒",["Pour les enfants","للصغار","For kids"]],["💰",["Pas trop cher","بثمن مناسب","Budget-friendly"]]],
    couple:[["🕯️",["Dîner pour deux","عشاء لشخصين","Dinner for two"]],["🎂",["Pour un anniversaire","لعيد ميلاد","For a birthday"]],["🍽️",["Entrée + plat + dessert","مقبلات + طبق + حلوى","Starter + main + dessert"]]]
  };
  function ask(t){
    if(typeof openChat==="function")openChat();
    setTimeout(function(){try{if(window.savyNx)savyNx.go("chat");}catch(e){}if(t&&typeof chatSendText==="function")chatSendText(t);},450);
  }
  function L(a){return a[lang==="ar"?1:(lang==="en"?2:0)];}
  function big(){
    var d=document.createElement("section");d.className="cx-chef";d.id="cx-chef-hero";
    d.innerHTML='<div class="cx-chef-top"><div class="cx-chefimg"></div><div><h3></h3><p></p></div></div><div class="cx-chef-chips"></div><button type="button" class="cx-chef-cta"></button>';
    return d;
  }
  function fill(d){
    d.querySelector("h3").textContent=T("Demande au chef SAVY","اسأل الشيف SAVY","Ask Chef SAVY");
    d.querySelector("p").textContent=T("Dis-lui ton objectif : il te propose ton repas en quelques secondes.","قل له هدفك وسيقترح عليك وجبتك في ثوان.","Tell him your goal and get your meal in seconds.");
    var ch=d.querySelector(".cx-chef-chips");ch.innerHTML="";
    (PROMPTS[P]||PROMPTS.home).forEach(function(x){var b=document.createElement("button");b.type="button";b.textContent=x[0]+" "+L(x[1]);b.onclick=function(){ask(L(x[1]));};ch.appendChild(b);});
    d.querySelector(".cx-chef-cta").innerHTML=(window.SAVY_ICONS?window.SAVY_ICONS.chat:"")+"<span>"+T("Commencer la discussion","ابدأ المحادثة","Start chatting")+"</span>";
    d.querySelector(".cx-chef-cta").onclick=function(){ask();};
  }
  function slim(){
    var d=document.createElement("section");d.className="cx-chef slim";d.id="cx-chef-end";
    d.innerHTML='<div class="cx-chefimg"></div><div class="cx-chef-txt"><h3></h3></div><button type="button" class="cx-chef-cta"></button>';
    return d;
  }
  function fillS(d){
    d.querySelector("h3").textContent=T("Encore hésitant ? Parle au chef.","مازلت محتاراً؟ تكلّم مع الشيف.","Still undecided? Talk to the chef.");
    var b=d.querySelector(".cx-chef-cta");b.textContent=T("Discuter","ابدأ","Chat");b.onclick=function(){ask();};
  }
  var hero=document.getElementById("hero")||document.querySelector("section");
  if(!hero)return;
  var B=big();fill(B);hero.insertAdjacentElement("afterend",B);
  var end=document.getElementById("final")||document.querySelector("footer");
  var S=null;if(end){S=slim();fillS(S);end.insertAdjacentElement("beforebegin",S);}
  var pb=document.getElementById("hero-promo-badge"),S2=null;
  if(pb){S2=slim();S2.id="cx-chef-top";S2.classList.add("hero");pb.insertAdjacentElement("afterend",S2);}
  function fillT(d){d.querySelector("h3").textContent=T("Pas sûr de quoi choisir ? Demande au chef","محتار شنو تختار؟ اسأل الشيف","Not sure what to pick? Ask the chef");var b=d.querySelector(".cx-chef-cta");b.textContent=T("Discuter","ابدأ","Chat");b.onclick=function(){ask();};}
  if(S2)fillT(S2);
  var _sl2=window.setLang;window.setLang=function(x){_sl2.apply(this,arguments);fill(B);if(S)fillS(S);if(S2)fillT(S2);};
})();
