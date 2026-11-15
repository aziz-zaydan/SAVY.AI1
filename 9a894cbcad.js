/* SAVY Nutrition — tracker inside the chat window. Local-first (localStorage). */
(function(){
  var cw=document.getElementById("chat-window");if(!cw)return;
  var CFG=((window.SAVY_CFG||{}).nutrition)||{};
  var FREE=CFG.freeScansPerDay!=null?CFG.freeScansPerDay:3, GATING=!!CFG.gating;
  var SCAN_URL=CFG.scanUrl||"/.netlify/functions/scan";
  function T(f,a,e){return lang==="ar"?a:(lang==="en"?e:f);}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  function r0(x){return Math.round(x);} function r1(x){return Math.round(x*10)/10;}
  function today(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
  function ago(n){var d=new Date();d.setDate(d.getDate()-n);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}

  /* ---------- store ---------- */
  var KEY="savy_nx",S;
  try{S=JSON.parse(localStorage.getItem(KEY)||"null");}catch(e){S=null;}
  if(!S||typeof S!=="object")S={p:null,days:{},w:[],sc:{},prem:false};
  function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
  function day(d){d=d||today();return S.days[d]||(S.days[d]={meals:[],water:0});}

  /* ---------- targets ---------- */
  var ACT={sed:[1.2,"Sédentaire","قليل الحركة","Sedentary"],light:[1.375,"Léger (1-3 j/sem)","نشاط خفيف (1-3 أيام)","Light (1-3 d/wk)"],mod:[1.55,"Modéré (3-5 j/sem)","نشاط متوسط (3-5 أيام)","Moderate (3-5 d/wk)"],high:[1.725,"Intense (6-7 j/sem)","نشاط عالٍ (6-7 أيام)","High (6-7 d/wk)"]};
  var GOAL={lose:["Perdre du poids","إنقاص الوزن","Lose weight",-500],maintain:["Maintenir","الحفاظ على الوزن","Maintain",0],gain:["Prendre du muscle","زيادة الكتلة العضلية","Build muscle",300]};
  var DIET=[["veg","Végétarien","نباتي","Vegetarian"],["vegan","Végan","نباتي صرف","Vegan"],["halal","Halal","حلال","Halal"],["lowcarb","Peu de glucides","قليل الكربوهيدرات","Low carb"],["nolactose","Sans lactose","بدون لاكتوز","Lactose-free"],["nogluten","Sans gluten","بدون غلوتين","Gluten-free"]];
  function targets(p){
    if(!p)return null;
    var bmr=10*p.w+6.25*p.h-5*p.age+(p.sex==="m"?5:(p.sex==="f"?-161:-78));
    var kcal=bmr*(ACT[p.act]||ACT.light)[0]+(GOAL[p.goal]||GOAL.maintain)[3];
    kcal=Math.max(p.sex==="m"?1500:1200,kcal);
    var pr=p.w*(p.goal==="gain"?2:(p.goal==="lose"?1.8:1.5)), fat=kcal*0.27/9, carb=Math.max(50,(kcal-pr*4-fat*9)/4);
    return{kcal:r0(kcal/10)*10,p:r0(pr),c:r0(carb),f:r0(fat),water:r0(p.w*35/250)*250};
  }
  function dayTotals(d){var t={k:0,p:0,c:0,f:0,fi:0,s:0};(day(d).meals||[]).forEach(function(m){t.k+=m.k;t.p+=m.p;t.c+=m.c;t.f+=m.f;t.fi+=m.fi||0;t.s+=m.s||0;});return t;}

  /* ---------- food DB (per 100 g/ml: kcal,P,C,F,fiber,sugar,default grams) ---------- */
  var DB=[
   ["Couscous légumes & poulet","كسكس بالخضر والدجاج",145,9,17,4.5,2.5,2.5,350],["Couscous (cuit)","كسكس سادة",112,3.8,23,0.2,1.4,0.1,200],
   ["Tajine de poulet (olives/citron)","طاجين دجاج بالزيتون والليمون",150,13,4,9,1,1,350],["Tajine de bœuf aux pruneaux","طاجين لحم بالبرقوق",185,14,12,9,1.5,8,350],
   ["Tajine kefta aux œufs","طاجين كفتة بالبيض",180,12,5,13,1,3,350],["Harira","حريرة",65,4,8,2,1.5,2,300],["Rfissa","رفيسة",195,13,18,8,1.5,1,400],
   ["Pastilla","بسطيلة",270,13,24,14,1,6,200],["Bissara","بيصارة",85,4.5,11,2.5,3.5,1,300],["Zaalouk","زعلوك",85,1.8,7,6,3,3.5,150],["Taktouka","طكطوكة",70,1.5,6,4.5,2,4,150],
   ["Msemen","مسمن",320,7,45,12,2,2,90],["Baghrir","بغرير",205,6,35,4,1.5,3,80],["Salade marocaine","سلطة مغربية",45,1,5,2.5,1.5,3.5,150],
   ["Thé à la menthe (sucré)","أتاي بالنعناع (بالسكر)",30,0,7.5,0,0,7.5,200],["Khobz (pain)","خبز",265,8,52,2,2.5,3,100],
   ["Sardines grillées","سردين مشوي",190,25,0,10,0,0,120],["Brochettes de poulet","شواء دجاج",165,25,2,6,0,1,150],["Poulet rôti","دجاج محمّر",190,25,0,10,0,0,150],
   ["Blanc de poulet grillé","صدر دجاج مشوي",165,31,0,3.6,0,0,150],["Poisson grillé","سمك مشوي",130,22,0,4,0,0,150],["Riz cuit","أرز مطبوخ",130,2.7,28,0.3,0.4,0,180],
   ["Pâtes cuites","معكرونة مطبوخة",158,5.8,31,0.9,1.8,0.6,200],["Frites","بطاطس مقلية",312,3.4,41,15,3.8,0.3,120],["Pomme de terre au four","بطاطس بالفرن",93,2.5,21,0.1,2.2,1.2,200],
   ["Pizza","بيتزا",266,11,33,10,2.3,3.6,200],["Burger","برغر",250,13,24,11,1.3,5,200],["Wrap poulet","وراب دجاج",220,13,22,9,2,3,250],
   ["Œuf","بيضة",143,12.6,0.7,9.5,0,0.4,50],["Yaourt nature","زبادي سادة",60,3.5,5,3,0,5,125],["Lait","حليب",50,3.4,5,1.9,0,5,250],["Café au lait","قهوة بالحليب",40,2,4,1.5,0,4,200],
   ["Banane","موز",89,1.1,23,0.3,2.6,12,120],["Pomme","تفاح",52,0.3,14,0.2,2.4,10,180],["Orange","برتقال",47,0.9,12,0.1,2.4,9,150],["Dattes","تمر",282,2.5,75,0.4,8,63,40],
   ["Olives","زيتون",145,1,4,15,3.3,0,30],["Huile d'olive","زيت زيتون",884,0,0,100,0,0,10],["Houmous","حمص مطحون",166,8,14,10,6,0.3,60],["Falafel","فلافل",333,13,32,18,5,0,100],
   ["Thon","تونة",130,28,0,1,0,0,100],["Lentilles cuites","عدس مطبوخ",116,9,20,0.4,8,1.8,200],["Pois chiches cuits","حمص مطبوخ",164,9,27,2.6,7.6,4.8,150],["Avocat","أفوكادو",160,2,9,15,7,0.7,100],
   ["Amandes","لوز",579,21,22,50,12.5,4,30],["Salade verte","سلطة خضراء",20,1.3,3,0.2,1.5,1.5,100],["Gâteau / pâtisserie","حلوى / كعك",380,5,50,18,1.5,32,80],
   ["Soda","مشروب غازي",42,0,10.6,0,0,10.6,330],["Jus d'orange","عصير برتقال",45,0.7,10.4,0.2,0.2,8.4,250]
  ].map(function(r){return{fr:r[0],ar:r[1],k:r[2],p:r[3],c:r[4],f:r[5],fi:r[6],s:r[7],g:r[8]};});
  try{(window.dishes||[]).forEach(function(d){var g=d.course==="main"?320:150;DB.push({fr:"SAVY · "+d.name,ar:"SAVY · "+d.ar,k:d.cal*100/g,p:d.p*100/g,c:d.c*100/g,f:d.f_g*100/g,fi:(d.fiber||0)*100/g,s:(d.sugar||0)*100/g,g:g});});}catch(e){}
  function fname(f){return lang==="ar"?f.ar:f.fr;}
  function norm(s){return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");}
  function itemFromDB(f){return{name:f.fr,ar:f.ar,g:f.g,g0:f.g,k:f.k,p:f.p,c:f.c,f:f.f,fi:f.fi,s:f.s,conf:null,src:"db"};}
  function itemFromAI(a){var g=a.grams||100,x=100/g;return{name:a.name,ar:a.ar||a.name,g:g,g0:g,k:a.kcal*x,p:a.protein*x,c:a.carbs*x,f:a.fat*x,fi:a.fiber*x,s:a.sugar*x,conf:a.conf,src:"ai"};}
  var COOK={none:["Non précisé","غير محدد","Not set",1],grill:["Grillé / bouilli","مشوي / مسلوق","Grilled / boiled",1],bake:["Au four","في الفرن","Baked",1.05],fry:["Frit","مقلي","Fried",1.25]};
  function nutOf(it,cook){var q=it.g/100,F=cook||1,k=it.k*q,f=it.f*q;return{k:k*F,p:it.p*q,c:it.c*q,f:f+(F-1)*k/9,fi:it.fi*q,s:it.s*q};}
  var MT=[["breakfast","Petit-déj","الفطور","Breakfast","🥐"],["lunch","Déjeuner","الغداء","Lunch","🍽️"],["dinner","Dîner","العشاء","Dinner","🌙"],["snack","Snack","وجبة خفيفة","Snack","🍎"]];
  function mtName(m){var i=lang==="ar"?2:(lang==="en"?3:1);return m[i];}
  function autoMT(){var h=new Date().getHours();return h<11?"breakfast":(h<16?"lunch":(h<18?"snack":"dinner"));}

  /* ---------- shell: tabs + panel ---------- */
  var tabs=document.createElement("div");tabs.id="nx-tabs";
  var panel=document.createElement("div");panel.id="nx-panel";
  var hdr=cw.querySelector(".chat-header");hdr.insertAdjacentElement("afterend",tabs);tabs.insertAdjacentElement("afterend",panel);
  var cur="chat";
  var TABS=[["chat",(window.SAVY_ICONS||{}).chat||"💬",["Chat","الشات","Chat"]],["scan",(window.SAVY_ICONS||{}).scan||"📸",["Scanner","سكانر","Scan"]],["day",(window.SAVY_ICONS||{}).day||"📊",["Mon jour","يومي","Today"]],["me",(window.SAVY_ICONS||{}).me||"👤",["Profil","ملفي","Profile"]]];
  function drawTabs(){tabs.style.setProperty("--i",Math.max(0,TABS.map(function(t){return t[0];}).indexOf(cur)));tabs.innerHTML=TABS.map(function(t){var l=t[2][lang==="ar"?1:(lang==="en"?2:0)];return'<button type="button" data-t="'+t[0]+'" class="'+(t[0]===cur?"on":"")+'"><span>'+t[1]+'</span>'+l+'</button>';}).join("");}
  tabs.addEventListener("click",function(e){var b=e.target.closest("button");if(b)go(b.dataset.t);});
  function go(t){
    cur=t;drawTabs();
    var chatEls=[document.getElementById("chat-msgs"),document.getElementById("chat-lead-form"),document.getElementById("chat-input-area")];
    chatEls.forEach(function(el){if(el)el.style.display=(t==="chat")?"":"none";});
    if(t==="chat"){panel.style.display="none";var ia=document.getElementById("chat-input-area");if(ia)ia.style.display="block";return;}
    panel.style.display="block";render();
  }
  function pop(){panel.classList.remove("nx-in");void panel.offsetWidth;panel.classList.add("nx-in");clearTimeout(pop.t);pop.t=setTimeout(function(){panel.classList.remove("nx-in");},1300);
    panel.querySelectorAll("[data-cnt]").forEach(function(el){var to=+el.dataset.cnt,t0=null;function st(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/800),e=1-Math.pow(1-k,3);el.textContent=Math.round(to*e);if(k<1)requestAnimationFrame(st);}
      if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches){el.textContent=to;return;}requestAnimationFrame(st);});}
  function render(){
    if(cur==="scan")vScan();else if(cur==="day")vDay();else if(cur==="me")vMe();
    panel.scrollTop=0;pop();
  }
  window.savyNx={go:go,ctx:ctxOut,photo:function(f){go("scan");onPhoto(f);}};
  var _oc=window.openChat;window.openChat=function(){_oc();drawTabs();};
  var _sl=window.setLang;window.setLang=function(l){_sl(l);drawTabs();if(cur!=="chat")render();};
  drawTabs();

  /* ---------- onboarding / profile ---------- */
  function fld(id,label,type,val,extra){return'<label class="nx-f"><span>'+label+'</span><input id="'+id+'" type="'+type+'" value="'+esc(val==null?"":val)+'" '+(extra||"")+'></label>';}
  function vMe(){
    var p=S.p,t=targets(p);
    var h='<div class="nx-card"><h3>'+(p?T("Mon profil","ملفي الشخصي","My profile"):T("Créons ton profil","لنبدأ بإنشاء ملفك","Let's set up your profile"))+'</h3>'+
    '<p class="nx-sub">'+T("Pour calculer tes objectifs quotidiens. Tes données restent sur cet appareil.","لحساب أهدافك اليومية. بياناتك تبقى على هذا الجهاز.","To compute your daily targets. Your data stays on this device.")+'</p>'+
    '<div class="nx-grid">'+fld("nx-name",T("Prénom","الاسم","Name"),"text",p&&p.name,'maxlength="30"')+fld("nx-age",T("Âge","العمر","Age"),"number",p&&p.age,'min="14" max="90"')+
    fld("nx-h",T("Taille (cm)","الطول (سم)","Height (cm)"),"number",p&&p.h,'min="120" max="230"')+fld("nx-w",T("Poids (kg)","الوزن (كغ)","Weight (kg)"),"number",p&&p.w,'min="30" max="250" step="0.1"')+
    fld("nx-tw",T("Poids cible (kg)","الوزن المستهدف (كغ)","Target weight (kg)"),"number",p&&p.tw,'min="30" max="250" step="0.1"')+
    '<label class="nx-f"><span>'+T("Sexe (optionnel)","الجنس (اختياري)","Sex (optional)")+'</span><select id="nx-sex"><option value="">–</option><option value="m"'+(p&&p.sex==="m"?" selected":"")+'>'+T("Homme","ذكر","Male")+'</option><option value="f"'+(p&&p.sex==="f"?" selected":"")+'>'+T("Femme","أنثى","Female")+'</option></select></label></div>'+
    '<label class="nx-f"><span>'+T("Activité","مستوى النشاط","Activity")+'</span><select id="nx-act">'+Object.keys(ACT).map(function(k){return'<option value="'+k+'"'+((p?p.act:"light")===k?" selected":"")+'>'+ACT[k][lang==="ar"?2:(lang==="en"?3:1)]+'</option>';}).join("")+'</select></label>'+
    '<label class="nx-f"><span>'+T("Objectif","الهدف","Goal")+'</span><select id="nx-goal">'+Object.keys(GOAL).map(function(k){return'<option value="'+k+'"'+((p?p.goal:"maintain")===k?" selected":"")+'>'+GOAL[k][lang==="ar"?1:(lang==="en"?2:0)]+'</option>';}).join("")+'</select></label>'+
    '<div class="nx-f"><span>'+T("Préférences alimentaires","التفضيلات الغذائية","Dietary preferences")+'</span><div class="nx-chips" id="nx-diet">'+DIET.map(function(d){var on=p&&(p.diet||[]).indexOf(d[0])>=0;return'<button type="button" data-v="'+d[0]+'" class="'+(on?"on":"")+'">'+d[lang==="ar"?2:(lang==="en"?3:1)]+'</button>';}).join("")+'</div></div>'+
    fld("nx-all",T("Allergies (ex: arachides, œufs)","الحساسية (مثال: فول سوداني، بيض)","Allergies (e.g. peanuts, eggs)"),"text",p&&p.allergies,'maxlength="120"')+
    fld("nx-bud",T("Budget par jour (MAD, optionnel)","الميزانية اليومية (درهم، اختياري)","Daily budget (MAD, optional)"),"number",p&&p.budget,'min="0"')+
    '<p id="nx-err" class="nx-err"></p><button type="button" class="nx-btn" id="nx-save">'+T("Enregistrer et calculer mes objectifs","حفظ وحساب أهدافي","Save & calculate my targets")+'</button></div>';
    if(p&&t){
      h='<div class="nx-card nx-tg"><h3>🎯 '+T("Tes objectifs quotidiens","أهدافك اليومية","Your daily targets")+'</h3><div class="nx-tgr"><b data-cnt="'+t.kcal+'">'+t.kcal+'</b><small>kcal</small></div><div class="nx-mini"><span>🥩 '+t.p+'g '+T("prot.","بروتين","prot.")+'</span><span>🍞 '+t.c+'g '+T("gluc.","كارب","carbs")+'</span><span>🥑 '+t.f+'g '+T("lip.","دهون","fat")+'</span><span>💧 '+r1(t.water/1000)+'L</span></div>'+
        '<p class="nx-note">'+T("Estimation générale (Mifflin-St Jeor). Ce n'est pas un avis médical.","تقدير عام (معادلة ميفلين). ليس نصيحة طبية.","General estimate (Mifflin-St Jeor). Not medical advice.")+'</p></div>'+vWeight()+premiumCard()+h;
    }
    panel.innerHTML=h;
    var dd=document.getElementById("nx-diet");if(dd)dd.addEventListener("click",function(e){var b=e.target.closest("button");if(b)b.classList.toggle("on");});
    var sv=document.getElementById("nx-save");if(sv)sv.addEventListener("click",saveProfile);
    var wb=document.getElementById("nx-wadd");if(wb)wb.addEventListener("click",addWeight);
  }
  function saveProfile(){
    function v(id){return document.getElementById(id).value;}
    var p={name:v("nx-name").trim(),age:+v("nx-age"),h:+v("nx-h"),w:+v("nx-w"),tw:+v("nx-tw")||+v("nx-w"),sex:v("nx-sex"),act:v("nx-act"),goal:v("nx-goal"),
      diet:[].slice.call(document.querySelectorAll("#nx-diet .on")).map(function(b){return b.dataset.v;}),allergies:v("nx-all").trim().slice(0,120),budget:+v("nx-bud")||0};
    var er=document.getElementById("nx-err");
    if(!(p.age>=14&&p.age<=90&&p.h>=120&&p.h<=230&&p.w>=30&&p.w<=250)){er.textContent=T("Vérifie âge, taille et poids.","تحقق من العمر والطول والوزن.","Check age, height and weight.");return;}
    S.p=p;if(!S.w.length)S.w.push({d:today(),kg:p.w});save();go("day");buzz();toast("🎯 "+T("Objectifs calculés","تم حساب أهدافك","Targets calculated"));
  }
  function vWeight(){
    var w=S.w.slice(-12),p=S.p,last=w.length?w[w.length-1].kg:p.w,first=S.w.length?S.w[0].kg:p.w;
    var tot=Math.abs(p.tw-first)||1,done=Math.min(1,Math.max(0,Math.abs(last-first)/tot)),dir=(p.tw-first);
    var ok=(dir<0&&last<first)||(dir>0&&last>first)||dir===0;
    return'<div class="nx-card"><h3>⚖️ '+T("Poids","الوزن","Weight")+'</h3>'+wChart(w)+'<div class="nx-row"><span>'+T("Actuel","الحالي","Current")+' <b>'+r1(last)+' kg</b></span><span>'+T("Cible","الهدف","Target")+' <b>'+r1(p.tw)+' kg</b></span></div>'+
      '<div class="nx-bar"><i style="width:'+r0((ok?done:0)*100)+'%"></i></div><p class="nx-note">'+T("Progression vers l'objectif","التقدّم نحو الهدف","Progress to goal")+': '+r0((ok?done:0)*100)+'%</p>'+
      '<div class="nx-addw"><input id="nx-wv" type="number" step="0.1" min="30" max="250" placeholder="kg"><button type="button" class="nx-btn sm" id="nx-wadd">'+T("Ajouter","إضافة","Add")+'</button></div></div>';
  }
  function addWeight(){var v=+document.getElementById("nx-wv").value;if(!(v>=30&&v<=250))return;var t=today(),l=S.w[S.w.length-1];if(l&&l.d===t)l.kg=v;else S.w.push({d:t,kg:v});S.p.w=v;save();vMe();}
  function wChart(w){
    if(w.length<2)return'<p class="nx-note">'+T("Ajoute ton poids chaque semaine pour voir la courbe.","أضف وزنك أسبوعياً لترى المنحنى.","Add your weight weekly to see the curve.")+'</p>';
    var mn=Math.min.apply(null,w.map(function(x){return x.kg;}))-1,mx=Math.max.apply(null,w.map(function(x){return x.kg;}))+1;
    var pts=w.map(function(x,i){return r1(8+i*(284/(w.length-1)))+","+r1(70-(x.kg-mn)/(mx-mn)*60);}).join(" ");
    return'<svg class="nx-line" viewBox="0 0 300 80"><polyline points="'+pts+'" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>'+pts.split(" ").map(function(q){var a=q.split(",");return'<circle cx="'+a[0]+'" cy="'+a[1]+'" r="3.2" fill="currentColor"/>';}).join("")+'</svg>';
  }
  function premiumCard(){
    if(!GATING)return'';
    return'<div class="nx-card nx-prem"><h3>⭐ Premium</h3><p class="nx-sub">'+T("Plus de scans, plans repas, analyses avancées.","مزيد من السكانات، خطط الوجبات، تحليلات متقدمة.","More scans, meal plans, advanced analytics.")+'</p><p class="nx-note">'+T("Paiement non encore activé — contacte-nous sur WhatsApp.","الدفع غير مفعّل بعد — تواصل معنا عبر واتساب.","Payments not active yet — contact us on WhatsApp.")+'</p></div>';
  }

  /* ---------- scan ---------- */
  var draft=null; // {items:[], notes, img, cook, size, mt, ai}
  function scansToday(){return S.sc[today()]||0;}
  function vScan(){
    if(!draft){
      var left=Math.max(0,FREE-scansToday());
      panel.innerHTML='<div class="nx-card nx-hero"><div class="nx-cam">📸</div><h3>'+T("Scanne ton repas","صوّر وجبتك","Scan your meal")+'</h3><p class="nx-sub">'+T("Prends une photo : l'IA estime calories et macros. Tu peux tout corriger ensuite.","التقط صورة: يقدّر الذكاء الاصطناعي السعرات والماكروز. يمكنك تصحيح كل شيء بعدها.","Take a photo: AI estimates calories and macros. You can correct everything afterwards.")+'</p>'+
        '<div class="nx-two"><label class="nx-btn">📷 '+T("Caméra","الكاميرا","Camera")+'<input type="file" accept="image/*" capture="environment" id="nx-cam" hidden></label><label class="nx-btn alt">🖼️ '+T("Galerie","المعرض","Gallery")+'<input type="file" accept="image/*" id="nx-gal" hidden></label></div>'+
        (GATING?'<p class="nx-note">'+T("Scans gratuits restants aujourd'hui","السكانات المجانية المتبقية اليوم","Free scans left today")+': <b>'+(S.prem?"∞":left)+'</b></p>':'')+
        '<p class="nx-note">'+T("Estimation IA — pas une mesure de laboratoire.","تقدير بالذكاء الاصطناعي — وليس قياساً مخبرياً.","AI estimate — not a laboratory measurement.")+'</p></div>'+
        '<div class="nx-card"><h3>✍️ '+T("Ajouter manuellement","إضافة يدوية","Add manually")+'</h3><input id="nx-q" class="nx-search" type="search" placeholder="'+T("Cherche : couscous, harira, msemen…","ابحث: كسكس، حريرة، مسمن…","Search: couscous, harira, msemen…")+'"><div id="nx-res" class="nx-res"></div></div>';
      var c1=document.getElementById("nx-cam"),c2=document.getElementById("nx-gal");
      [c1,c2].forEach(function(i){i.addEventListener("change",function(){if(i.files&&i.files[0])onPhoto(i.files[0]);});});
      var q=document.getElementById("nx-q");q.addEventListener("input",function(){showRes(q.value);});showRes("");
      return;
    }
    vDraft();
  }
  function showRes(q){
    var n=norm(q.trim()),list=DB.filter(function(f){return!n||norm(f.fr).indexOf(n)>=0||f.ar.indexOf(q.trim())>=0;}).slice(0,n?10:8);
    var box=document.getElementById("nx-res");if(!box)return;
    box.innerHTML=list.map(function(f){var i=DB.indexOf(f);return'<button type="button" data-i="'+i+'"><b>'+esc(fname(f))+'</b><small>'+r0(f.k*f.g/100)+' kcal · '+f.g+'g</small></button>';}).join("")||'<p class="nx-note">'+T("Aucun résultat","لا نتائج","No results")+'</p>';
    box.onclick=function(e){var b=e.target.closest("button");if(!b)return;draft={items:[itemFromDB(DB[+b.dataset.i])],notes:"",cook:"none",size:1,mt:autoMT(),ai:false};vScan();pop();};
  }
  function shrink(file){
    return new Promise(function(res,rej){
      var fr=new FileReader();fr.onerror=rej;fr.onload=function(){var im=new Image();im.onerror=rej;im.onload=function(){
        var M=1024,s=Math.min(1,M/Math.max(im.width,im.height)),cv=document.createElement("canvas");cv.width=Math.round(im.width*s);cv.height=Math.round(im.height*s);
        cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height);res(cv.toDataURL("image/jpeg",0.8));};im.src=fr.result;};fr.readAsDataURL(file);
    });
  }
  function onPhoto(file){
    if(GATING&&!S.prem&&scansToday()>=FREE){panel.innerHTML='<div class="nx-card nx-prem"><h3>⭐ '+T("Limite atteinte","وصلت للحد اليومي","Daily limit reached")+'</h3><p class="nx-sub">'+T("Tu as utilisé tes scans gratuits du jour. Ajoute le repas manuellement ou passe Premium.","استعملت سكاناتك المجانية اليوم. أضف الوجبة يدوياً أو انتقل إلى Premium.","You've used today's free scans. Add the meal manually or go Premium.")+'</p><p class="nx-note">'+T("Paiement non encore activé.","الدفع غير مفعّل بعد.","Payments not active yet.")+'</p><button class="nx-btn" id="nx-back">'+T("Retour","رجوع","Back")+'</button></div>';document.getElementById("nx-back").onclick=vScan;return;}
    var steps=[T("🔍 Je repère les aliments…","🔍 نتعرّف على الأطعمة…","🔍 Spotting the foods…"),T("⚖️ J'estime les portions…","⚖️ نقدّر الكميات…","⚖️ Estimating portions…"),T("🧮 Je calcule calories et macros…","🧮 نحسب السعرات والماكروز…","🧮 Calculating calories & macros…")];
    panel.innerHTML='<div class="nx-card nx-load"><div class="nx-spin"></div><p id="nx-ls">'+steps[0]+'</p><div class="nx-skel"><i></i><i></i><i></i></div></div>';
    var si=0,sIv=setInterval(function(){var e=document.getElementById("nx-ls");if(!e){clearInterval(sIv);return;}si=(si+1)%steps.length;e.textContent=steps[si];},1400);
    shrink(file).then(function(img){
      return fetch(SCAN_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:img,lang:lang})}).then(function(r){return r.json().then(function(j){return{ok:r.ok,j:j,img:img};});});
    }).then(function(o){
      if(!o.ok||o.j.error)return fail(o.j&&o.j.error);
      S.sc[today()]=scansToday()+1;save();
      if(!o.j.items||!o.j.items.length){return fail("no_food");}
      draft={items:o.j.items.map(itemFromAI),notes:o.j.notes||"",img:o.img,cook:"none",size:1,mt:autoMT(),ai:true};vScan();pop();
    }).catch(function(){fail("network");});
  }
  function fail(code){
    var m={no_key:T("Le scanner IA n'est pas encore connecté (clé API manquante côté serveur). Tu peux ajouter ton repas manuellement.","السكانر الذكي غير متصل بعد (مفتاح API غير مضبوط في الخادم). يمكنك إضافة وجبتك يدوياً.","The AI scanner isn't connected yet (server API key missing). You can add your meal manually."),
      no_food:T("Je ne vois pas d'aliment sur cette photo. Réessaie avec une photo plus nette.","لا أرى طعاماً في هذه الصورة. جرّب صورة أوضح.","I can't see food in this photo. Try a clearer one."),
      too_large:T("Photo trop lourde.","الصورة كبيرة جداً.","Photo too large."),rate_limited:T("Trop de scans pour le moment, réessaie dans une minute.","محاولات كثيرة الآن، أعد المحاولة بعد دقيقة.","Too many scans right now, try again in a minute."),forbidden_origin:T("Service indisponible depuis ce site.","الخدمة غير متاحة من هذا الموقع.","Service unavailable from this site.")};
    panel.innerHTML='<div class="nx-card"><h3>⚠️</h3><p class="nx-sub">'+(m[code]||T("Analyse impossible pour le moment. Réessaie ou ajoute manuellement.","تعذّر التحليل حالياً. أعد المحاولة أو أضف يدوياً.","Analysis failed right now. Try again or add manually."))+'</p><button class="nx-btn" id="nx-back">'+T("Retour","رجوع","Back")+'</button></div>';
    document.getElementById("nx-back").onclick=vScan;
  }
  function draftTotals(){var t={k:0,p:0,c:0,f:0,fi:0,s:0},F=COOK[draft.cook][3];draft.items.forEach(function(it){var n=nutOf(it,F);for(var k in t)t[k]+=n[k];});return t;}
  function vDraft(){
    var t=draftTotals(),F=COOK[draft.cook][3];
    var rows=draft.items.map(function(it,i){var n=nutOf(it,F);return'<div class="nx-it"><div class="nx-it1"><input class="nx-nm" data-i="'+i+'" value="'+esc(lang==="ar"?it.ar:it.name)+'"><button type="button" class="nx-x" data-del="'+i+'" aria-label="x">✕</button></div>'+
      '<div class="nx-it2"><input class="nx-g" type="number" min="5" max="2000" data-g="'+i+'" value="'+r0(it.g)+'"><span>g</span><b>'+r0(n.k)+' kcal</b><small>P'+r0(n.p)+' · C'+r0(n.c)+' · F'+r0(n.f)+'</small>'+(it.conf!=null&&it.conf<0.6?'<em title="'+T("Confiance faible","ثقة منخفضة","Low confidence")+'">⚠️</em>':'')+'</div></div>';}).join("");
    panel.innerHTML=(draft.img?'<img class="nx-prev" src="'+draft.img+'" alt="">':'')+
      (draft.ai?'<div class="nx-warn">⚠️ '+T("Estimation IA : vérifie les aliments et les quantités ci-dessous, puis corrige si besoin.","تقدير بالذكاء الاصطناعي: راجع الأطعمة والكميات أدناه وصحّحها عند الحاجة.","AI estimate: check the foods and amounts below and correct if needed.")+(draft.notes?'<br><small>'+esc(draft.notes)+'</small>':'')+'</div>':'')+
      '<div class="nx-card"><div class="nx-sec">'+T("Aliments","الأطعمة","Foods")+'</div>'+rows+
      '<button type="button" class="nx-btn alt sm" id="nx-addi">+ '+T("Ajouter un aliment","إضافة طعام","Add a food")+'</button><div id="nx-addbox"></div></div>'+
      '<div class="nx-card"><div class="nx-sec">'+T("Portion","الحصة","Portion")+'</div><div class="nx-chips" id="nx-size">'+[["0.75","S"],["1","M"],["1.3","L"]].map(function(s){return'<button type="button" data-v="'+s[0]+'" class="'+(+s[0]===draft.size?"on":"")+'">'+s[1]+'</button>';}).join("")+'</div>'+
      '<div class="nx-sec">'+T("Cuisson","طريقة الطهي","Cooking")+'</div><div class="nx-chips" id="nx-cook">'+Object.keys(COOK).map(function(k){return'<button type="button" data-v="'+k+'" class="'+(k===draft.cook?"on":"")+'">'+COOK[k][lang==="ar"?1:(lang==="en"?2:0)]+'</button>';}).join("")+'</div>'+
      '<div class="nx-sec">'+T("Repas","نوع الوجبة","Meal")+'</div><div class="nx-chips" id="nx-mt">'+MT.map(function(m){return'<button type="button" data-v="'+m[0]+'" class="'+(m[0]===draft.mt?"on":"")+'">'+m[4]+' '+mtName(m)+'</button>';}).join("")+'</div></div>'+
      '<div class="nx-card nx-tot"><b data-cnt="'+r0(t.k)+'">'+r0(t.k)+'</b><small>kcal</small><div class="nx-mini"><span>🥩 '+r0(t.p)+'g</span><span>🍞 '+r0(t.c)+'g</span><span>🥑 '+r0(t.f)+'g</span><span>🌾 '+r0(t.fi)+'g</span><span>🍬 '+r0(t.s)+'g</span></div></div>'+
      picksCard(picks("similar",{k:t.k}),"🛵 "+T("Pas le temps de cuisiner ? Commande l'équivalent SAVY","ما عندك وقت للطبخ؟ اطلب ما يشبهها من SAVY","No time to cook? Order the SAVY equivalent"),T("Calories proches, prêt en 45 min.","سعرات قريبة وجاهز خلال 45 دقيقة.","Similar calories, ready in 45 min."),null)+'<div class="nx-two"><button type="button" class="nx-btn alt" id="nx-cancel">'+T("Annuler","إلغاء","Cancel")+'</button><button type="button" class="nx-btn" id="nx-ok">✓ '+T("Enregistrer","حفظ في اليوميات","Save to diary")+'</button></div>';
    panel.onclick=null;bindPicks();
    panel.querySelectorAll(".nx-g").forEach(function(e){e.addEventListener("change",function(){var i=+e.dataset.g,v=Math.min(2000,Math.max(5,+e.value||0));draft.items[i].g=v;draft.items[i].g0=v/draft.size;vDraft();});});
    panel.querySelectorAll(".nx-nm").forEach(function(e){e.addEventListener("change",function(){var it=draft.items[+e.dataset.i];if(lang==="ar")it.ar=e.value;else it.name=e.value;});});
    panel.querySelectorAll("[data-del]").forEach(function(e){e.addEventListener("click",function(){draft.items.splice(+e.dataset.del,1);if(!draft.items.length)draft=null;vScan();});});
    function chips(id,fn){var el=document.getElementById(id);el.addEventListener("click",function(ev){var b=ev.target.closest("button");if(b)fn(b.dataset.v);});}
    chips("nx-size",function(v){draft.size=+v;draft.items.forEach(function(it){it.g=r0(it.g0*draft.size);});vDraft();});
    chips("nx-cook",function(v){draft.cook=v;vDraft();});chips("nx-mt",function(v){draft.mt=v;vDraft();});
    document.getElementById("nx-cancel").onclick=function(){draft=null;vScan();};
    document.getElementById("nx-addi").onclick=function(){var b=document.getElementById("nx-addbox");b.innerHTML='<input id="nx-q2" class="nx-search" type="search" placeholder="'+T("Cherche un aliment…","ابحث عن طعام…","Search a food…")+'"><div id="nx-res2" class="nx-res"></div>';var q=document.getElementById("nx-q2");
      function sr(){var n=norm(q.value.trim()),l=DB.filter(function(f){return!n||norm(f.fr).indexOf(n)>=0||f.ar.indexOf(q.value.trim())>=0;}).slice(0,8);var r=document.getElementById("nx-res2");r.innerHTML=l.map(function(f){return'<button type="button" data-i="'+DB.indexOf(f)+'"><b>'+esc(fname(f))+'</b><small>'+r0(f.k*f.g/100)+' kcal</small></button>';}).join("");r.onclick=function(e){var bb=e.target.closest("button");if(!bb)return;var it=itemFromDB(DB[+bb.dataset.i]);it.g0=it.g/draft.size;it.g=r0(it.g0*draft.size);draft.items.push(it);vDraft();};}
      q.addEventListener("input",sr);sr();q.focus();};
    document.getElementById("nx-ok").onclick=function(){
      var F=COOK[draft.cook][3],d=day();
      draft.items.forEach(function(it){var n=nutOf(it,F);d.meals.push({id:Date.now()+Math.random(),mt:draft.mt,name:(lang==="ar"?it.ar:it.name),g:r0(it.g),k:n.k,p:n.p,c:n.c,f:n.f,fi:n.fi,s:n.s,src:it.src,b:{k:it.k*F,p:it.p,c:it.c,f:it.f+(F-1)*it.k/9,fi:it.fi,s:it.s}});});
      save();draft=null;go("day");buzz();var tt2=targets(S.p);toast("✓ "+T("Repas enregistré","تم حفظ الوجبة","Meal saved")+(tt2?" · "+T("reste ","بقي ","left ")+r0(Math.max(0,tt2.kcal-dayTotals().k))+" kcal":""));};
  }

  /* ---------- dashboard ---------- */
  function ring(pct,k,left,over){
    var R=52,C=2*Math.PI*R,o=C*(1-Math.min(1,pct));
    return'<svg viewBox="0 0 130 130" class="nx-ring"><circle cx="65" cy="65" r="'+R+'" class="bg"/><circle cx="65" cy="65" r="'+R+'" class="fg'+(over?" over":"")+'" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+o.toFixed(1)+'" style="--c:'+C.toFixed(1)+'" transform="rotate(-90 65 65)"/></svg><div class="nx-ringt"><b data-cnt="'+r0(Math.abs(left))+'">'+r0(Math.abs(left))+'</b><small>'+(left>=0?T("restantes","متبقّية","left"):T("en trop","زائدة","over"))+'</small></div>';
  }
  function mbar(label,val,max,cls){var p=max?Math.min(1,val/max):0;return'<div class="nx-mb"><div><span>'+label+'</span><b>'+r0(val)+' / '+r0(max)+' g</b></div><div class="nx-bar '+cls+'"><i style="width:'+r0(p*100)+'%"></i></div></div>';}
  function dayPicks(t,tot){
    var rem=t.kcal-tot.k,pleft=t.p-tot.p;
    if(rem<-80)return picksCard(picks("fill",{rem:0,pleft:0}).slice(0,0),"","");
    if(!tot.k){var g=picks("goal",{goal:S.p.goal});return picksCard(g,"🛵 "+T("Prêt en 45 min, adapté à ton objectif","جاهز خلال 45 دقيقة ويناسب هدفك","Ready in 45 min, fits your goal"),T("Choisis ton premier repas de la journée.","اختر أول وجبة في يومك.","Pick your first meal of the day."),function(d){return"💪 "+d.p+"g "+T("protéines","بروتين","protein");});}
    var l=picks("fill",{rem:rem,pleft:pleft});
    return picksCard(l,"🛵 "+T("Complète ta journée avec SAVY","أكمل يومك مع SAVY","Complete your day with SAVY"),T("Il te reste ","بقي لك ","You have ")+"<b>"+r0(Math.max(0,rem))+" kcal</b> · <b>"+r0(Math.max(0,pleft))+"g</b> "+T("de protéines","بروتين","protein"),function(d){return"✓ "+T("Rentre dans ton budget calories","يدخل في سعراتك المتبقية","Fits your remaining calories");});
  }
  function vDay(){
    if(!S.p){panel.innerHTML='<div class="nx-card nx-hero"><div class="nx-cam">🎯</div><h3>'+T("Commence par ton profil","ابدأ بملفك الشخصي","Start with your profile")+'</h3><p class="nx-sub">'+T("Il faut quelques infos pour calculer tes objectifs.","نحتاج بعض المعلومات لحساب أهدافك.","We need a few details to compute your targets.")+'</p><button class="nx-btn" id="nx-go">'+T("Créer mon profil","إنشاء ملفي","Create my profile")+'</button></div>';document.getElementById("nx-go").onclick=function(){go("me");};return;}
    var t=targets(S.p),tot=dayTotals(),d=day(),left=t.kcal-tot.k;
    var h='<div class="nx-card nx-dash"><div class="nx-ringw">'+ring(tot.k/t.kcal,tot.k,left,left<0)+'</div><div class="nx-kv"><div><small>'+T("Objectif","الهدف","Target")+'</small><b data-cnt="'+t.kcal+'">'+t.kcal+'</b></div><div><small>'+T("Consommées","المستهلك","Eaten")+'</small><b data-cnt="'+r0(tot.k)+'">'+r0(tot.k)+'</b></div></div></div>'+
      '<div class="nx-card">'+mbar("🥩 "+T("Protéines","بروتين","Protein"),tot.p,t.p,"p")+mbar("🍞 "+T("Glucides","كربوهيدرات","Carbs"),tot.c,t.c,"c")+mbar("🥑 "+T("Lipides","دهون","Fat"),tot.f,t.f,"f")+
      '<div class="nx-mini"><span>🌾 '+r0(tot.fi)+'g '+T("fibres","ألياف","fiber")+'</span><span>🍬 '+r0(tot.s)+'g '+T("sucres","سكر","sugar")+'</span></div></div>'+
      dayPicks(t,tot)+'<div class="nx-card"><div class="nx-sec">💧 '+T("Eau","الماء","Water")+' · '+r1(d.water/1000)+' / '+r1(t.water/1000)+' L</div><div class="nx-water">'+Array.from({length:Math.max(1,t.water/250)},function(_,i){return'<button type="button" data-w="'+i+'" class="'+(d.water>=(i+1)*250?"on":"")+'">💧</button>';}).join("")+'</div></div>'+
      '<div class="nx-two"><button class="nx-btn" id="nx-sc">📸 '+T("Scanner un repas","سكانر وجبة","Scan a meal")+'</button><button class="nx-btn alt" id="nx-plan">🗓️ '+T("Plan du jour","خطة اليوم","Meal plan")+'</button></div>'+
      MT.map(function(m){var ms=d.meals.filter(function(x){return x.mt===m[0];});if(!ms.length)return'';var sum=ms.reduce(function(a,x){return a+x.k;},0);
        return'<div class="nx-card"><div class="nx-sec">'+m[4]+' '+mtName(m)+' <b>'+r0(sum)+' kcal</b></div>'+ms.map(function(x){return'<div class="nx-meal"><div><b>'+esc(x.name)+'</b><small>P'+r0(x.p)+' · C'+r0(x.c)+' · F'+r0(x.f)+'</small></div><input type="number" class="nx-mg" data-m="'+x.id+'" value="'+x.g+'" min="5" max="2000"><span>g</span><strong>'+r0(x.k)+'</strong><button type="button" class="nx-x" data-md="'+x.id+'">✕</button></div>';}).join("")+'</div>';}).join("")+
      (d.meals.length?'':'<p class="nx-note c">'+T("Aucun repas enregistré aujourd'hui.","لا توجد وجبات مسجّلة اليوم.","No meals logged today.")+'</p>')+weekly(t)+
      '<p class="nx-note c">'+T("Valeurs estimées — ajuste-les si besoin. Informations générales, pas un avis médical.","قيم تقديرية — عدّلها عند الحاجة. معلومات عامة وليست نصيحة طبية.","Estimated values — adjust if needed. General information, not medical advice.")+'</p>';
    panel.innerHTML=h;bindPicks();
    panel.querySelectorAll("[data-w]").forEach(function(b){b.addEventListener("click",function(){var n=(+b.dataset.w+1)*250;d.water=(d.water===n)?n-250:n;save();vDay();});});
    panel.querySelectorAll("[data-md]").forEach(function(b){b.addEventListener("click",function(){d.meals=d.meals.filter(function(x){return String(x.id)!==b.dataset.md;});save();vDay();});});
    panel.querySelectorAll("[data-m]").forEach(function(i){i.addEventListener("change",function(){var m=d.meals.filter(function(x){return String(x.id)===i.dataset.m;})[0];if(!m)return;var g=Math.min(2000,Math.max(5,+i.value||m.g)),q=g/m.g;["k","p","c","f","fi","s"].forEach(function(k){m[k]*=q;});m.g=g;save();vDay();});});
    document.getElementById("nx-sc").onclick=function(){go("scan");};
    document.getElementById("nx-plan").onclick=function(){go("chat");chatSendText(T("Génère mon plan repas pour aujourd'hui selon mes objectifs.","ولّد لي خطة وجبات لليوم حسب أهدافي.","Generate my meal plan for today based on my targets."));};
  }
  function weekly(t){
    var days=[],names=lang==="ar"?["أحد","إثن","ثلا","أرب","خمي","جمع","سبت"]:(lang==="en"?["Su","Mo","Tu","We","Th","Fr","Sa"]:["Di","Lu","Ma","Me","Je","Ve","Sa"]);
    var logged=0,sum=0,mx=t.kcal;
    for(var i=6;i>=0;i--){var k=ago(i),tt=dayTotals(k),has=(S.days[k]&&S.days[k].meals.length>0);if(has){logged++;sum+=tt.k;}mx=Math.max(mx,tt.k);days.push({k:k,v:tt.k,n:names[new Date(k+"T12:00:00").getDay()],has:has,today:i===0});}
    var line=t.kcal/mx*100;
    return'<div class="nx-card"><div class="nx-sec">📈 '+T("Cette semaine","هذا الأسبوع","This week")+'</div><div class="nx-wk">'+days.map(function(x){var o=x.v>t.kcal*1.1;return'<div class="'+(x.today?"t":"")+'"><i class="'+(o?"o":"")+'" style="--h:'+(x.has?Math.max(4,x.v/mx*100):2).toFixed(1)+'"></i><small>'+x.n+'</small></div>';}).join("")+'<u style="bottom:calc(16px + (100% - 16px) * '+(line/100).toFixed(3)+')"></u></div>'+
      '<div class="nx-row"><span>'+T("Moyenne","المتوسط","Average")+' <b>'+(logged?r0(sum/logged):"–")+' kcal</b></span><span>'+T("Régularité","الانتظام","Consistency")+' <b>'+logged+'/7</b></span></div></div>';
  }

  /* ---------- CTA layer: SAVY picks, cart bar, toast ---------- */
  function dById(id){for(var i=0;i<dishes.length;i++)if(dishes[i].id===id)return dishes[i];return null;}
  function dName(d){return lang==="ar"?d.ar:d.name;}
  function inCart(id){return typeof cart!=="undefined"&&cart.indexOf(id)>=0;}
  function picks(mode,arg){
    var pool=dishes.filter(function(d){return d&&d.cal;});if(!pool.length)return[];
    var mains=pool.filter(function(d){return d.course==="main";}),others=pool.filter(function(d){return d.course!=="main";});
    function top(list,sc,n){return list.slice().sort(function(a,b){return sc(b)-sc(a);}).slice(0,n);}
    if(mode==="fill"){
      var rem=arg.rem,pl=Math.max(0,arg.pleft),res=[];
      if(rem<140)return top(others.filter(function(d){return d.cal<=Math.max(120,rem+40);}),function(d){return d.p-d.cal/40;},2);
      var m=top(mains.filter(function(d){return d.cal<=rem+60;}),function(d){return Math.min(d.p,pl)*2-Math.abs(d.cal-Math.min(rem,720)*0.85)/18;},1);
      if(!m.length)m=top(pool.filter(function(d){return d.cal<=rem+60;}),function(d){return d.p-d.cal/30;},1);
      if(!m.length)return top(pool,function(d){return-d.cal;},1);
      res=m.slice();var left=rem-m[0].cal;
      if(left>=90){var o=top(others.filter(function(d){return d.cal<=left+40&&d.id!==m[0].id;}),function(d){return d.p*1.5-d.cal/30;},1);res=res.concat(o);}
      return res;
    }
    if(mode==="goal"){
      var g=arg.goal;
      return top(mains,function(d){return g==="gain"?d.p:(g==="lose"?d.p/d.cal*100-(d.cal>700?3:0):d.p/d.cal*50-Math.abs(d.cal-620)/40);},3);
    }
    var K=arg.k||500;
    return top(pool.filter(function(d){return d.course!=="dessert"||K<350;}),function(d){return-Math.abs(d.cal-K);},2);
  }
  function pickCard(d,why){
    var on=inCart(d.id);
    return'<div class="cx-card nx-pk" data-id="'+d.id+'"><img src="'+d.img+'" alt="" loading="lazy"><div class="cx-i"><b>'+esc(dName(d))+'</b><span>'+d.price+' MAD · '+d.cal+' kcal · '+d.p+'g P</span>'+(why?'<em>'+why+'</em>':'')+(window.savyLowLeft&&savyLowLeft(d.id)?'<em class="cx-low">🔥 '+T("Plus que ","بقي ","Only ")+savyLowLeft(d.id)+T(" portions"," حصص"," left")+'</em>':'')+'</div><button type="button" class="cx-add'+(on?" on":"")+'" aria-label="add">'+(on?"✓":"+")+'</button></div>';
  }
  function picksCard(list,title,sub,whyFn){
    if(!list.length)return"";
    return'<div class="nx-card nx-picks"><div class="nx-sec">'+title+'</div>'+(sub?'<p class="nx-sub" style="margin-top:-2px">'+sub+'</p>':'')+'<div class="cx-cards">'+list.map(function(d){return pickCard(d,whyFn?whyFn(d):"");}).join("")+'</div><button type="button" class="nx-btn sm nx-seemenu">'+T("Voir tout le menu","شاهد كل المنيو","See full menu")+' ›</button></div>';
  }
  function bindPicks(){
    panel.querySelectorAll(".nx-pk .cx-add").forEach(function(b){b.addEventListener("click",function(){
      var id=+b.closest(".nx-pk").dataset.id;toggleCart(id);
      var on=inCart(id);b.classList.toggle("on",on);b.textContent=on?"✓":"+";
      if(on){buzz();toast("🛒 "+T("Ajouté au panier","تمت الإضافة للسلة","Added to cart"));}
      refreshBar();});});
    var sm=panel.querySelector(".nx-seemenu");if(sm)sm.addEventListener("click",function(){closeChat();var el=document.getElementById("dishes-list")||document.getElementById("menu");if(el)el.scrollIntoView({behavior:"smooth",block:"start"});});
  }
  window.savyNxToast=function(m){toast(m);};
  function buzz(){try{if(navigator.vibrate)navigator.vibrate(12);}catch(e){}}
  var toastEl=document.createElement("div");toastEl.id="nx-toast";cw.appendChild(toastEl);var tt;
  function toast(msg){toastEl.textContent=msg;toastEl.classList.add("on");clearTimeout(tt);tt=setTimeout(function(){toastEl.classList.remove("on");},2200);}
  var bar=document.createElement("button");bar.type="button";bar.id="cx-cart";
  var ia=document.getElementById("chat-input-area");cw.insertBefore(bar,ia);
  function cartTotal(){var t=0;(typeof cart!=="undefined"?cart:[]).forEach(function(id){var d=dById(id);if(d)t+=d.price;});return t;}
  function firstOrder(){var n=0;try{n=parseInt(localStorage.getItem("savy_orders")||"0",10)||0;}catch(e){}var pr=((window.SAVY_CFG||{}).promo)||{};return n===0&&pr.SAVY10;}
  function refreshBar(){
    var n=(typeof cart!=="undefined")?cart.length:0;
    if(!n){bar.classList.remove("on");bar.innerHTML="";return;}
    bar.innerHTML='<span class="n">'+n+'</span><span class="t"><b>'+T("Finaliser ma commande","أكمل طلبك الآن","Complete my order")+'</b><small>'+(firstOrder()?"🎁 "+T("-10% sur la 1ère commande (SAVY10)","خصم 10% على أول طلب (SAVY10)","-10% on your first order (SAVY10)"):T("Livraison en 45 min · cash à la livraison","توصيل خلال 45 دقيقة · الدفع عند التسليم","45-min delivery · cash on delivery"))+'</small></span><span class="p">'+cartTotal()+' MAD</span><i>›</i>';
    bar.classList.add("on");
  }
  bar.addEventListener("click",function(){
    closeChat();var b=document.getElementById("mob-bar-btn");
    if(b){b.click();return;}
    var P=(typeof persona!=="undefined"&&persona)||"employee";location.href=P+".html?cart="+cart.join(",");
  });
  if(typeof toggleCart==="function"){var _tc=toggleCart;toggleCart=function(){var r=_tc.apply(this,arguments);try{refreshBar();}catch(e){}return r;};}
  var _oc2=window.openChat;window.openChat=function(){_oc2();refreshBar();};
  setInterval(function(){if(cw.classList.contains("open"))refreshBar();},1500);
  function statusTxt(){var el=document.getElementById("chat-status-txt");if(el)el.textContent=T("En ligne · Coach nutrition & chef","متصل · مدرب تغذية وشيف","Online · Nutrition coach & chef");}
  statusTxt();var _sl3=window.setLang;window.setLang=function(l){_sl3(l);statusTxt();refreshBar();};

  /* ---------- coach context ---------- */
  function ctxOut(){
    if(!S.p)return null;var t=targets(S.p),tot=dayTotals();
    return{goal:S.p.goal,kcal:t.kcal,p:t.p,c:t.c,f:t.f,eaten:{k:r0(tot.k),p:r0(tot.p),c:r0(tot.c),f:r0(tot.f)},diet:S.p.diet||[],allergies:S.p.allergies||"",budget:S.p.budget||0,name:S.p.name||""};
  }
})();
