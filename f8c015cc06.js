(function(){
  if(document.body.dataset.page!=="home")return;
  function T(a,f,e){return lang==="ar"?a:(lang==="en"?e:f);}
  function $(i){return document.getElementById(i);}
  var N={employee:["موظف/ة","Employé(e)","Employee"],sportif:["رياضي/ة","Sportif/ve","Athlete"],famille:["عائلة","Famille","Family"],couple:["زوجان","Couple","Couple"]};
  function nm(k){var n=N[k];return lang==="ar"?n[0]:(lang==="en"?n[2]:n[1]);}
  function mem(){try{return JSON.parse(localStorage.getItem("savy_member")||"null");}catch(e){return null;}}
  function esc(v){return String(v||"").replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  try{if(localStorage.getItem("savy_menu")!=="2"){localStorage.removeItem("savy_last");localStorage.setItem("savy_menu","2");}}catch(x){}
  var hero=document.querySelector(".hero3 .h2-copy"),grid=document.querySelector(".ht-grid");
  if(!hero||!grid)return;

  /* returning visitor bar */
  var bar=document.createElement("div");bar.id="hp-back";hero.insertBefore(bar,hero.firstChild);
  function drawBack(){
    var m=mem();if(!m||!m.name){bar.style.display="none";return;}
    bar.style.display="flex";
    var first=esc(String(m.name).split(" ")[0]);
    var ls=null;try{ls=JSON.parse(localStorage.getItem("savy_last")||"null");}catch(x){}
    var re=(ls&&ls.p&&N[ls.p]&&ls.c&&ls.c.length)?'<a class="hb-re" href="'+ls.p+'.html?cart='+ls.c.join(",")+'">🔁 '+T("اطلب مرة أخرى","Commander à nouveau","Order again")+' <b>('+ls.c.length+')</b></a>':"";
    bar.innerHTML=re+'<span class="hb-t">👋 '+T("مرحباً","Bonjour","Hi")+' <b>'+first+'</b></span>'+
      (m.persona&&N[m.persona]?'<a class="hb-go" href="'+m.persona+'.html">'+T("أكمل في فئة ","Continuer en ","Continue as ")+nm(m.persona)+' ›</a>':'<a class="hb-go" href="#ht-grid">'+T("اختر فئتك","Choisissez votre profil","Pick your profile")+' ↓</a>');
  }
  grid.id="ht-grid";

  /* "from" price on each tile */
  function drawFrom(){
    document.querySelectorAll(".ht").forEach(function(a){
      var k=a.dataset.k,ps=(typeof dishes!=="undefined"?dishes:[]).filter(function(d){return (d.personas||[]).indexOf(k)>-1&&d.course==="main";}).map(function(d){return d.price;});
      if(!ps.length)return;var mn=Math.min.apply(null,ps),tx=a.querySelector(".ht-tx"),e=a.querySelector(".ht-from");
      if(!e){e=document.createElement("em");e.className="ht-from";tx.appendChild(e);}
      e.innerHTML=T("الرئيسي من","Plat dès","Main from")+' <span dir="ltr">'+mn+' MAD</span>';
    });
  }

  /* quiz */
  var qb=document.createElement("button");qb.type="button";qb.id="hp-qbtn";grid.insertAdjacentElement("afterend",qb);
  var qp=document.createElement("div");qp.id="hp-quiz";qp.style.display="none";qb.insertAdjacentElement("afterend",qp);
  var qs={n:null};
  function opts(arr){return '<div class="hq-o">'+arr.map(function(o){return '<button type="button" data-a="'+o[0]+'">'+o[1]+'</button>';}).join("")+'</div>';}
  function drawQ(){
    qb.textContent="🤔 "+T("لا أعرف أي فئة تناسبني","Je ne sais pas quel profil me convient","Not sure which profile fits me");
    if(qp.style.display==="none")return;
    var h="";
    if(qs.res){
      h='<div class="hq-r"><small>'+T("الأنسب لك","Le plus adapté","Best fit")+'</small><b>'+nm(qs.res)+'</b><button type="button" class="hq-go" data-go="'+qs.res+'">'+T("ادخل","Entrer","Go")+' ›</button><button type="button" class="hq-re" data-re>↺ '+T("إعادة","Refaire","Restart")+'</button></div>';
    }else if(qs.n==null){
      h='<div class="hq-q">'+T("كم شخصاً تطلب لهم؟","Pour combien de personnes ?","How many people?")+'</div>'+opts([["1",T("أنا فقط","Moi seul(e)","Just me")],["2",T("شخصان","Deux","Two")],["3",T("ثلاثة أو أكثر","Trois ou plus","Three or more")]]);
    }else{
      h='<div class="hq-q">'+T("ما هدفك؟","Votre objectif ?","Your goal?")+'</div>'+opts([["work",T("غداء العمل","Déjeuner au bureau","Office lunch")],["fit",T("بروتين ورياضة","Protéines & sport","Protein & training")]]);
    }
    qp.innerHTML=h;
  }
  qb.addEventListener("click",function(){qp.style.display=qp.style.display==="none"?"block":"none";qs={n:null};drawQ();});
  qp.addEventListener("click",function(e){
    var a=e.target.closest("[data-a]");
    if(a){var v=a.dataset.a;if(v==="2")qs.res="couple";else if(v==="3")qs.res="famille";else if(v==="1")qs.n=1;else qs.res=v==="fit"?"sportif":"employee";drawQ();return;}
    if(e.target.closest("[data-re]")){qs={n:null};drawQ();return;}
    var g=e.target.closest("[data-go]");if(g){var t=document.querySelector('.ht[data-k="'+g.dataset.go+'"]');t&&t.click();}
  });

  /* hours line under "how" */
  var how=$("how");
  if(how){var p=document.createElement("p");p.id="hp-hours";how.appendChild(p);
    window.__hpHours=function(){var C=window.SAVY_CFG||{},H=C.hours||{open:"10:00",close:"21:30"};p.innerHTML='<span>🕙 <span dir="ltr">'+H.open+' – '+H.close+'</span></span><span>🛵 '+T("تطوان · مضيق · مرتيل","Tétouan · M'diq · Martil","Tétouan · M'diq · Martil")+'</span><span>💵 '+T("الدفع نقداً عند التوصيل","Cash à la livraison","Cash on delivery")+'</span>';};}

  /* members skip the profile popup; dish taps go to their page */
  var _ow=typeof openWelcome==="function"?openWelcome:null,armed=false;window.addEventListener("load",function(){setTimeout(function(){armed=true;},0);});
  if(_ow){openWelcome=function(){
    var m=mem();
    if(m&&m.name&&!/[?&]choose=1/.test(location.search)){
      if(!armed)return;
      if(m.persona&&N[m.persona]){location.href=m.persona+".html";}else{grid.scrollIntoView({behavior:"smooth",block:"center"});}
      return;
    }
    return _ow.apply(this,arguments);
  };}


  /* "View menu" bar button: #menu is hidden on home, so scroll to the dishes preview instead */
  var mb=$("mob-bar-btn");
  function fixBtn(){if(!mb)return;mb.onclick=function(){var t=$("ht-dishes")||grid;t.scrollIntoView({behavior:"smooth",block:"start"});};}

  function all(){fixBtn();drawBack();drawFrom();drawQ();try{window.__hpHours&&window.__hpHours();}catch(e){}}
  var _sl=setLang;setLang=function(l){_sl(l);all();};
  all();
  /* the bottom bar measured the hero before this layout was applied: re-measure */
  [0,400,1500].forEach(function(t){setTimeout(function(){window.dispatchEvent(new Event("resize"));},t);});
  window.addEventListener("load",function(){window.dispatchEvent(new Event("resize"));});
})();
