(function(){
  var KEY="savy_member",$=function(i){return document.getElementById(i);};
  function T(f,a,e){return lang==="ar"?a:(lang==="en"?e:f);}
  function member(){try{return JSON.parse(localStorage.getItem(KEY)||"null");}catch(e){return null;}}
  var CITIES=["Tétouan","M'diq","Martil"],GOALS=[["cut","نشّف","Sèche","Cut"],["bulk","ضخّم","Prise de masse","Bulk"],["keep","حافظ","Maintien","Maintain"]];
  var st={persona:"",city:"Tétouan",goal:"",ov:null,g:null};
  var CID=((window.SAVY_CFG||{}).googleClientId)||"";
  var PN={employee:["Employé(e)","موظف/ة","Employee"],sportif:["Sportif(ve)","رياضي/ة","Athlete"],famille:["Famille","عائلة","Family"],couple:["Couple","زوجان","Couple"]};
  function build(){
    if(st.ov)return;
    var o=document.createElement("div");o.id="sg-overlay";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");
    o.innerHTML='<div id="sg-box"><div class="sg-grab"></div><button class="sg-x" id="sg-x" aria-label="close">✕</button>'+
      '<img class="sg-logo" src="img/logo.webp" alt="SAVY" width="48" height="48"><div class="sg-badge" id="sg-badge"></div>'+
      '<h3 id="sg-title"></h3><p id="sg-sub"></p>'+
      '<div id="sg-gwrap" style="display:none"><div id="sg-g"></div><div class="sg-or"><span id="sg-or"></span></div></div><div class="sg-gchip" id="sg-gchip" style="display:none"></div>'+
      '<label class="sg-f"><span>👤</span><input id="sg-name" autocomplete="name" placeholder=" "><i id="sg-l-name"></i></label>'+
      '<label class="sg-f"><span>📞</span><input id="sg-phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" placeholder=" "><i id="sg-l-phone"></i></label>'+
      '<div class="sg-chips" id="sg-city"></div>'+
      '<div id="sg-extra"></div>'+
      '<label class="sg-ok"><input type="checkbox" id="sg-ok"><span id="sg-oktxt"></span></label>'+
      '<div class="sg-err" id="sg-err"></div>'+
      '<button class="sg-go" id="sg-go"></button><div class="sg-note" id="sg-note"></div></div>';
    document.body.appendChild(o);st.ov=o;
    o.addEventListener("click",function(e){if(e.target===o)close();});
    $("sg-x").onclick=close;$("sg-go").onclick=submit;
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&o.classList.contains("open"))close();});
    $("sg-city").addEventListener("click",function(e){var b=e.target.closest("button");if(b){st.city=b.getAttribute("data-c");paint();}});
    $("sg-extra").addEventListener("click",function(e){var b=e.target.closest("[data-g]");if(b){st.goal=b.getAttribute("data-g");paint();}});
  }
  function paint(){
    if(!st.ov)return;var p=st.persona,pn=PN[p]||PN.employee;
    $("sg-badge").textContent=T(pn[0],pn[1],pn[2]);
    $("sg-title").textContent=T("Créez votre compte gratuit","أنشئ حسابك المجاني","Create your free account");
    $("sg-sub").textContent=T("20 secondes pour suivre vos commandes et gagner des plats offerts avec SAVY Club.","20 ثانية فقط لتتبع طلباتك وتجميع النقاط والحصول على أطباق هدية مع SAVY Club.","20 seconds to track your orders and earn free dishes with SAVY Club.");
    $("sg-l-name").textContent=T("Nom complet","الاسم الكامل","Full name");
    $("sg-l-phone").textContent=T("Téléphone (WhatsApp)","رقم الهاتف (واتساب)","Phone (WhatsApp)");
    $("sg-city").innerHTML=CITIES.map(function(c){return '<button type="button" data-c="'+c+'" class="'+(c===st.city?"on":"")+'">'+c+'</button>';}).join("");
    var ex="";
    if(p==="employee")ex='<label class="sg-f"><span>🏢</span><input id="sg-company" autocomplete="organization" placeholder=" "><i>'+T("Entreprise (optionnel)","اسم الشركة (اختياري)","Company (optional)")+'</i></label>';
    else if(p==="sportif")ex='<div class="sg-sec">🎯 '+T("Votre objectif","هدفك","Your goal")+'</div><div class="sg-chips">'+GOALS.map(function(g){return '<button type="button" data-g="'+g[0]+'" class="'+(st.goal===g[0]?"on":"")+'">'+T(g[2],g[1],g[3])+'</button>';}).join("")+'</div>';
    else if(p==="famille")ex='<label class="sg-f"><span>👨‍👩‍👧</span><input id="sg-size" type="number" min="1" max="12" inputmode="numeric" placeholder=" "><i>'+T("Nombre de personnes (optionnel)","عدد أفراد الأسرة (اختياري)","Household size (optional)")+'</i></label>';
    var keep={};["sg-company","sg-size"].forEach(function(i){var e=$(i);if(e)keep[i]=e.value;});
    $("sg-extra").innerHTML=ex;for(var k in keep){var e2=$(k);if(e2)e2.value=keep[k];}
    $("sg-oktxt").innerHTML=T("J'accepte que SAVY utilise mes données pour traiter mes commandes et me contacter sur WhatsApp.","أوافق على استعمال بياناتي لمعالجة طلباتي والتواصل معي عبر واتساب.","I agree SAVY may use my details to process my orders and contact me on WhatsApp.")+' <a class="sg-pl" href="privacy.html" target="_blank" rel="noopener">'+T("Politique de confidentialité","سياسة الخصوصية","Privacy policy")+'</a>';
    $("sg-or").textContent=T("ou","أو","or");
    gchip();
    $("sg-go").textContent=T("S'inscrire et continuer","سجّل وتابع","Sign up & continue");
    $("sg-note").textContent=T("🔒 Gratuit · aucun spam · vos données restent privées","🔒 مجاني · بلا إزعاج · بياناتك تبقى خاصة","🔒 Free · no spam · your data stays private");
  }

  /* ---- Google sign-in (needs googleClientId in savy-config.js) ---- */
  function jwt(t){try{var p=t.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");return JSON.parse(decodeURIComponent(escape(atob(p))));}catch(e){return null;}}
  function gchip(){
    var c=$("sg-gchip");if(!c)return;
    if(!st.g){c.style.display="none";return;}
    c.style.display="flex";
    c.innerHTML=(st.g.picture?'<img src="'+st.g.picture+'" alt="" referrerpolicy="no-referrer">':'<b>G</b>')+'<span>'+T("Connecté avec Google","تم الدخول عبر Google","Signed in with Google")+'<br><small dir="ltr">'+st.g.email+'</small></span>';
  }
  function onGoogle(resp){
    var p=jwt(resp&&resp.credential);if(!p||!p.email)return;
    st.g={email:p.email,picture:p.picture,name:p.name||""};
    var n=$("sg-name");if(n&&!n.value)n.value=p.name||"";
    $("sg-gwrap").style.display="none";gchip();
    var ph=$("sg-phone");if(ph&&!ph.value)ph.focus();
  }
  var gLoaded=false;
  function initGoogle(){
    var wrap=$("sg-gwrap");
    if(st.g)return;
    if(!CID){
      $("sg-g").innerHTML='<button type="button" class="sg-gfake" disabled><svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7.9-6.2A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.2z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.2C6.5 42.6 14.6 48 24 48z"/></svg><span>'+T("Continuer avec Google","المتابعة عبر Google","Continue with Google")+'</span><em>'+T("bientôt","قريباً","soon")+'</em></button>';
      wrap.style.display="block";return;
    }
    function render(){
      try{
        google.accounts.id.initialize({client_id:CID,callback:onGoogle,ux_mode:"popup",auto_select:false});
        var w=Math.min(360,Math.max(240,($("sg-box").clientWidth||360)-36));
        $("sg-g").innerHTML="";
        google.accounts.id.renderButton($("sg-g"),{theme:"outline",size:"large",shape:"pill",text:"continue_with",width:w,locale:lang==="ar"?"ar":(lang==="fr"?"fr":"en")});
        wrap.style.display="block";
      }catch(e){wrap.style.display="none";}
    }
    if(window.google&&google.accounts&&google.accounts.id){render();return;}
    if(gLoaded)return;gLoaded=true;
    var sc=document.createElement("script");sc.src="https://accounts.google.com/gsi/client";sc.async=true;sc.defer=true;
    sc.onload=render;sc.onerror=function(){gLoaded=false;};document.head.appendChild(sc);
  }
  function open(p){
    build();st.persona=p;
    var m=member();if(m){st.city=m.city||st.city;}
    paint();initGoogle();
    st.ov.classList.add("open");document.body.style.overflow="hidden";
    setTimeout(function(){var n=$("sg-name");n&&n.focus({preventScroll:true});},450);
  }
  function close(){if(st.ov){st.ov.classList.remove("open");document.body.style.overflow="";}}
  function valid(phone){var d=phone.replace(/[\s.\-()]/g,"");return /^(?:\+?212|0)[5-7]\d{8}$/.test(d);}
  function submit(){
    var name=($("sg-name").value||"").trim(),phone=($("sg-phone").value||"").trim(),er=$("sg-err");
    ["sg-name","sg-phone"].forEach(function(i){$(i).classList.remove("bad");});
    var msg="";
    if(name.length<2){msg=T("Entrez votre nom.","أدخل اسمك.","Enter your name.");$("sg-name").classList.add("bad");}
    else if(!valid(phone)){msg=T("Numéro invalide (ex. 06 12 34 56 78).","رقم غير صالح (مثال: 06 12 34 56 78).","Invalid number (e.g. 06 12 34 56 78).");$("sg-phone").classList.add("bad");}
    else if(!$("sg-ok").checked){msg=T("Veuillez accepter pour continuer.","المرجو الموافقة للمتابعة.","Please accept to continue.");}
    if(msg){er.textContent=msg;return;}
    er.textContent="";
    var extra={};
    if($("sg-company"))extra.company=($("sg-company").value||"").trim();
    if($("sg-size"))extra.size=($("sg-size").value||"").trim();
    if(st.goal&&st.persona==="sportif")extra.goal=st.goal;
    var m={name:name,phone:phone.replace(/[\s.\-()]/g,""),city:st.city,persona:st.persona,lang:lang,extra:extra,ts:Date.now()};
    if(st.g){m.email=st.g.email;m.google=true;m.picture=st.g.picture||"";}
    try{localStorage.setItem(KEY,JSON.stringify(m));}catch(e){}
    try{localStorage.setItem("savy_ck",JSON.stringify({name:m.name,phone:m.phone,city:m.city,address:(JSON.parse(localStorage.getItem("savy_ck")||"{}").address||"")}));}catch(e){}
    try{saveToSheets({type:"signup",email:m.email||"",method:m.google?"google":"form",name:m.name,phone:m.phone,city:m.city,persona:m.persona,lang:m.lang,conversation:"INSCRIPTION "+JSON.stringify(extra),order_total:0});}catch(e){}
    try{window.gtag&&gtag("event","sign_up",{method:m.google?"google":"form",persona:m.persona});}catch(e){}
    go(st.persona);
  }
  function go(p){close();
    if(typeof _cw==="function")_cw(p);else location.href=p+".html";}
  /* gate: popup cards + home tiles + persona chips */
  var _cw=null;
  try{
    _cw=chooseWho;
    chooseWho=function(p){if(member())return _cw(p);try{sessionStorage.setItem("savy_welcome","1");}catch(e){}var w=$("welcome-overlay");if(w)w.classList.remove("open");open(p);};
  }catch(e){}
  document.addEventListener("click",function(e){
    var a=e.target.closest&&e.target.closest("a.ht,a.ps-chip");
    if(!a||member())return;
    var p=(a.getAttribute("href")||"").replace(".html","");if(!PN[p])return;
    e.preventDefault();e.stopPropagation();open(p);
  },true);
  var _sl=setLang;setLang=function(l){var r=_sl.apply(this,arguments);paint();return r;};
  /* returning member: prefill company on the employee page */
  try{var m0=member();if(m0&&m0.extra&&m0.extra.company&&typeof wpCompany!=="undefined"&&!wpCompany)wpCompany=m0.extra.company;}catch(e){}
})();
