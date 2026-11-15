(function(){
  var K="savy_theme",$=function(i){return document.getElementById(i);};
  function save(){try{sessionStorage.setItem(K,darkMode?"dark":"light");}catch(e){}}
  /* remember the choice for the whole visit, on every page */
  try{
    var _at=applyTheme;
    applyTheme=function(){var r=_at.apply(this,arguments);save();paint();return r;};
    var s=sessionStorage.getItem(K);
    if(s==="dark"||s==="light"){darkMode=(s==="dark");_at();}
  }catch(e){}
  /* theme picker inside the welcome popup */
  var box=$("welcome-box"),langs=box&&box.querySelector(".wl-langs");
  function T(f,a,e){return lang==="ar"?a:(lang==="en"?e:f);}
  function paint(){
    var w=document.querySelector(".wl-themes");if(!w)return;
    var bs=w.querySelectorAll("button");
    bs[0].textContent="☀️";bs[1].textContent="🌙";bs[0].title=bs[0].ariaLabel=T("Clair","فاتح","Light");bs[1].title=bs[1].ariaLabel=T("Sombre","داكن","Dark");
    bs[0].classList.toggle("on",!darkMode);bs[1].classList.toggle("on",!!darkMode);
  }
  if(langs&&!document.querySelector(".wl-themes")){
    var w=document.createElement("div");w.className="wl-themes";
    w.innerHTML='<button data-t="light"></button><button data-t="dark"></button>';
    langs.parentNode.appendChild(w);
    w.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;
      darkMode=(b.getAttribute("data-t")==="dark");applyTheme();});
    var _sl=setLang;setLang=function(l){var r=_sl.apply(this,arguments);paint();return r;};
    paint();
  }
  function trust(){var t=$("wl-trust");if(!t)return;
    var a=lang==="ar",f=lang==="fr";
    var it=a?["🛵 توصيل خلال 45 دقيقة","💵 كاش عند التوصيل","📍 تطوان · مضيق · مرتيل"]:f?["🛵 Livraison 45 min","💵 Cash à la livraison","📍 Tétouan · M'diq · Martil"]:["🛵 45-min delivery","💵 Cash on delivery","📍 Tétouan · M'diq · Martil"];
    t.innerHTML=it.map(function(x){return "<span>"+x+"</span>";}).join("");}
  trust();var _sl2=setLang;setLang=function(l){var r=_sl2.apply(this,arguments);trust();return r;};

  /* ---- popup extras: greeting, "from" prices, keyboard, auto language ---- */
  try{
    var ov=$("welcome-overlay");
    function greet(){
      var h=new Date().getHours(),g=$("wl-greet");
      if(!g){var t=$("welcome-title");if(!t)return;g=document.createElement("div");g.id="wl-greet";t.parentNode.insertBefore(g,t);}
      var m=h<12?0:(h<18?1:2),a=["صباح الخير ☀️","مساء الخير 🌤️","مساء الخير 🌙"],f=["Bonjour ☀️","Bon après-midi 🌤️","Bonsoir 🌙"],e=["Good morning ☀️","Good afternoon 🌤️","Good evening 🌙"];
      g.textContent=(lang==="ar"?a:lang==="en"?e:f)[m];
    }
    function from(){
      ["employee","sportif","famille","couple"].forEach(function(p){
        var small=$("wl-"+p+"-desc");if(!small)return;var card=small.closest(".wl-card"),el=card.querySelector(".wl-from");
        var pr=dishes.filter(function(d){return d.personas&&d.personas.indexOf(p)>=0;}).map(function(d){return d.price;});
        if(!pr.length)return;
        if(!el){el=document.createElement("em");el.className="wl-from";card.appendChild(el);}
        el.textContent=T("dès ","ابتداءً من ","from ")+Math.min.apply(null,pr)+(lang==="ar"?" درهم":" MAD");
      });
    }
    function refresh(){greet();from();}
    refresh();var _sl3=setLang;setLang=function(l){var r=_sl3.apply(this,arguments);refresh();return r;};
    if(ov){
      /* keyboard: Esc closes, focus moves into the dialog, Tab stays inside */
      document.addEventListener("keydown",function(e){
        if(!ov.classList.contains("open"))return;
        if(e.key==="Escape"){closeWelcome();return;}
        if(e.key==="Tab"){var f=[].slice.call(ov.querySelectorAll("button")).filter(function(b){return b.offsetParent;});
          if(!f.length)return;var first=f[0],last=f[f.length-1];
          if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
          else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
      });
      new MutationObserver(function(){if(ov.classList.contains("open")){var c=$("welcome-box");if(c){c.setAttribute("tabindex","-1");setTimeout(function(){c.focus({preventScroll:true});},500);}}}).observe(ov,{attributes:true,attributeFilter:["class"]});
      ov.addEventListener("click",function(e){if(e.target===ov)closeWelcome();});
    }
    /* first visit only: pick the browser's language if it is French or English */
    var saved=null;try{saved=sessionStorage.getItem("savy_lang");}catch(x){}
    if(!saved){var nl=(navigator.language||"").slice(0,2);if((nl==="fr"||nl==="en")&&nl!==lang)setLang(nl);}
  }catch(e){}
})();
