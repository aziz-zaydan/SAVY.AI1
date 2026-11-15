const _dummy=()=>({style:{},dataset:{},children:[],classList:{add(){},remove(){},toggle(){},contains(){return false}},setAttribute(){},getAttribute(){return null},addEventListener(){},removeEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return []},scrollIntoView(){},scrollBy(){},focus(){},remove(){},offsetWidth:0,offsetHeight:0,scrollTop:0,scrollLeft:0,options:[],selectedIndex:0,getBoundingClientRect(){return{top:0,bottom:0,left:0,right:0,width:0,height:0}},click(){},contains(){return false},blur(){},cloneNode(){return _dummy()},insertAdjacentHTML(){},prepend(){},append(){},value:"",innerHTML:"",textContent:"",__dummy:true});
const $e=id=>document.getElementById(id)||_dummy();

/* ═══════════════════════════════════════════
   CONFIG — Replace these two values
═══════════════════════════════════════════ */
const GROQ_API_URL       = "/.netlify/functions/gemini"; // Netlify function proxy
const GOOGLE_SHEET_URL   = "https://script.google.com/macros/s/AKfycbx18Wth3fpPBoAafNQsU3nSTrHA_WHrlNsnTUZZWFX4Z6GHmLrRd5jua2I12SAYiaR-4Q/exec";

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const dishes = [
  {id:1,price:8,e:"🥗",img:"img/d01.webp",name:"Salade marocaine",ar:"سلطة مغربية",course:"starter",cal:120,p:2,c:8,f_g:9,t:10,r:null,tag:"Vegan",badge:"",cuis:"🥗",f:"vegan",personas:["employee", "famille", "couple"],ing_fr:"Tomates · Concombre · Oignons · Huile",ing_ar:"طماطم · خيار · بصل · زيت",al_fr:"",al_ar:"",fiber:3,sugar:4,sodium:180},
  {id:2,price:11,e:"🥗",img:"img/d02.webp",name:"Coleslaw",ar:"سلطة كول سلو",course:"starter",cal:85,p:4,c:15,f_g:1,t:10,r:null,tag:"Vegetarian",badge:"",cuis:"🥗",f:"vegetarian",personas:["employee", "famille"],ing_fr:"Chou · Carottes · Yaourt",ing_ar:"ملفوف · جزر · زبادي",al_fr:"Lait (yaourt)",al_ar:"حليب (زبادي)",fiber:3,sugar:4,sodium:180},
  {id:3,price:9,e:"🥗",img:"img/d03.webp",name:"Salade de lentilles",ar:"سلطة عدس",course:"starter",cal:275,p:13,c:35,f_g:10,t:35,r:null,tag:"Vegan",badge:"",cuis:"🥗",f:"vegan",personas:["employee", "sportif", "famille"],ing_fr:"Lentilles · Tomates · Oignons · Huile",ing_ar:"عدس · طماطم · بصل · زيت",al_fr:"",al_ar:"",fiber:3,sugar:4,sodium:180},
  {id:4,price:27,e:"🥗",img:"img/d04.webp",name:"Salade de riz au thon",ar:"سلطة أرز بالتونة",course:"starter",cal:340,p:19,c:41,f_g:10,t:25,r:null,tag:"High Protein",badge:"",cuis:"🐟",f:"balanced",personas:["employee", "sportif"],ing_fr:"Riz · Thon en boîte · Tomates · Huile",ing_ar:"أرز · تونة معلبة · طماطم · زيت",al_fr:"Poisson (thon)",al_ar:"سمك (تونة)",fiber:3,sugar:4,sodium:180},
  {id:5,price:7,e:"🥕",img:"img/d05.webp",name:"Salade de carottes au citron",ar:"سلطة جزر بالليمون",course:"starter",cal:130,p:1,c:11,f_g:9,t:10,r:null,tag:"Vegan",badge:"",cuis:"🥗",f:"vegan",personas:["employee", "sportif", "couple"],ing_fr:"Carottes · Citron · Huile",ing_ar:"جزر · ليمون · زيت",al_fr:"",al_ar:"",fiber:3,sugar:4,sodium:180},
  {id:6,price:30,e:"🍗",img:"img/d06.webp",name:"Riz au poulet et légumes",ar:"أرز بالدجاج والخضر",course:"main",cal:785,p:33,c:87,f_g:33,t:45,r:null,tag:"Balanced",badge:"",cuis:"🍗",f:"high-protein",personas:["employee", "sportif", "famille"],ing_fr:"Cuisses de poulet · Riz · Carottes · Oignons · Huile",ing_ar:"دجاج أفخاذ · أرز · جزر · بصل · زيت",al_fr:"",al_ar:"",fiber:4,sugar:5,sodium:680},
  {id:7,price:40,e:"🍔",img:"img/d07.webp",name:"Burger de poulet + pommes de terre au four",ar:"Burger دجاج + بطاطس فرن",course:"main",cal:685,p:42,c:63,f_g:30,t:45,r:null,tag:"Finger Food",badge:"",cuis:"🍗",f:"high-protein",personas:["employee", "sportif", "famille"],ing_fr:"Blanc de poulet · Pain burger · Laitue · Pommes de terre · Huile · Fromage",ing_ar:"دجاج صدور · خبز Burger · خس · بطاطس · زيت · جبن",al_fr:"Gluten, lait, œufs",al_ar:"غلوتين، حليب، بيض",fiber:4,sugar:5,sodium:680},
  {id:8,price:30,e:"🍝",img:"img/d08.webp",name:"Pâtes sauce tomate au poulet",ar:"باستا بصلصة الطماطم والدجاج",course:"main",cal:640,p:38,c:83,f_g:18,t:40,r:null,tag:"Balanced",badge:"",cuis:"🍚",f:"high-protein",personas:["employee", "sportif", "famille"],ing_fr:"Pâtes · Blanc de poulet · Tomates · Oignons · Huile",ing_ar:"باستا · دجاج صدور · طماطم · بصل · زيت",al_fr:"Gluten",al_ar:"غلوتين",fiber:4,sugar:5,sodium:680},
  {id:9,price:50,e:"🍳",img:"img/d09.webp",name:"Tajine de kefta aux œufs",ar:"طاجين كفتة بالبيض",course:"main",cal:540,p:31,c:11,f_g:42,t:40,r:null,tag:"Moroccan",badge:"",cuis:"🍗",f:"high-protein",personas:["employee", "famille", "couple"],ing_fr:"Viande hachée de bœuf · Œufs · Tomates · Oignons · Huile",ing_ar:"لحم مفروم · بيض · طماطم · بصل · زيت",al_fr:"Œufs",al_ar:"بيض",fiber:4,sugar:5,sodium:680},
  {id:10,price:30,e:"🍲",img:"img/d10.webp",name:"Couscous aux légumes et poulet",ar:"كسكس بالخضر والدجاج",course:"main",cal:880,p:41,c:92,f_g:39,t:65,r:null,tag:"Moroccan",badge:"",cuis:"🍗",f:"high-protein",personas:["employee", "famille"],ing_fr:"Semoule de couscous · Cuisses de poulet · Carottes · Pommes de terre · Oignons · Huile",ing_ar:"كسكس · دجاج أفخاذ · جزر · بطاطس · بصل · زيت",al_fr:"Gluten",al_ar:"غلوتين",fiber:4,sugar:5,sodium:680},
  {id:11,price:35,e:"🌯",img:"img/d11.webp",name:"Wrap de poulet",ar:"Wrap دجاج",course:"main",cal:300,p:30,c:29,f_g:7,t:25,r:null,tag:"Finger Food",badge:"",cuis:"🍗",f:"high-protein",personas:["employee", "sportif", "couple"],ing_fr:"Blanc de poulet · Galette wrap · Laitue · Tomates · Yaourt",ing_ar:"دجاج صدور · خبز Wrap · خس · طماطم · زبادي",al_fr:"Gluten, lait",al_ar:"غلوتين، حليب",fiber:4,sugar:5,sodium:680},
  {id:12,price:55,e:"🍔",img:"img/d12.webp",name:"Burger de bœuf + pommes de terre au four",ar:"Burger لحم + بطاطس فرن",course:"main",cal:835,p:37,c:62,f_g:50,t:45,r:null,tag:"Finger Food",badge:"",cuis:"🍗",f:"high-protein",personas:["employee", "famille", "couple"],ing_fr:"Viande hachée de bœuf · Pain burger · Fromage · Pommes de terre · Huile",ing_ar:"لحم مفروم · خبز Burger · جبن · بطاطس · زيت",al_fr:"Gluten, lait",al_ar:"غلوتين، حليب",fiber:4,sugar:5,sodium:680},
  {id:13,price:40,e:"🍝",img:"img/d13.webp",name:"Pâtes crémeuses au poulet",ar:"باستا كريمية بالدجاج",course:"main",cal:835,p:44,c:76,f_g:39,t:35,r:null,tag:"Balanced",badge:"",cuis:"🍚",f:"high-protein",personas:["employee", "couple", "famille"],ing_fr:"Pâtes · Blanc de poulet · Crème fraîche · Fromage · Huile",ing_ar:"باستا · دجاج صدور · كريمة · جبن · زيت",al_fr:"Gluten, lait",al_ar:"غلوتين، حليب",fiber:4,sugar:5,sodium:680},
  {id:14,price:11,e:"🍓",img:"img/d14.webp",name:"Salade de fruits",ar:"سلطة فواكه",course:"dessert",cal:115,p:1,c:28,f_g:0,t:10,r:null,tag:"Vegan",badge:"",cuis:"🥗",f:"vegan",personas:["employee", "sportif", "famille", "couple"],ing_fr:"Fruits de saison · Sucre",ing_ar:"فواكه · سكر",al_fr:"",al_ar:"",fiber:1,sugar:16,sodium:70},
  {id:15,price:19,e:"🍯",img:"img/d15.webp",name:"Yaourt au miel",ar:"زبادي بالعسل",course:"dessert",cal:135,p:5,c:25,f_g:2,t:2,r:null,tag:"Vegetarian",badge:"",cuis:"🥗",f:"vegetarian",personas:["employee", "sportif", "couple"],ing_fr:"Yaourt · Miel",ing_ar:"زبادي · عسل",al_fr:"Lait",al_ar:"حليب",fiber:1,sugar:16,sodium:70},
  {id:16,price:10,e:"🍰",img:"img/d16.webp",name:"Cake au citron",ar:"كعكة بالليمون (Cake)",course:"dessert",cal:465,p:7,c:62,f_g:21,t:50,r:null,tag:"Tradition",badge:"",cuis:"🥗",f:"vegetarian",personas:["employee", "famille", "couple"],ing_fr:"Farine · Sucre · Œufs · Huile · Citron",ing_ar:"دقيق · سكر · بيض · زيت · ليمون",al_fr:"Gluten, œufs",al_ar:"غلوتين، بيض",fiber:1,sugar:16,sodium:70},
  {id:17,price:11,e:"🍚",img:"img/d17.webp",name:"Riz au lait",ar:"أرز بالحليب",course:"dessert",cal:315,p:9,c:53,f_g:7,t:30,r:null,tag:"Tradition",badge:"",cuis:"🍚",f:"vegetarian",personas:["employee", "famille", "couple"],ing_fr:"Riz · Lait · Sucre",ing_ar:"أرز · حليب · سكر",al_fr:"Lait",al_ar:"حليب",fiber:1,sugar:16,sodium:70},
];
const cuisineTabs = [
  {id:"all",  flag:"🌍", fr:"Tout",              ar:"الكل"},
  {id:"🥗",   flag:"🥗", fr:"Végétarien",        ar:"نباتي"},
  {id:"🐟",   flag:"🐟", fr:"Poissons & Mer",    ar:"أسماك ومأكولات بحرية"},
  {id:"🍗",   flag:"🍗", fr:"Viandes & Volaille",ar:"لحوم ودواجن"},
  {id:"🍚",   flag:"🍚", fr:"Riz & Pâtes",       ar:"أرز وباستا"},
];
const personaTabs = [
  {id:"all",     icon:"🌍", fr:"Tous",        ar:"الكل"},
  {id:"employee",icon:"💼", fr:"Employé(e)",  ar:"موظف/ة"},
  {id:"sportif", icon:"🏋️", fr:"Sportif(ve)", ar:"رياضي/ة"},
  {id:"famille", icon:"👨‍👩‍👧", fr:"Famille",     ar:"عائلة"},
  {id:"couple",  icon:"💑", fr:"Couple",      ar:"زوجان"},
];
const dietFilters = ["All","Vegan","Vegetarian","High Protein"];
const filterMap   = {"All":"all","Vegan":"vegan","Vegetarian":"vegetarian","High Protein":"high-protein"};

/* ═══════════════════════════════════════════
   STATE
═══════════════════════════════════════════ */
let lang        = "ar";
let activeCuis  = "all";
let activePersonaMenu = "all";
let activeDiet  = "All";
let cart        = [];
let persona     = null;        // 'employee' | 'sportif' | 'famille' | 'couple' | null

// Chat state — grouped to reduce global scope pollution
const ChatState = {
  history:       [],   // Groq conversation history
  open:          false,
  leadShown:     false,
  leadDone:      false,
  userMsgCount:  0,    // how many messages visitor has sent
};

// Convenience aliases so the rest of the code keeps working without a rewrite
Object.defineProperties(window, {
  chatHistory:    { get(){ return ChatState.history;       }, set(v){ ChatState.history      = v; }, configurable:true },
  chatOpen:       { get(){ return ChatState.open;           }, set(v){ ChatState.open         = v; }, configurable:true },
  leadShown:      { get(){ return ChatState.leadShown;      }, set(v){ ChatState.leadShown    = v; }, configurable:true },
  leadDone:       { get(){ return ChatState.leadDone;       }, set(v){ ChatState.leadDone     = v; }, configurable:true },
  userMsgCount:   { get(){ return ChatState.userMsgCount;   }, set(v){ ChatState.userMsgCount = v; }, configurable:true },
});

/* ═══════════════════════════════════════════
   COPY
═══════════════════════════════════════════ */
const copy = {
  en:{
    city:"🇲🇦 Tétouan · M'diq · Martil",
    tagline:"Morocco's First AI Personal Chef",
    h1:'Eat for your goals.<br><span class="accent">Delivered in 45 min.</span>',
    sub:"Your personal AI chef — fresh meals calculated to your exact macros, cooked to order, delivered to your door.",
    personaLabel:"🍽️ Who are you ordering for?",
    pcEmployeeLbl:"Employee", pcEmployeeDesc:"Energy & productivity",
    pcSportifLbl:"Athlete",   pcSportifDesc:"Performance & macros",
    pcFamilleLbl:"Family",    pcFamilleDesc:"Meals for everyone",
    pcCoupleLbl:"Couple",     pcCoupleDesc:"Romantic dinner",
    proof:"people registered",
    navMenu:"Menu", navHow:"How it works", navAbout:"About", navCta:"Order Now",
    how:"How it works",
    steps:[
      {icon:"🍽️",t:"Choose your profile",       d:"Employee, athlete, family or couple — SAVY adapts your meal to your needs."},
      {icon:"🤖",t:"AI engineers your meal",     d:"Every gram of protein and carb calculated for YOUR goals."},
      {icon:"👨‍🍳",t:"Chef cooks with love",     d:"Fresh local ingredients, prepared to order just for you."},
      {icon:"🛵",t:"Delivered in 45 min",        d:"To your door, hot and fresh. Guaranteed. Always."},
    ],
    stats:[{v:"45 min",l:"Delivery"},{v:"125+",l:"Registered"},{v:"4.9 ★",l:"Rating"},{v:"100%",l:"Fresh"}],
    menuTitle:"Our Menu", menuSub:"World flavours, AI-optimised for your goals",
    search:"Search dishes...",
    cartMsg:(n)=>`${n} dish${n>1?"es":""} selected`,
    order:"💬 Order on WhatsApp",
    noResult:"No dishes found.",
    finalTitle:"Join SAVY today",
    finalSub:"Talk to your personal AI Chef. Your meal, engineered for you, delivered in 45 min. 🧬",
    finalCta:"Engineer My Meal — Free",
    finalNote:"🔒 No spam · Just your perfect meal",
    footerCopy:"© 2025 SAVY · Morocco's First AI Personal Chef",
    fl:["Privacy","Terms","Contact"],
    chips:["Members","Delivery","Rating"],
    bannerLink:"Order Now →",
    chatStatus:"Online · Meal Engineer",
    personaRowLabel:"I'm ordering for...",
    cpbEmployee:"Employee", cpbSportif:"Athlete", cpbFamille:"Family", cpbCouple:"Couple",
    leadPlaceholderName:"Your full name",
    leadPlaceholderCity:"Your address (e.g. Rue Ibn Batouta, Tétouan)",
    leadPlaceholderPhone:"WhatsApp (+212 6XX XXX XXX)",
    leadSubmit:"🧬 Engineer My Meal Now ✨",
    chatInputPh:"Message SAVY...",
    wwdEyebrow:"What we do",
    wwdB1:"AI Nutrition", wwdB2:"Fresh Cooked", wwdB3:"45 min", wwdB4:"17 dishes", wwdB5:"AI Chef",
    wwdTitle:"An AI chef for every aspect of your life",
    wwdSub:"SAVY doesn't just deliver food. We analyse your needs, calculate your nutrients, and cook with local ingredients — all in 45 minutes.",
    deliveryText:"Local delivery · Tétouan · Martil · M'diq · 45 min · Cash or Card",
    loyEyebrow:"⭐ SAVY Loyalty Program",
    loyTitle:"Every meal rewards you",
    loySub:"Order, earn points, unlock exclusive perks. The healthier you eat, the more you earn.",
    tierOrd:["1 – 5 orders","6 – 15 orders","16 – 30 orders","31+ orders"],
    tierName4:"Platinum",
    tierPerks:[
      ["10 pts per order","Full menu access","Priority support"],
      ["15 pts per order","-5% on every meal","Priority delivery"],
      ["20 pts per order","-10% on every meal","1 free meal / month"],
      ["25 pts per order","-15% permanent","Dedicated chef + VIP menu"],
    ],
    lpcStatusTitle:"Your current status",
    lpcStatusDesc:"Order your first meal and join<br>the SAVY Rewards community!",
    lpcProgressTxt:"12 pts · 38 pts left for Silver 🥈",
    lpcPtsLbl:"SAVY points",
    earnDesc:["Every order<br>via SAVY","Share your meal<br>on Instagram","Refer a friend<br>who orders"],
    nutriEyebrow:"🧮 Nutrition Calculator",
    nutriTitle:"Your calorie needs in 30 seconds",
    nutriSub:"Enter your data and discover which SAVY dishes match your goals exactly.",
    ncLblGender:"Sex", ncLblAge:"Age (yrs)", ncLblWeight:"Weight (kg)", ncLblHeight:"Height (cm)", ncLblActivity:"Activity level", ncLblGoal:"Goal",
    ncMale:"Male", ncFemale:"Female",
    ncCut:"Cut", ncMain:"Maintain", ncBulk:"Bulk",
    ncCalcBtn:"🧮 Calculate my needs",
    ncActivities:["🛋 Sedentary (little or no exercise)","🚶 Lightly active (1-3d/week)","🏃 Moderately active (3-5d/week)","🏋️ Very active (6-7d/week)","⚡ Extra active (2x/day)"],
    ncKcalLbl:"calories / day recommended",
    ncProtLbl:"Protein (g)", ncCarbLbl:"Carbs (g)", ncFatLbl:"Fat (g)",
    ncDishesLbl:"🍽️ SAVY dishes recommended for you:",
    ncDisclaimer:"💡 Based on the revised Harris-Benedict formula. These are estimates — consult a health professional for a personalised assessment.",
    trackTitle:"Track my order 🛵", trackSub:"Real-time update · Tétouan",
    trackSteps:[
      {t:"Order received",          d:"Your order has been confirmed and sent to the kitchen."},
      {t:"Being prepared",          d:"Chef SAVY is preparing your meal with fresh market ingredients."},
      {t:"Packing & quality check", d:"Your meal is carefully packed and checked."},
      {t:"On the way to you!",      d:"Your rider is on the way. Delivery guaranteed in 45 min."},
    ],
    trackEtaLbl:"minutes estimated",
    wwdCards:[
      {icon:"🧬", title:"AI-personalised nutrition",  desc:"Our AI analyses your profile and calculates every gram of protein, carb, and fat to hit your exact goals.", tag:"🤖 Powered by AI"},
      {icon:"👨‍🍳", title:"Cooked to order",          desc:"Nothing is pre-made. Every dish is cooked the moment you order, with fresh ingredients from the Tétouan market.", tag:"🌿 100% Fresh"},
      {icon:"🛵", title:"Delivered in 45 minutes",    desc:"Tétouan, M'diq, Martil — your meal arrives hot, fresh, and carefully packed. Guaranteed. Always on time.", tag:"⏱ 45 min guarantee"},
      {icon:"🍽️", title:"17 simple, fresh dishes",desc:"Starters, mains and desserts cooked daily from fresh local ingredients, at prices that make sense for every day.", tag:"🌍 4 Cuisines"},
      {icon:"💬", title:"A real chef who talks to you", desc:"Ask anything — allergens, calories, portions. Chef SAVY answers in English, Darija & French like a nutrition expert at your service.", tag:"💚 EN · Darija · Français"},
    ],
    otsEyebrow:"🛵 Live tracking", otsS0:"Order received", otsS1:"Preparing", otsS2:"Packaging", otsS3:"On the way", otsActive:"in progress...", otsCta:"Haven't ordered yet?", otsCtaBtn:"Order →",
    revEyebrow:"⭐ Customer Reviews",
    revTitle:"What our customers say",
    revSub:"125+ people have already ordered. Here's what they think.",
    revCountLbl:"Based on 125+ reviews",
  },
  fr:{
    city:"🇲🇦 Tétouan · M'diq · Martil",
    tagline:"Morocco's First AI Personal Chef",
    h1:'Mangez pour vos objectifs.<br><span class="accent">Livré en 45 min.</span>',
    sub:"Votre chef IA personnel — repas frais calculés pour vos macros exactes, cuisinés à la commande, livrés chez vous.",
    personaLabel:"🍽️ Pour qui commandez-vous ?",
    pcEmployeeLbl:"Employé(e)", pcEmployeeDesc:"Énergie & productivité",
    pcSportifLbl:"Sportif(ve)", pcSportifDesc:"Performance & macros",
    pcFamilleLbl:"Famille",     pcFamilleDesc:"Repas pour tous",
    pcCoupleLbl:"Couple",       pcCoupleDesc:"Dîner romantique",
    proof:"personnes inscrites",
    navMenu:"Menu", navHow:"Comment ça marche", navAbout:"À propos", navCta:"Commander",
    how:"Comment ça marche",
    steps:[
      {icon:"🍽️",t:"Choisissez votre profil",   d:"Employé, sportif, famille ou couple — SAVY adapte votre repas à vos besoins."},
      {icon:"🤖",t:"L'IA engineer votre meal",  d:"Chaque gramme de protéine et glucide calculé pour VOS objectifs."},
      {icon:"👨‍🍳",t:"Chef cuisine avec amour",  d:"Ingrédients locaux frais, préparés à la commande pour vous."},
      {icon:"🛵",t:"Livré en 45 min",           d:"Chez vous, chaud et frais. Garanti. Toujours."},
    ],
    stats:[{v:"45 min",l:"Livraison"},{v:"125+",l:"Inscrits"},{v:"4.9 ★",l:"Satisfaction"},{v:"100%",l:"Frais"}],
    menuTitle:"Notre Menu", menuSub:"Des saveurs du monde, optimisées par l'IA pour vos objectifs",
    search:"Rechercher des plats...",
    cartMsg:(n)=>`${n} plat${n>1?"s":""} sélectionné${n>1?"s":""}`,
    order:"💬 Commander sur WhatsApp",
    noResult:"Aucun plat trouvé.",
    finalTitle:"Rejoindre SAVY aujourd'hui",
    finalSub:"Parlez à votre Chef IA personnel. Votre repas, engineered pour vous. 🧬",
    finalCta:"Engineer My Meal — Free",
    finalNote:"🔒 Aucun spam · Juste votre repas parfait",
    footerCopy:"© 2025 SAVY · Morocco's First AI Personal Chef",
    fl:["Confidentialité","Conditions","Contact"],
    chips:["Inscrits","Livraison","Note"],
    bannerLink:"Commander maintenant →",
    chatStatus:"En ligne · Meal Engineer",
    personaRowLabel:"Je commande pour...",
    cpbEmployee:"Employé(e)", cpbSportif:"Sportif(ve)", cpbFamille:"Famille", cpbCouple:"Couple",
    leadPlaceholderName:"Votre nom complet",
    leadPlaceholderCity:"Votre adresse (ex: Rue Ibn Batouta, Tétouan)",
    leadPlaceholderPhone:"WhatsApp (+212 6XX XXX XXX)",
    leadSubmit:"🧬 Engineer My Meal Now ✨",
    chatInputPh:"Message SAVY...",
    wwdEyebrow:"Ce que nous faisons",
    wwdB1:"Nutrition IA", wwdB2:"Cuisiné frais", wwdB3:"45 min", wwdB4:"17 plats", wwdB5:"Chef IA",
    wwdTitle:"Un chef IA pour chaque aspect de votre vie",
    wwdSub:"SAVY ne se contente pas de livrer de la nourriture. Nous analysons vos besoins, calculons vos nutriments et cuisinons avec des ingrédients locaux — tout ça en 45 minutes.",
    deliveryText:"Livraison locale · Tétouan · Martil · M'diq · 45 min · Cash ou Carte",
    loyEyebrow:"⭐ Programme Fidélité SAVY",
    loyTitle:"Chaque repas vous récompense",
    loySub:"Commandez, gagnez des points, débloquez des avantages exclusifs. Plus vous mangez sain, plus vous êtes récompensé.",
    tierOrd:["1 – 5 commandes","6 – 15 commandes","16 – 30 commandes","31+ commandes"],
    tierName4:"Platine",
    tierPerks:[
      ["10 pts par commande","Accès au menu complet","Support prioritaire"],
      ["15 pts par commande","-5% sur chaque repas","Livraison prioritaire"],
      ["20 pts par commande","-10% sur chaque repas","1 repas offert / mois"],
      ["25 pts par commande","-15% permanent","Chef dédié + menu VIP"],
    ],
    lpcStatusTitle:"Votre statut actuel",
    lpcStatusDesc:"Commandez votre premier repas et rejoignez<br>la communauté SAVY Rewards !",
    lpcProgressTxt:"12 pts · encore 38 pts pour Silver 🥈",
    lpcPtsLbl:"points SAVY",
    earnDesc:["Chaque commande<br>passée via SAVY","Partager votre repas<br>sur Instagram","Parrainer un ami<br>qui commande"],
    nutriEyebrow:"🧮 Calculateur Nutritionnel",
    nutriTitle:"Vos besoins caloriques en 30 secondes",
    nutriSub:"Entrez vos données et découvrez exactement quels plats SAVY correspondent à vos objectifs.",
    ncLblGender:"Sexe", ncLblAge:"Âge (ans)", ncLblWeight:"Poids (kg)", ncLblHeight:"Taille (cm)", ncLblActivity:"Niveau d'activité", ncLblGoal:"Objectif",
    ncMale:"Homme", ncFemale:"Femme",
    ncCut:"Perte", ncMain:"Maintien", ncBulk:"Prise",
    ncCalcBtn:"🧮 Calculer mes besoins",
    ncActivities:["🛋 Sédentaire (peu ou pas d'exercice)","🚶 Légèrement actif (1-3j/semaine)","🏃 Modérément actif (3-5j/semaine)","🏋️ Très actif (6-7j/semaine)","⚡ Extrêmement actif (2x/jour)"],
    ncKcalLbl:"calories / jour recommandées",
    ncProtLbl:"Protéines (g)", ncCarbLbl:"Glucides (g)", ncFatLbl:"Lipides (g)",
    ncDishesLbl:"🍽️ Plats SAVY recommandés pour vous :",
    ncDisclaimer:"💡 Basé sur la formule Harris-Benedict révisée. Ces estimations sont indicatives — consultez un professionnel de santé pour un bilan personnalisé.",
    trackTitle:"Suivre ma commande 🛵", trackSub:"Mise à jour en temps réel · Tétouan",
    trackSteps:[
      {t:"Commande reçue",         d:"Votre commande a été confirmée et transmise à la cuisine."},
      {t:"En préparation",          d:"Chef SAVY prépare votre repas avec des ingrédients frais du marché."},
      {t:"Emballage & contrôle qualité", d:"Votre repas est emballé soigneusement et vérifié."},
      {t:"En route vers vous !",    d:"Votre livreur est en chemin. Livraison garantie en 45 min."},
    ],
    trackEtaLbl:"minutes estimées",
    wwdCards:[
      {icon:"🧬", title:"Nutrition personnalisée par IA",    desc:"Notre IA analyse votre profil et calcule chaque gramme de protéine, glucide et lipide pour atteindre vos objectifs précis.", tag:"🤖 Powered by AI"},
      {icon:"👨‍🍳", title:"Cuisiné à la commande",            desc:"Rien n'est préparé à l'avance. Chaque plat est cuisiné au moment de votre commande, avec des ingrédients frais du marché de Tétouan.", tag:"🌿 100% Frais"},
      {icon:"🛵", title:"Livraison en 45 minutes",           desc:"Tétouan, M'diq, Martil — votre repas arrive chaud, frais et emballé avec soin. Garanti. Toujours à l'heure.", tag:"⏱ Garanti 45 min"},
      {icon:"🍽️", title:"17 plats simples et frais",desc:"Entrées, plats et desserts cuisinés chaque jour avec des produits locaux frais, à des prix pensés pour le quotidien.", tag:"🌍 4 Cuisines"},
      {icon:"💬", title:"Un vrai chef qui vous parle",       desc:"Posez toutes vos questions — allergènes, calories, portions. Chef SAVY répond en Darija et français, comme un expert en nutrition à votre service.", tag:"💚 Darija · Français · عربي"},
    ],
    otsEyebrow:"🛵 Suivi en direct", otsS0:"Commande reçue", otsS1:"En préparation", otsS2:"Emballage", otsS3:"En route", otsActive:"en cours...", otsCta:"Pas encore commandé ?", otsCtaBtn:"Commander →",
    revEyebrow:"⭐ Avis Clients",
    revTitle:"Ce que disent nos clients",
    revSub:"125+ personnes ont déjà commandé. Voici leurs retours.",
    revCountLbl:"Basé sur 125+ avis",
  },
  ar:{
    city:"🇲🇦 تطوان · مديق · مرتيل",
    tagline:"أول شيف شخصي بالذكاء الاصطناعي في المغرب",
    h1:'كل وجبة مصممة لأهدافك.<br><span class="accent">توصيل في 45 دقيقة.</span>',
    sub:"شيفك الذكي الشخصي — وجبات طازجة محسوبة لماكروزك الدقيقة، مطبوخة عند الطلب، موصلة لبابك.",
    personaLabel:"🍽️ لمن تطلب اليوم؟",
    pcEmployeeLbl:"موظف/ة", pcEmployeeDesc:"الطاقة والإنتاجية",
    pcSportifLbl:"رياضي/ة", pcSportifDesc:"الأداء والماكروز",
    pcFamilleLbl:"عائلة",    pcFamilleDesc:"وجبات للجميع",
    pcCoupleLbl:"زوجان",    pcCoupleDesc:"عشاء رومانسي",
    proof:"شخص انضم",
    navMenu:"القائمة", navHow:"كيف يعمل", navAbout:"حولنا", navCta:"اطلب الآن",
    how:"كيف يعمل",
    steps:[
      {icon:"🍽️",t:"اختر ملفك الشخصي",         d:"موظف، رياضي، عائلة أو زوجان — SAVY يكيّف وجبتك حسب احتياجاتك."},
      {icon:"🤖",t:"الذكاء يصمم وجبتك",    d:"كل غرام من البروتين والكربوهيدرات محسوب لأهدافك أنت."},
      {icon:"👨‍🍳",t:"الشيف يطبخ بحب",     d:"مكونات محلية طازجة، محضرة لك عند الطلب."},
      {icon:"🛵",t:"توصيل في 45 دقيقة",    d:"لبابك، ساخن وطازج. مضمون دائماً."},
    ],
    stats:[{v:"45 دق",l:"التوصيل"},{v:"+125",l:"مشترك"},{v:"4.9 ★",l:"الرضا"},{v:"100%",l:"طازج"}],
    menuTitle:"قائمتنا", menuSub:"نكهات عالمية محسّنة بالذكاء الاصطناعي لأهدافك",
    search:"ابحث عن الأطباق...",
    cartMsg:(n)=>`${n} طبق مختار`,
    order:"💬 اطلب عبر واتساب",
    noResult:"لم يتم العثور على أطباق.",
    finalTitle:"انضم إلى SAVY اليوم",
    finalSub:"تحدث مع شيفك الذكي. وجبتك، مصممة لك. 🧬",
    finalCta:"صمّم وجبتي — مجاناً",
    finalNote:"🔒 لا إزعاج · فقط وجبتك المثالية",
    footerCopy:"© 2025 SAVY · أول شيف ذكاء اصطناعي في المغرب",
    fl:["الخصوصية","الشروط","تواصل"],
    chips:["مشترك","توصيل","تقييم"],
    bannerLink:"اطلب الآن →",
    chatStatus:"متاح · مهندس الوجبات",
    personaRowLabel:"أطلب لـ...",
    cpbEmployee:"موظف/ة", cpbSportif:"رياضي/ة", cpbFamille:"عائلة", cpbCouple:"زوجان",
    leadPlaceholderName:"اسمك الكامل",
    leadPlaceholderCity:"عنوانك (مثال: شارع ابن بطوطة، تطوان)",
    leadPlaceholderPhone:"WhatsApp (+212 6XX XXX XXX)",
    leadSubmit:"🧬 صمّم وجبتي الآن ✨",
    chatInputPh:"راسل SAVY...",
    wwdEyebrow:"ما الذي نقدمه",
    wwdB1:"تغذية ذكية", wwdB2:"طازج دائماً", wwdB3:"45 دقيقة", wwdB4:"17 طبق", wwdB5:"شيف ذكي",
    wwdTitle:"شيف ذكاء اصطناعي لكل جانب من حياتكم",
    wwdSub:"SAVY لا يكتفي بتوصيل الطعام. نحن نحلل احتياجاتكم، نحسب مغذياتكم، ونطبخ بمكونات محلية طازجة — كل ذلك في 45 دقيقة.",
    deliveryText:"توصيل محلي · تطوان · مرتيل · المضيق · 45 دقيقة · نقداً أو بطاقة",
    loyEyebrow:"⭐ برنامج ولاء SAVY",
    loyTitle:"كل وجبة تكافئك",
    loySub:"اطلب، اجمع النقاط، افتح مزايا حصرية. كلما أكلت صحياً، كلما حصلت على مكافآت أكثر.",
    tierOrd:["1 – 5 طلبات","6 – 15 طلباً","16 – 30 طلباً","31+ طلباً"],
    tierName4:"بلاتينيوم",
    tierPerks:[
      ["10 نقطة لكل طلب","وصول للقائمة الكاملة","دعم ذو أولوية"],
      ["15 نقطة لكل طلب","-5% على كل وجبة","توصيل ذو أولوية"],
      ["20 نقطة لكل طلب","-10% على كل وجبة","وجبة مجانية / شهر"],
      ["25 نقطة لكل طلب","-15% دائم","شيف خاص + قائمة VIP"],
    ],
    lpcStatusTitle:"وضعك الحالي",
    lpcStatusDesc:"اطلب وجبتك الأولى وانضم<br>إلى مجتمع SAVY Rewards !",
    lpcProgressTxt:"12 نقطة · 38 نقطة متبقية للفضة 🥈",
    lpcPtsLbl:"نقاط SAVY",
    earnDesc:["كل طلب<br>عبر SAVY","مشاركة وجبتك<br>على Instagram","دعوة صديق<br>يطلب معك"],
    nutriEyebrow:"🧮 حاسبة التغذية",
    nutriTitle:"احتياجاتك السعرية في 30 ثانية",
    nutriSub:"أدخل بياناتك واكتشف أي أطباق SAVY تناسب أهدافك تماماً.",
    ncLblGender:"الجنس", ncLblAge:"العمر (سنة)", ncLblWeight:"الوزن (كغ)", ncLblHeight:"الطول (سم)", ncLblActivity:"مستوى النشاط", ncLblGoal:"الهدف",
    ncMale:"ذكر", ncFemale:"أنثى",
    ncCut:"تخفيف", ncMain:"حفاظ", ncBulk:"زيادة",
    ncCalcBtn:"🧮 احسب احتياجاتي",
    ncActivities:["🛋 خامل (نشاط قليل أو معدوم)","🚶 نشيط قليلاً (1-3 أيام/أسبوع)","🏃 نشيط معتدل (3-5 أيام/أسبوع)","🏋️ نشيط جداً (6-7 أيام/أسبوع)","⚡ نشيط باستمرار (مرتين/يوم)"],
    ncKcalLbl:"سعرة حرارية / يوم موصى بها",
    ncProtLbl:"بروتين (غ)", ncCarbLbl:"كربوهيدرات (غ)", ncFatLbl:"دهون (غ)",
    ncDishesLbl:"🍽️ أطباق SAVY الموصى بها لك :",
    ncDisclaimer:"💡 بناءً على معادلة هاريس-بينيديكت المُحدَّثة. هذه التقديرات إرشادية — استشر متخصصاً في الصحة للحصول على تقييم شخصي.",
    trackTitle:"تتبع طلبي 🛵", trackSub:"تحديث فوري · تطوان",
    trackSteps:[
      {t:"تم استلام الطلب",          d:"تم تأكيد طلبك وإحالته إلى المطبخ."},
      {t:"جاري التحضير",             d:"Chef SAVY يحضر وجبتك بمكونات طازجة من السوق المحلي."},
      {t:"التغليف ومراقبة الجودة",    d:"وجبتك تُغلَّف بعناية ويتم التحقق منها."},
      {t:"في الطريق إليك !",          d:"المندوب في الطريق. توصيل مضمون في 45 دقيقة."},
    ],
    trackEtaLbl:"دقيقة متبقية",
    wwdCards:[
      {icon:"🧬", title:"تغذية شخصية بالذكاء الاصطناعي",    desc:"يحلل ذكاؤنا الاصطناعي ملفكم الشخصي ويحسب كل غرام بروتين وكربوهيدرات ودهون لتحقيق أهدافكم بدقة.", tag:"🤖 مدعوم بالذكاء الاصطناعي"},
      {icon:"👨‍🍳", title:"مطبوخ عند الطلب",                   desc:"لا شيء يُحضَّر مسبقاً. كل طبق يُطبخ لحظة استلام طلبكم، بمكونات طازجة من سوق تطوان المحلي.", tag:"🌿 100% طازج"},
      {icon:"🛵", title:"توصيل في 45 دقيقة",                 desc:"تطوان · المضيق · مرتيل — وجبتكم تصل ساخنة وطازجة ومعبأة بعناية. مضمون دائماً. في الوقت دائماً.", tag:"⏱ مضمون 45 دقيقة"},
      {icon:"🍽️", title:"17 طبقاً بسيطاً وطازجاً",desc:"مقبلات وأطباق رئيسية وحلويات تُطبخ كل يوم بمكونات محلية طازجة وبأسعار تناسب الاستعمال اليومي.", tag:"🌍 4 مطابخ"},
      {icon:"💬", title:"شيف حقيقي يتحدث معكم",              desc:"اسألوا كل أسئلتكم — مكونات، سعرات، حصص، حساسيات. Chef SAVY يجيب بالدارجة والعربية والفرنسية كخبير تغذية في خدمتكم.", tag:"💚 عربية · Français · EN"},
    ],
    otsEyebrow:"🛵 التتبع المباشر", otsS0:"تم استلام الطلب", otsS1:"قيد التحضير", otsS2:"التغليف", otsS3:"في الطريق", otsActive:"جارٍ...", otsCta:"لم تطلب بعد؟", otsCtaBtn:"اطلب الآن →",
    revEyebrow:"⭐ آراء العملاء",
    revTitle:"ماذا يقول عملاؤنا",
    revSub:"+125 شخص طلب بالفعل. إليكم آراؤهم.",
    revCountLbl:"بناءً على +125 تقييم",
  },
};

/* ═══════════════════════════════════════════
   THEME
═══════════════════════════════════════════ */
let darkMode = false; // always start light

function applyTheme() {
  const btn = $e("theme-btn");
  if(darkMode) {
    document.documentElement.setAttribute("data-theme","dark");
    if(btn) btn.textContent = "☀️";
  } else {
    document.documentElement.removeAttribute("data-theme");
    if(btn) btn.textContent = "🌙";
  }
  localStorage.setItem("savy-theme", darkMode ? "dark" : "light");
}

function toggleLangDD() {
  const dd = $e("lang-dd");
  if(!dd) return;
  const open = dd.style.display !== "none";
  dd.style.display = open ? "none" : "block";
}
document.addEventListener("click", function(e) {
  const wrap = $e("lang-dd-wrap");
  const dd   = $e("lang-dd");
  if(wrap && dd && !wrap.contains(e.target)) dd.style.display = "none";
});

function toggleTheme() {
  darkMode = !darkMode;
  applyTheme();
}

// Apply on load
applyTheme();
applyChatTheme("employee");

/* ═══════════════════════════════════════════
   LANGUAGE
═══════════════════════════════════════════ */
let revIdx = 0;
let revPerPage = window.innerWidth < 769 ? 1 : window.innerWidth < 1025 ? 2 : 3;

/* ═══════════════════════════════════════════
   URGENCY STRIP — dynamic count + i18n
═══════════════════════════════════════════ */
/* ═══════════════════════════════════════════
   URGENCY STRIP — persisted live counter
═══════════════════════════════════════════ */
const URGENCY_MAX   = 25;
const URGENCY_KEY   = "savy_order_count";
const URGENCY_TS_KEY= "savy_order_ts";

function getUrgencyCount() {
  // Reset to starting number each new day
  const today = new Date().toDateString();
  const saved = localStorage.getItem(URGENCY_KEY);
  const savedDay = localStorage.getItem(URGENCY_TS_KEY);
  if(savedDay !== today) {
    // New day → start fresh from a random seed between 8-13
    const startCount = 8 + Math.floor(Math.random() * 6);
    localStorage.setItem(URGENCY_KEY, startCount);
    localStorage.setItem(URGENCY_TS_KEY, today);
    return startCount;
  }
  return Math.min(parseInt(saved) || 8, URGENCY_MAX);
}

function tickUrgencyCount() {
  const current = getUrgencyCount();
  if(current < URGENCY_MAX) {
    localStorage.setItem(URGENCY_KEY, current + 1);
  }
  renderUrgencyStrip();
}

function renderUrgencyStrip() {
  const l = lang || "ar";
  const count = getUrgencyCount();
  const hour  = new Date().getHours();
  const slots      = Math.max(1, 5 - (hour % 4));
  const cities     = ["Tétouan","M'diq","Martil"];
  const city       = cities[hour % 3];
  const closingHour = hour < 13 ? 14 : 21;

  const msgs = {
    fr: {
      orders: `🔥 ${count} personnes ont commandé aujourd'hui à ${city}`,
      slots:  `Dernière livraison à ${closingHour}h — <strong>${slots} créneaux restants</strong>`
    },
    en: {
      orders: `🔥 ${count} people ordered today in ${city}`,
      slots:  `Last delivery at ${closingHour}:00 — <strong>${slots} slots left</strong>`
    },
    ar: {
      orders: `🔥 ${count} شخصاً طلبوا اليوم في ${city === "Tétouan" ? "تطوان" : city}`,
      slots:  `آخر توصيل الساعة ${closingHour} — <strong>${slots} مقاعد متبقية</strong>`
    }
  };
  const m = msgs[l] || msgs.fr;
  const txt  = $e("urgency-txt");
  const slot = $e("urgency-slots");
  if(txt)  txt.textContent = m.orders;
  if(slot) slot.innerHTML  = m.slots;
}

function updateUrgencyStrip(l) {
  renderUrgencyStrip();
}

// Tick every 7 seconds
setInterval(tickUrgencyCount, 7000);

function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  document.body.dir = (l==="ar") ? "rtl" : "ltr";
  const t  = copy[l];
  const isAr = (l==="ar");
  const ff = isAr ? "font-family:'Tajawal',sans-serif;" : "font-family:'Cormorant Garamond',serif;font-weight:700;";

  // Safe helpers — never throw if element missing
  const $t  = (id, val) => { const el=$e(id); if(el) el.textContent = val; };
  const $h  = (id, val) => { const el=$e(id); if(el) el.innerHTML   = val; };
  const $p  = (id, val) => { const el=$e(id); if(el) el.placeholder = val; };
  const $cs = (id, css) => { const el=$e(id); if(el) el.style.cssText = css; };

  document.querySelectorAll(".lang-btn").forEach((b,i)=>b.classList.toggle("active",(i===0&&l==="en")||(i===1&&l==="fr")||(i===2&&l==="ar")));

  $t("nl-menu",  t.navMenu);  $t("nl-how", t.navHow);
  $t("nl-about", t.navAbout); $t("nav-cta", t.navCta);

  $t("hero-city",    t.city);
  $t("hero-tagline", t.tagline);
  $h("hero-h1",      t.h1);
  $cs("hero-h1", ff+"font-size:clamp(38px,5.5vw,68px);font-weight:900;line-height:1.08;color:var(--text);margin-bottom:16px;");
  $t("hero-sub", t.sub);
  $h("hero-cta-btn", isAr ? "🛵 اطلب الآن — 45 دقيقة" : (l==="en" ? "🛵 Order Now — 45 min" : "🛵 Commander maintenant — 45 min"));
  $t("hero-trust",   isAr ? "✅ بدون التزام · كاش عند التوصيل" : (l==="en" ? "✅ No commitment · Cash on delivery" : "✅ Sans engagement · Cash à la livraison"));

  $t("persona-label",       t.personaLabel);
  $t("pc-employee-lbl",     t.pcEmployeeLbl);  $t("pc-employee-desc", t.pcEmployeeDesc);
  $t("pc-sportif-lbl",      t.pcSportifLbl);   $t("pc-sportif-desc",  t.pcSportifDesc);
  $t("pc-famille-lbl",      t.pcFamilleLbl);   $t("pc-famille-desc",  t.pcFamilleDesc);
  $t("pc-couple-lbl",       t.pcCoupleLbl);    $t("pc-couple-desc",   t.pcCoupleDesc);

  $t("proof-txt",     t.proof);
  $t("chip-inscrits", t.chips[0]);  $t("chip-livraison", t.chips[1]);  $t("chip-note", t.chips[2]);

  $t("how-title", t.how);  $cs("how-title", ff);

  // Urgency strip
  updateUrgencyStrip(l);

  renderWWD();
  renderSteps();

  $t("menu-title", t.menuTitle);  $cs("menu-title", ff);
  $t("menu-sub",   t.menuSub);
  $p("search",     t.search);
  $t("order-btn",  t.order);
  renderCuisineTabs(); renderDietFilters(); renderDishes();

  $t("final-title",   t.finalTitle);  $t("final-cta-txt", t.finalCta);
  $t("final-sub",     t.finalSub);    $t("final-note",    t.finalNote);
  $t("footer-copy",   t.footerCopy);
  $t("fl-1", t.fl[0]);  $t("fl-2", t.fl[1]);  $t("fl-3", t.fl[2]);
  $t("banner-link",   t.bannerLink);
  const $el = id => $e(id);

  // ── Promo badge ──
  const promoBadgeTxt = isAr ? "🎁 -10% على أول طلب" : (l==="en" ? "🎁 -10% on your 1st order" : "🎁 -10% sur ta 1ère commande");
  if($el("hero-promo-badge")) $el("hero-promo-badge").textContent = promoBadgeTxt;
  if($el("final-promo"))      $el("final-promo").textContent = isAr ? "🎁 كود SAVY10 ← -10% على أول طلب" : (l==="en" ? "🎁 Code SAVY10 → -10% on your 1st order" : "🎁 Code SAVY10 → -10% sur ta 1ère commande");

  // ── Results section ──
  if($el("results-eyebrow")) $el("results-eyebrow").textContent = isAr ? "✅ نتائج حقيقية" : (l==="en" ? "✅ Real Results" : "✅ Résultats réels");
  if($el("results-title"))   $el("results-title").innerHTML = isAr ? "طلبوا. إليك ما تغيّر." : (l==="en" ? "They ordered. Here's what changed." : "Ils ont commandé. Voici ce qui a changé.");
  if($el("results-sub"))     $el("results-sub").textContent = isAr ? "بدون رجيم ولا صالة رياضية. فقط وجبات SAVY حقيقية توصل في 45 دقيقة." : (l==="en" ? "No diet, no gym. Just real SAVY meals delivered in 45 min." : "Pas de régime, pas de salle de sport. Juste de vrais repas SAVY, livrés en 45 min.");
  if($el("rc1-lbl"))         $el("rc1-lbl").textContent  = isAr ? "في 6 أسابيع · بدون إحباط" : (l==="en" ? "in 6 weeks · no frustration" : "en 6 semaines · sans frustration");
  if($el("rc2-lbl"))         $el("rc2-lbl").textContent  = isAr ? "تركيز أكثر بعد الغداء" : (l==="en" ? "more afternoon focus" : "de concentration l'après-midi");
  if($el("rc3-lbl"))         $el("rc3-lbl").textContent  = isAr ? "وجبات عائلية كل مساء" : (l==="en" ? "family meals every evening" : "repas familiaux chaque soir");
  if($el("results-cta"))     $el("results-cta").textContent = isAr ? "أريد نفس النتيجة" : (l==="en" ? "I want the same result" : "Je veux le même résultat");
  if($el("results-cta-sub")) $el("results-cta-sub").textContent = isAr ? "🎁 -10% على أول طلب · توصيل 45 دقيقة · كاش OK" : (l==="en" ? "🎁 -10% on 1st order · 45 min delivery · Cash OK" : "🎁 -10% sur ta 1ère commande · Livraison 45 min · Cash OK");

  // ── FAQ section ──
  if($el("faq-eyebrow")) $el("faq-eyebrow").textContent = isAr ? "❓ أسئلة شائعة" : (l==="en" ? "❓ FAQ" : "❓ Questions fréquentes");
  if($el("faq-title"))   $el("faq-title").innerHTML = isAr ? "كل ما تريد معرفته" : (l==="en" ? "Everything you want to know" : "Tout ce que vous voulez savoir");
  const faqQ = isAr
    ? ["هل يمكنني الدفع كاشاً عند التوصيل؟","هل تقوم بالتوصيل في شارعي؟","كيف أعرف أن السعرات الحرارية دقيقة؟","كيف أضع طلباً؟","ماذا لو استغرق التوصيل أكثر من 45 دقيقة؟","ما هو خصم -10% للطلب الأول؟"]
    : (l==="en"
      ? ["Can I pay cash on delivery?","Do you deliver to my street?","How do I know the calories are accurate?","How do I place an order?","What if delivery takes more than 45 minutes?","What is the -10% first order discount?"]
      : ["Est-ce que je peux payer en cash à la livraison ?","Est-ce que vous livrez dans ma rue ?","Comment je sais que les calories sont exactes ?","Comment passer une commande ?","Et si la livraison prend plus de 45 minutes ?","C'est quoi la réduction de -10% pour la 1ère commande ?"]);
  const faqA = isAr
    ? ["نعم، 100%. تدفع للمندوب عند استلام طلبك. لا حاجة لبطاقة بنكية.","نوصل في كل أرجاء تطوان والمضيق ومرتيل. أرسل عنوانك على واتساب وسنؤكد في أقل من دقيقتين.","كل طبق يُوزن ويُحسب من مكوناته الفعلية. القيم المعروضة تتوافق بالضبط مع حصتك.","اختر أطباقك من القائمة، انقر 'اطلب عبر واتساب' وأرسل عنوانك. فريقنا يؤكد في أقل من 5 دقائق.","نادر جداً، لكن إن حدث ستحصل على تخفيض على طلبك التالي تلقائياً. ضماننا حقيقي.","اذكر كود SAVY10 على واتساب عند أول طلب ونطبق -10% مباشرة على مجموعك."]
    : (l==="en"
      ? ["Yes, 100%. You pay the rider on delivery. No bank card needed.","We deliver throughout Tétouan, M'diq and Martil. Send your address on WhatsApp and we confirm in under 2 minutes.","Every dish is weighed and calculated from its actual ingredients. The displayed values match your exact portion.","Choose your dishes, click 'Order on WhatsApp' and send your address. Our team confirms in under 5 minutes.","It's rare, but if it happens you automatically get a discount on your next order. Our 45-min guarantee is real.","Mention code SAVY10 on WhatsApp on your first order and we apply -10% directly to your total."]
      : ["Oui, 100%. Vous payez le livreur à la réception. Pas besoin de carte bancaire.","Nous livrons dans tout Tétouan, M'diq et Martil. Envoyez votre adresse sur WhatsApp et on confirme en 2 min.","Chaque plat est pesé et calculé à partir des ingrédients réels. Les valeurs correspondent à votre portion exacte.","Choisissez vos plats, cliquez 'Commander sur WhatsApp' et envoyez votre adresse. On confirme en moins de 5 min.","Si ça arrive, vous bénéficiez automatiquement d'une réduction sur votre prochaine commande.","Mentionnez le code SAVY10 sur WhatsApp lors de votre première commande et nous appliquons -10% sur votre total."]);
  for(let i=1;i<=6;i++){
    if($el("fq"+i+"-q")) $el("fq"+i+"-q").textContent = faqQ[i-1];
    if($el("fq"+i+"-a")) $el("fq"+i+"-a").innerHTML   = faqA[i-1];
  }

  // ── Footer WA number ──
  if($el("footer-wa-lbl")) $el("footer-wa-lbl").textContent = isAr ? "📞 +212 70 870 0830" : "📞 +212 70 870 0830";

  // CTA nudges
  const nudgeTxt = isAr ? "اطلب الآن 🛵" : (l==="en" ? "Order now 🛵" : "Commander maintenant 🛵");
  const nudgeSub = isAr ? "🛵 توصيل 45 دقيقة" : (l==="en" ? "🛵 45 min delivery" : "🛵 Livraison 45 min");
  const revTxt   = isAr ? "🛵 أريد نفس النتيجة" : (l==="en" ? "🛵 I want the same result" : "🛵 Je veux le même résultat");
  const revSub   = isAr ? "توصيل في 45 دقيقة · تطوان · مضيق · مرتيل" : (l==="en" ? "Delivery in 45 min · Tétouan · M'diq · Martil" : "Livraison en 45 min · Tétouan · M'diq · Martil");
  if($el("menu-nudge-txt"))    $el("menu-nudge-txt").textContent    = nudgeTxt;
  if($el("menu-nudge-sub"))    $el("menu-nudge-sub").textContent    = nudgeSub;
  if($el("reviews-nudge-txt")) $el("reviews-nudge-txt").textContent = revTxt;
  if($el("reviews-nudge-sub")) $el("reviews-nudge-sub").textContent = revSub;

  // Trust bar inside order modal
  

  // Sticky WA pill
  if($el("wa-sticky-lbl")) $el("wa-sticky-lbl").textContent = isAr ? "اطلب عبر واتساب" : (l==="en" ? "Order on WhatsApp" : "Commander sur WhatsApp");

  // Exit popup
  if($el("exit-title"))   $el("exit-title").textContent   = isAr ? "قبل المغادرة..." : (l==="en" ? "Before you go..." : "Avant de partir...");
  if($el("exit-sub"))     $el("exit-sub").textContent     = isAr ? "احصل على قائمة الطعام الكاملة وعروض اليوم مباشرة على واتساب 📲" : (l==="en" ? "Get the full menu + today's deals straight to your WhatsApp 📲" : "Reçois le menu complet + nos offres du jour directement sur ton WhatsApp 📲");
  if($el("exit-wa-lbl"))  $el("exit-wa-lbl").textContent  = isAr ? "أرسل القائمة على واتساب" : (l==="en" ? "Send menu to WhatsApp" : "Envoyer le menu sur WhatsApp");
  if($el("exit-dismiss")) $el("exit-dismiss").textContent = isAr ? "لا شكراً، سأغادر بدون وجبتي 😅" : (l==="en" ? "No thanks, leaving empty-handed 😅" : "Non merci, je pars sans mon repas 😅");

  // FAB label removed (single icon button now)

  // ── Delivery text ──
  $t("delivery-text", t.deliveryText);

  // ── Loyalty section (compact strip) ──
  $t("loy-eyebrow", t.loyEyebrow);
  $t("loy-title",   t.loyTitle);
  $t("tier-name-4", t.tierName4);
  if(t.tierOrd) t.tierOrd.forEach((v,i)=>$t("tier-ord-"+(i+1), v));
  // compact pts: just first perk as short text
  if(t.tierPerks) t.tierPerks.forEach((perks,i)=>{
    const el=$e("tier-perks-"+(i+1));
    if(el) el.textContent = perks[0] + (perks[1] ? " · " + perks[1].replace("sur chaque repas","").replace("على كل ماكلة","").replace("على كل وجبة","").trim() : "");
  });

  // ── Nutri-calc section ──
  $t("nutri-eyebrow",   t.nutriEyebrow);
  $t("nutri-title",     t.nutriTitle);
  $t("nutri-sub",       t.nutriSub);
  $t("nc-lbl-gender",   t.ncLblGender);
  $t("nc-lbl-age",      t.ncLblAge);
  $t("nc-lbl-weight",   t.ncLblWeight);
  $t("nc-lbl-height",   t.ncLblHeight);
  $t("nc-lbl-activity", t.ncLblActivity);
  $t("nc-lbl-goal",     t.ncLblGoal);
  $t("nc-male-lbl",     t.ncMale);
  $t("nc-female-lbl",   t.ncFemale);
  $t("nc-cut-lbl",      t.ncCut);
  $t("nc-main-lbl",     t.ncMain);
  $t("nc-bulk-lbl",     t.ncBulk);
  $t("nc-calc-btn",     t.ncCalcBtn);
  $t("nc-kcal-lbl",     t.ncKcalLbl);
  $t("nc-prot-lbl",     t.ncProtLbl);
  $t("nc-carb-lbl",     t.ncCarbLbl);
  $t("nc-fat-lbl",      t.ncFatLbl);
  $t("nc-dishes-lbl",   t.ncDishesLbl);
  $t("nc-disclaimer",   t.ncDisclaimer);
  if(t.ncActivities){
    const sel=$e("nc-activity");
    if(sel) [...sel.options].forEach((o,i)=>{ if(t.ncActivities[i]) o.text=t.ncActivities[i]; });
  }

  // ── Track modal ──
  $t("track-modal-title", t.trackTitle);
  $t("track-modal-sub",   t.trackSub);
  $t("track-eta-label",   t.trackEtaLbl);
  if(t.trackSteps) t.trackSteps.forEach((s,i)=>{
    $t("ts-"+i+"-title", s.t);
    $t("ts-"+i+"-desc",  s.d);
  });

  $t("chat-status-txt",   t.chatStatus);
  $t("persona-row-label", t.personaRowLabel);
  $t("cpb-employee-lbl",  t.cpbEmployee);  $t("cpb-sportif-lbl", t.cpbSportif);
  $t("cpb-famille-lbl",   t.cpbFamille);   $t("cpb-couple-lbl",  t.cpbCouple);
  $t("lead-submit-btn",   t.leadSubmit);
  $p("lead-name",  t.leadPlaceholderName);
  $p("lead-city",  t.leadPlaceholderCity);
  $p("lead-phone", t.leadPlaceholderPhone);
  $p("chat-inp",   t.chatInputPh);

  // ── Sync chat to new language ──
  const chatMsgs = $e("chat-msgs");
  if (chatMsgs) {
    chatHistory = [];
    chatMsgs.innerHTML = "";
    leadShown = false; leadDone = false; userMsgCount = 0;
    const leadForm  = $e("chat-lead-form");
    const inputArea = $e("chat-input-area");
    const chatWin   = $e("chat-window");
    if (leadForm)  leadForm.style.display  = "none";
    if (inputArea) inputArea.style.display = "block";
    if (chatWin)   chatWin.dir   = l === "ar" ? "rtl" : "ltr";
    chatMsgs.dir = l === "ar" ? "rtl" : "ltr";
    if (chatOpen) initChat();
  }
  try{ renderPlans(); }catch(e){}
  try{ renderDietFilters(); }catch(e){}
  try{ if(welcomeOpen()) renderWelcome(); }catch(e){}
  try{ if(ckOpen()) renderCheckout(); }catch(e){}
}

/* ═══════════════════════════════════════════
   STEPS / STATS
═══════════════════════════════════════════ */
function renderWWD() {
  const t = copy[lang]; const isAr = lang === "ar" || false;
  const $t = (id, val) => { const el = $e(id); if(el) el.textContent = val; };
  $t("wwd-eyebrow", t.wwdEyebrow);
  $t("wwd-title",   t.wwdTitle);
  $t("wwd-sub",     t.wwdSub);
  // WWD box names
  $t("wwd-c1-title", t.wwdB1 || "Nutrition IA");
  $t("wwd-c2-title", t.wwdB2 || "Cuisiné frais");
  $t("wwd-c3-title", t.wwdB3 || "45 min");
  $t("wwd-c4-title", t.wwdB4 || "17 plats");
  $t("wwd-c5-title", t.wwdB5 || "Chef IA");
  $t("rev-eyebrow",   t.revEyebrow   || "⭐ Avis Clients");
  $t("rev-title",     t.revTitle     || "Ce que disent nos clients");
  $t("rev-sub",       t.revSub       || "125+ personnes ont déjà commandé.");
  $t("rev-count-lbl", t.revCountLbl  || "Basé sur 125+ avis");
  renderReviews();
  // OTS section
  $t("ots-eyebrow",   t.otsEyebrow  || "🛵 Suivi en direct");
  $t("ots-s0",        t.otsS0       || "Commande reçue");
  $t("ots-s1",        t.otsS1       || "En préparation");
  $t("ots-s2",        t.otsS2       || "Emballage");
  $t("ots-s3",        t.otsS3       || "En route");
  $t("ots-active-lbl",t.otsActive   || "en cours...");
  $t("ots-cta-txt",   t.otsCta      || "Pas encore commandé ?");
  $t("ots-cta-btn",   t.otsCtaBtn   || "Commander →");
  $t("ots-eta-lbl",   t.otsEtaLbl   || "min estimées");

  const colors = ["--green","amber","indigo","--pink","teal"];
  const cls    = ["green","amber","indigo","pink","teal"];
  const wide   = [false, false, false, false, true];
  const grid   = document.querySelector(".wwd-grid");
  if (!grid) return;
  grid.innerHTML = t.wwdCards.map((c,i) => `
    <div class="wwd-card wwd-card--${cls[i]}${wide[i]?" wwd-card--wide":""}">
      <span class="wwd-icon">${c.icon}</span>
      <h3 class="wwd-card-title" style="text-align:${isAr?"right":"left"}">${c.title}</h3>
      <p  class="wwd-card-desc"  style="text-align:${isAr?"right":"left"}">${c.desc}</p>
      <span class="wwd-tag">${c.tag}</span>
    </div>`).join("");
  if (isAr) {
    const ey = $e("wwd-eyebrow");
    if (ey) ey.style.letterSpacing = "0";
  }
}

function renderSteps(){
  const t=copy[lang]; const isAr=lang==="ar"||false;
  $e("steps-grid").innerHTML = t.steps.map((s,i)=>`
    <div class="step-card" style="animation:slideUp .5s ${i*.1}s ease both">
      <div class="step-icon">${s.icon}</div>
      <div class="step-num">${i+1}</div>
      <div class="step-title ${isAr?"far":"fsyne"}" style="text-align:${isAr?"right":"left"}">${s.t}</div>
      <div class="step-desc  ${isAr?"far":"fb"}"    style="text-align:${isAr?"right":"left"}">${s.d}</div>
    </div>`).join("");
}

/* ═══════════════════════════════════════════
   INSCRITS LIVE COUNTER  125 → 873
   • +1 every 3 seconds
   • every 10 s: drops 3 one by one (−1 per 400ms), then resumes
   • reaches 873 → resets to 125 and loops
═══════════════════════════════════════════ */
let _counterVal   = 125;
let _counterTimer = null;
let _dropTimer    = null;
let _dropping     = false;
const COUNTER_TARGET = 873;
const COUNTER_START  = 125;

function _updateCounterEl(n) {
  const el  = $e("stat-inscrits");
  const lc  = $e("live-count");
  const cc  = $e("chip-count");
  const isAr = lang === "ar" || false;
  const txt = isAr ? "+" + n : n + "+";
  if (el) el.textContent = txt;
  if (lc) lc.textContent = txt;
  if (cc) cc.textContent = txt;
}

function startInscritCounter() {
  if (_counterTimer) clearInterval(_counterTimer);
  if (_dropTimer)    clearInterval(_dropTimer);
  _dropping  = false;
  _counterVal = COUNTER_START;
  _updateCounterEl(_counterVal);

  // Tick up +1 every 3 seconds
  _counterTimer = setInterval(() => {
    if (_dropping) return; // pause during drop
    if (_counterVal < COUNTER_TARGET) {
      _counterVal++;
      _updateCounterEl(_counterVal);
    } else {
      // Reached 873 → reset to 125 and loop
      _counterVal = COUNTER_START;
      _updateCounterEl(_counterVal);
    }
  }, 3000);

  // Every 10 seconds: drop 3 then resume
  _dropTimer = setInterval(() => {
    if (_dropping) return;
    _dropping = true;
    let drops = 0;
    const dropInterval = setInterval(() => {
      if (drops < 3) {
        if (_counterVal > COUNTER_START) {
          _counterVal--;
          _updateCounterEl(_counterVal);
        }
        drops++;
      } else {
        clearInterval(dropInterval);
        _dropping = false; // resume upward tick
      }
    }, 400);
  }, 15000);
}

/* ═══════════════════════════════════════════
   MENU
═══════════════════════════════════════════ */

function renderCuisineTabs(){
  const isAr=lang==="ar"||false;
  $e("cuisine-tabs").innerHTML = cuisineTabs.map(c=>`
    <button class="pill ${activeCuis===c.id?"active":""}" onclick="setCuisine('${c.id}')">
      ${c.flag} ${isAr?c.ar:c.fr}
    </button>`).join("");
}
function setCuisine(id){ activeCuis=id; renderCuisineTabs(); renderDishes(); }
function renderDietFilters(){
  $e("diet-filters").innerHTML = dietFilters.map(f=>`
    <button class="pill ${activeDiet===f?"active":""}" onclick="setDiet('${f}')">${DIET_LBL[lang==="ar"?"ar":lang==="en"?"en":"fr"][f]||f}</button>`).join("");
  const pl=$e("persona-tabs-label"); if(pl) pl.textContent={ar:"أبحث عن:",fr:"Je cherche pour :",en:"I'm looking for:"}[lang]||"Je cherche pour :";
}
const DIET_LBL={ar:{All:"الكل",Vegan:"نباتي صرف",Vegetarian:"نباتي","High Protein":"عالي البروتين"},fr:{All:"Tout",Vegan:"Vegan",Vegetarian:"Végétarien","High Protein":"Riche en protéines"},en:{All:"All",Vegan:"Vegan",Vegetarian:"Vegetarian","High Protein":"High Protein"}};
function setDiet(f){ activeDiet=f; renderDietFilters(); renderDishes(); }
function renderDishes(){
  const t=copy[lang]; const isAr=lang==="ar"||false;
  const q=$e("search").value.toLowerCase();
  const isSportifView = activePersonaMenu==="sportif";
  const filtered=dishes.filter(d=>{
    const ms=d.name.toLowerCase().includes(q)||d.ar.includes(q);
    const mf=activeDiet==="All"||d.f===filterMap[activeDiet];
    const mc=activeCuis==="all"||d.cuis===activeCuis;
    const mp=activePersonaMenu==="all"||(d.personas&&d.personas.includes(activePersonaMenu));
    return ms&&mf&&mc&&mp;
  });
  const emp = persona==="employee";
  const sw=document.querySelector(".menu-slider-wrap"); if(sw) sw.style.display = emp?"none":"";
  if(emp){ renderWeeklyPlan(); }
  const cb=$e("cart-bar");
  if(cart.length>0&&!emp){
    cb.style.display="flex";
    $e("cart-txt").textContent=t.cartMsg(cart.length);
    const total = cart.reduce((sum,id)=>{ const d=dishes.find(x=>x.id===id); return sum+(d?d.price:0); },0);
    const totalEl = $e("cart-total");
    if(totalEl) totalEl.textContent = total+" MAD";
    // Update mobile bar to show order CTA
    const mobBtn = $e("mob-bar-btn");
    const mobTitle = $e("mob-bar-title");
    if(mobBtn) mobBtn.textContent = isAr ? `🛒 اطلب الآن (${cart.length})` : (lang==="en" ? `🛒 Order (${cart.length})` : `🛒 Commander (${cart.length})`);
    if(mobTitle) mobTitle.textContent = isAr ? `${total} درهم · ${cart.length} طبق` : (lang==="en" ? `${total} MAD · ${cart.length} dish${cart.length>1?"es":""}` : `${total} MAD · ${cart.length} plat${cart.length>1?"s":""}`);
  }
  else {
    cb.style.display="none";
    // Reset mobile bar to default
    const mobBtn = $e("mob-bar-btn");
    const mobTitle = $e("mob-bar-title");
    if(mobBtn) mobBtn.textContent = isAr ? "شوف القائمة" : (lang==="en" ? "View menu" : "Voir le menu");
    if(mobTitle) mobTitle.textContent = isAr ? "🛵 اطلب الآن — 45 دقيقة" : (lang==="en" ? "🛵 Order Now — 45 min" : "🛵 Commander — 45 min");
  }
  if(!filtered.length){
    $e("dishes-list").innerHTML=`<div class="empty-state"><div class="big">🔍</div><p>${t.noResult}</p></div>`;
    return;
  }
  $e("dishes-list").innerHTML=filtered.map((d,i)=>`
    <div class="dish-card has-photo" style="animation-delay:${i*.04}s">
      <div class="dish-photo" data-e="${d.e}">
        ${d.img?`<img src="${d.img}" alt="${d.name}" loading="lazy" onerror="this.remove();this.parentNode&&0">`:""}
        ${d.badge?`<span class="tag-badge dish-badge-float">${d.badge}</span>`:""}
      </div>
      <div class="dish-body">
        <div class="${isAr?"dish-name dish-name-ar":"dish-name"}" style="text-align:${isAr?"right":"left"};font-size:14px;margin-bottom:4px;">
          <span class="nm-t">${isAr?d.ar:d.name}</span><span class="pr-in">${d.price} MAD</span>
        </div>
        <div class="dish-tags" style="justify-content:${isAr?"flex-end":"flex-start"};gap:4px;flex-wrap:wrap;margin-bottom:0;">
          <span class="tag-veg" style="font-size:10px;">${d.tag}</span>
        </div>
        <div class="dish-foot">
          <div class="dish-macros" style="flex-wrap:wrap;gap:6px;">
            <span>🔥 ${d.cal} kcal</span>
            ${isSportifView
              ? `<span class="macro-chip macro-p">P ${d.p}g</span><span class="macro-chip macro-c">C ${d.c}g</span><span class="macro-chip macro-f">F ${d.f_g}g</span>`
              : `<span>💪 ${d.p}g P</span>`
            }
            <span class="meta" style="margin:0;">⏱ ${d.t}m</span>
          </div>
          <button class="add-btn ${cart.includes(d.id)?"added":""}" onclick="toggleCart(${d.id})" aria-label="add">
            ${cart.includes(d.id)?"✓":"+"}
          </button>
        </div>
        <details class="dish-more"><summary>${isAr?"المكونات والحساسية":"Ingrédients & allergènes"}</summary><div class="dish-ing">${isAr?d.ing_ar:d.ing_fr}</div><div class="dish-al">⚠ ${isAr?d.al_ar:d.al_fr}</div></details>
      </div>
    </div>`).join("");
}

/* ═══ PERSONA PLANS — employee (weekly) · sportif (goal) · famille (qty) · couple (dinner for 2) ═══ */
let weekPlan=[[],[],[],[],[]], dayOn=[false,false,false,false,false], dayOk=[false,false,false,false,false], wpAdding=false, wpActive=0, wpPay="employee", wpPct=50;
let wpSub="pct", wpFixed=10, wpScope="day", wpWin="12:00", wpMeth="office", wpCompany="";
let famQty={}, famPeople=4;
let couplePlan=[null,null,null], coupleActive=0, coupleDay=0, coupleTime="20:00";
let sportGoal="maintain";
const WP_PAY={fr:{employee:"Je paie moi-même",company:"L'entreprise paie",hybrid:"Mixte (subvention)"},ar:{employee:"أدفع بنفسي",company:"الشركة تدفع",hybrid:"مشترك (دعم)"}};
const SP_GOALS={cut:{kcal:1800,p:140,fr:"Sèche",ar:"تنشيف"},maintain:{kcal:2200,p:130,fr:"Maintien",ar:"تثبيت"},bulk:{kcal:2800,p:170,fr:"Prise de masse",ar:"زيادة كتلة"}};
const $d=id=>$e(id);
const dish_=id=>dishes.find(x=>x.id===id);
const fmtD=d=>String(d.getUTCDate()).padStart(2,"0")+"/"+String(d.getUTCMonth()+1).padStart(2,"0");

/* Casablanca clock → target week (Monday) and closing time (Sunday 21:00) */
function casaNow(){
  const p=Object.fromEntries(new Intl.DateTimeFormat("en-GB",{timeZone:"Africa/Casablanca",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",hour12:false,weekday:"short"}).formatToParts(new Date()).map(x=>[x.type,x.value]));
  const dow={Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6,Sun:7}[p.weekday];
  return {today:new Date(Date.UTC(+p.year,+p.month-1,+p.day)),dow,hour:+p.hour%24};
}
function weekInfo(){
  const n=casaNow(); let add=8-n.dow; if(n.dow===7&&n.hour>=21) add+=7;
  const mon=new Date(n.today.getTime()+add*864e5);
  const close=new Date(mon.getTime()-864e5);
  const days=[0,1,2,3,4].map(i=>new Date(mon.getTime()+i*864e5));
  return {mon,close,days};
}
const DN={fr:["Lun","Mar","Mer","Jeu","Ven"],ar:["الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة"]};

function syncCart(){
  if(persona==="employee") cart=weekPlan.flatMap((a,i)=>dayOn[i]&&dayOk[i]?a:[]);
  else if(persona==="couple") cart=couplePlan.filter(x=>x!==null);
  else if(persona==="famille") cart=Object.entries(famQty).flatMap(([id,q])=>Array(q).fill(+id));
}
function wpIsOn(){return persona==="employee"||persona==="couple"||persona==="famille";}

function wpAssign(id){
  if(persona==="employee"){
    const arr=weekPlan[wpActive]; const k=arr.indexOf(id);
    if(k>-1) arr.splice(k,1); else arr.push(id);
    dayOk[wpActive]=false;            // editing a day un-confirms it
  }else if(persona==="couple"){
    const idx=couplePlan.indexOf(id);
    if(idx>-1&&idx===coupleActive) couplePlan[idx]=null;
    else{couplePlan[coupleActive]=id;const nx=couplePlan.findIndex((x,i)=>x===null&&i<2);if(nx>-1)coupleActive=nx;}
  }else if(persona==="famille"){
    famQty[id]=(famQty[id]||0)+1;
  }
  syncCart();renderPlans();renderDishes();
}
function famAdj(id,dl){famQty[id]=Math.max(0,(famQty[id]||0)+dl);if(!famQty[id])delete famQty[id];syncCart();renderPlans();renderDishes();}
function famPeopleSet(n){famPeople=n;renderPlans();}
function wpMenuDishes(){
  const q=($e("search")?.value||"").toLowerCase();
  return dishes.filter(d=>(d.name.toLowerCase().includes(q)||d.ar.includes(q))&&(activeDiet==="All"||d.f===filterMap[activeDiet])&&(activeCuis==="all"||d.cuis===activeCuis));
}
function wpPick(i){wpActive=i;wpAdding=false;renderPlans();const m=$e("wp-menu");if(m&&m.scrollIntoView)m.scrollIntoView({behavior:"smooth",block:"nearest"});}
function wpSetPay(k){wpPay=k;renderPlans();}
function wpSetPct(n){wpPct=n;renderPlans();}
function cpPick(i){coupleActive=i;renderPlans();}
function cpDay(i){coupleDay=i;renderPlans();}
function cpTime(t){coupleTime=t;renderPlans();}
function spGoal(k){sportGoal=k;renderPlans();}

function cartTotal(){return cart.reduce((a,id)=>a+(dish_(id)?.price||0),0);}
function dayTotal(i){return weekPlan[i].reduce((a,id)=>a+(dish_(id)?.price||0),0);}
function paySplit(tot){
  if(persona!=="employee"||wpPay==="employee")return{co:0,em:tot};
  if(wpPay==="company")return{co:tot,em:0};
  const share=amt=>Math.min(amt, wpSub==="pct"?Math.round(amt*wpPct/100):wpFixed);   // company share never exceeds the amount
  let co=0;
  if(wpScope==="week") co=share(tot);
  else co=[0,1,2,3,4].reduce((a,i)=>a+(dayOn[i]&&dayOk[i]?share(dayTotal(i)):0),0);
  return{co,em:tot-co};
}
function dayLabel(i){const w=weekInfo();return DN[lang==="ar"?"ar":"fr"][i]+" "+fmtD(w.days[i]);}
function nextOpenDay(from){for(let k=1;k<=5;k++){const i=(from+k)%5;if(dayOn[i]&&!dayOk[i])return i;}return -1;}
function wpConfirmDay(){
  if(!weekPlan[wpActive].length)return;
  dayOk[wpActive]=true; wpAdding=false; syncCart();
  const nx=nextOpenDay(wpActive); if(nx>-1){wpActive=nx;wpAdding=false;}
  renderPlans(); const m=$e(nx>-1?"wp-menu":"wp-final"); if(m&&m.scrollIntoView)m.scrollIntoView({behavior:"smooth",block:"start"});
}
function wpToggleDay(i){
  dayOn[i]=!dayOn[i]; wpAdding=false;
  if(!dayOn[i]){weekPlan[i]=[];dayOk[i]=false;}
  if(dayOn[i]&&(!dayOn[wpActive]||wpActive===i||dayOk[wpActive])){ if(dayOn[i]&&!dayOk[i]) wpActive=i; }
  if(!dayOn[wpActive]){const nx=dayOn.findIndex((o,j)=>o&&!dayOk[j]);wpActive=nx>-1?nx:Math.max(0,dayOn.findIndex(Boolean));}
  syncCart();renderPlans();
}
function wpAllDays(){
  const all=dayOn.every(Boolean); dayOn=dayOn.map(()=>!all);
  if(all){weekPlan=[[],[],[],[],[]];dayOk=[false,false,false,false,false];}
  wpActive=Math.max(0,dayOn.findIndex((o,j)=>o&&!dayOk[j]));wpAdding=false;syncCart();renderPlans();
}
function wpEditDay(i){wpActive=i;wpAdding=false;renderPlans();const m=$e("wp-menu");if(m&&m.scrollIntoView)m.scrollIntoView({behavior:"smooth",block:"nearest"});}
function wpAddMore(){dayOk[wpActive]=false;wpAdding=true;syncCart();renderPlans();}
function wpRemove(id){
  const arr=weekPlan[wpActive];const k=arr.indexOf(id);if(k>-1)arr.splice(k,1);
  if(!arr.length){dayOk[wpActive]=false;wpAdding=false;}   // nothing left → back to the full menu
  syncCart();renderPlans();
}
function wpClearDay(){weekPlan[wpActive]=[];dayOk[wpActive]=false;wpAdding=false;syncCart();renderPlans();}
function wpSet(k,v){ ({sub:()=>wpSub=v,scope:()=>wpScope=v,win:()=>wpWin=v,meth:()=>wpMeth=v})[k](); renderPlans(); }
function wpFixedSet(v){ wpFixed=Math.max(0,Math.min(500,parseInt(v)||0)); renderPlans(); }
function wpRequest(kind){
  const w=weekInfo(); const dn=[0,1,2,3,4].filter(i=>dayOn[i]&&dayOk[i]).map(i=>`${DN.fr[i]} ${fmtD(w.days[i])}`).join(", ")||"…";
  const txt = kind==="cancel"
    ? `Salam SAVY ! Demande d'ANNULATION 🛑\nJour(s) concerné(s): ${dn}\nNom / Entreprise: ${wpCompany}\nRaison: \n\n(Je comprends que l'annulation est soumise à approbation et qu'un jour déjà prêt ne peut pas être annulé automatiquement.)`
    : `Salam SAVY ! Demande de MODIFICATION ✏️\nJour(s) concerné(s): ${dn}\nNom / Entreprise: ${wpCompany}\nChangement souhaité: \n\n(Je comprends que la commande confirmée reste inchangée jusqu'à approbation.)`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(txt)}`,"_blank");
}
function renderPlans(){
  renderWeeklyPlan();renderPersonaPlan();
  if(typeof ckOpen==="function"&&ckOpen()) renderCheckout();
  const b=$d("cart-bar");if(b&&b.style.display!=="none"&&typeof renderCartBar==="function")renderCartBar();
}

function renderWeeklyPlan(){
  const box=$d("weekly-plan");if(!box)return;
  if(persona!=="employee"){box.style.display="none";return;}
  box.style.display="block";
  const ar=lang==="ar",L=ar?"ar":"fr",w=weekInfo(),T=(f,a)=>ar?a:f;
  const tot=cartTotal(),sp=paySplit(tot);
  const onDays=[0,1,2,3,4].filter(i=>dayOn[i]), okDays=onDays.filter(i=>dayOk[i]), allOk=onDays.length>0&&okDays.length===onDays.length;
  if(onDays.length&&!dayOn[wpActive]) wpActive=onDays[0];
  const chips=DN[L].map((dn,i)=>`<button class="${dayOn[i]?"on":""}" onclick="wpToggleDay(${i})">${dayOn[i]?"✓ ":""}${dn} <small>${fmtD(w.days[i])}</small></button>`).join("")+`<button class="${onDays.length===5?"on":""}" onclick="wpAllDays()">${T("📅 Toute la semaine","📅 كل الأسبوع")}</button>`;
  const days=onDays.map(i=>{const arr=weekPlan[i];const t=dayTotal(i);
    return `<div class="wp-day ${i===wpActive?"active":""} ${dayOk[i]?"ok":""}" onclick="wpPick(${i})"><b>${DN[L][i]}</b><small>${fmtD(w.days[i])}</small>${arr.length?`<span>${arr.length} ${T("plat(s)","أطباق")}</span><small>${t} MAD</small>${dayOk[i]?'<em style="font-size:14px;color:#16a34a">✔</em>':'<small style="color:#d97706">'+T("à confirmer","للتأكيد")+'</small>'}`:`<em>+</em>`}</div>`;}).join("");
  const pays=Object.keys(WP_PAY[L]).map(k=>`<button class="${k===wpPay?"on":""}" onclick="wpSetPay('${k}')">${WP_PAY[L][k]}</button>`).join("");
  const hybrid=wpPay==="hybrid"?`
    <div class="wp-sec"><div class="wp-lbl">${T("Type de subvention","نوع الدعم")}</div>
      <div class="wp-pay"><button class="${wpSub==="pct"?"on":""}" onclick="wpSet('sub','pct')">${T("Pourcentage","نسبة مئوية")}</button><button class="${wpSub==="fixed"?"on":""}" onclick="wpSet('sub','fixed')">${T("Montant fixe","مبلغ ثابت")}</button></div>
      <div class="wp-pay" style="margin-top:8px;align-items:center">${wpSub==="pct"?[25,50,75].map(x=>`<button class="${x===wpPct?"on":""}" onclick="wpSetPct(${x})">${T("Entreprise","الشركة")} ${x}%</button>`).join(""):`<input class="wp-fixed-inp" type="number" min="0" max="500" value="${wpFixed}" onchange="wpFixedSet(this.value)"> <span style="font-size:12px">MAD ${T("par","على")} ${wpScope==="day"?T("jour","اليوم"):T("semaine","الأسبوع")}</span>`}</div>
      <div class="wp-pay" style="margin-top:8px"><button class="${wpScope==="day"?"on":""}" onclick="wpSet('scope','day')">${T("Appliquée par jour","تُطبَّق على كل يوم")}</button><button class="${wpScope==="week"?"on":""}" onclick="wpSet('scope','week')">${T("Appliquée sur la semaine","تُطبَّق على الأسبوع")}</button></div>
      <div class="wp-note">${T("La part de l'entreprise ne dépasse jamais le montant concerné.","حصة الشركة لا تتجاوز أبداً المبلغ المعني.")}</div></div>`:"";
  const cur=wpActive, curArr=weekPlan[cur], curT=dayTotal(cur);
  const viewMode=dayOk[cur]&&!wpAdding&&curArr.length>0;
  const menu=!onDays.length?"":viewMode?`
    <div class="wp-menu" id="wp-menu"><div class="wp-lbl" style="margin-top:12px">✅ ${T("Vos plats pour","وجباتك ليوم")} ${dayLabel(cur)}</div>
      <div class="wp-grid">${curArr.map(id=>{const d=dish_(id);return `<div class="wp-dish sel"><div class="wp-ph"><img src="${d.img}" alt=""><span class="wp-ck">✓</span></div><div class="wp-nm"><span class="nm-t">${ar?d.ar:d.name}</span><span class="pr-in">${d.price} MAD</span></div><div class="wp-mt">🔥 ${d.cal} kcal · 💪 ${d.p}g</div><button class="wp-rm" onclick="wpRemove(${id})">✕ ${T("Retirer","إلغاء")}</button></div>`;}).join("")}</div>
      <div class="wp-act"><button onclick="wpAddMore()">＋ ${T("Ajouter un plat","إضافة طبق")}</button><button onclick="wpClearDay()">🗑️ ${T("Annuler ce jour","إلغاء اختيار اليوم")}</button></div>
      <div class="wp-note">${curArr.length} ${T("plat(s)","أطباق")} · ${curT} MAD</div></div>`:`
    <div class="wp-menu" id="wp-menu"><div class="wp-lbl" style="margin-top:12px">🍽️ ${T("Menu de","قائمة")} ${dayLabel(cur)} — ${T("choisissez 1, 2, 3 plats ou plus","اختر طبقاً أو طبقين أو ثلاثة أو أكثر")}</div>
      <div class="wp-grid">${wpMenuDishes().map(d=>`<div class="wp-dish ${curArr.includes(d.id)?"sel":""}" onclick="wpAssign(${d.id})"><div class="wp-ph"><img src="${d.img}" alt="" loading="lazy">${curArr.includes(d.id)?'<span class="wp-ck">✓</span>':""}</div><div class="wp-nm"><span class="nm-t">${ar?d.ar:d.name}</span><span class="pr-in">${d.price} MAD</span></div><div class="wp-mt">🔥 ${d.cal} kcal · 💪 ${d.p}g</div></div>`).join("")||`<div class="wp-note">${T("Aucun plat pour ce filtre.","لا توجد أطباق لهذا الفلتر.")}</div>`}</div>
      <div class="wp-confirm"><div><b>${dayLabel(cur)}</b><br><span>${curArr.length} ${T("plat(s)","أطباق")} · ${curT} MAD</span></div><button ${curArr.length?"":"disabled"} onclick="wpConfirmDay()">${T("Confirmer ce jour ✓","تأكيد هذا اليوم ✓")}</button></div></div>`;
  const recap=okDays.length?`<div class="wp-recap">${okDays.map(i=>`<div class="wp-rc"><b>${dayLabel(i)}</b> · ${dayTotal(i)} MAD<br><small>${weekPlan[i].map(id=>ar?dish_(id).ar:dish_(id).name).join(" + ")}</small> <a onclick="wpEditDay(${i})">${T("modifier","تعديل")}</a></div>`).join("")}</div>`:"";
  box.innerHTML=`
    <div class="wp-head"><div class="wp-title">${T("💼 Espace Employé — Commande de la semaine","💼 فضاء الموظف — طلب الأسبوع")}</div>
      <div class="wp-sub">${T(`Semaine du ${fmtD(w.days[0])} au ${fmtD(w.days[4])} · commande ouverte jusqu'au dimanche ${fmtD(w.close)} à 21:00 (heure Casablanca).`,`أسبوع ${fmtD(w.days[0])} → ${fmtD(w.days[4])} · الطلب مفتوح حتى الأحد ${fmtD(w.close)} الساعة 21:00 (توقيت الدار البيضاء).`)}</div></div>
    <div class="wp-lbl">${T("Choisissez un jour ou plusieurs","اختر يوماً واحداً أو عدة أيام")}</div>
    <div class="wp-pay" style="margin-bottom:10px">${chips}</div>
    ${onDays.length?`<div class="wp-lbl">${T("Composez chaque jour puis confirmez","كوّن كل يوم ثم أكّده")}</div>
    <div class="wp-days" style="grid-template-columns:repeat(${onDays.length},1fr)">${days}</div>`:`<div class="wp-note" style="text-align:center;padding:10px 0">${T("👆 Touchez un ou plusieurs jours pour commencer","👆 اضغط على يوم أو عدة أيام للبدء")}</div>`}
    ${menu}${recap}
    <div id="wp-final"></div>
    ${onDays.length?`    <div class="wp-total">${T(`${okDays.length}/${onDays.length} jours confirmés · Total ${tot} MAD`,`${okDays.length} من ${onDays.length} أيام مؤكدة · الإجمالي ${tot} MAD`)}${tot&&wpPay!=="employee"?T(` · Entreprise ${sp.co} / Vous ${sp.em} MAD`,` · الشركة ${sp.co} / أنت ${sp.em} MAD`):""}</div>
    <div class="wp-act"><button onclick="wpRequest('modify')">✏️ ${T("Demander une modification","طلب تعديل")}</button><button onclick="wpRequest('cancel')">🛑 ${T("Demander l'annulation d'un jour","طلب إلغاء يوم")}</button><button class="pri" ${allOk?"":"disabled"} onclick="openWhatsApp()">${allOk?"💬 "+T("Confirmer la semaine","تأكيد الأسبوع"):T(`Il reste ${onDays.length-okDays.length} jour(s) à confirmer`,`يتبقى ${onDays.length-okDays.length} يوم للتأكيد`)}</button></div>`:""}`;
}

function renderPersonaPlan(){
  const box=$d("persona-plan");if(!box)return;
  if(!["sportif","famille","couple"].includes(persona)){box.style.display="none";return;}
  box.style.display="block";const ar=lang==="ar",L=ar?"ar":"fr";let h="";
  if(persona==="sportif"){
    box.style.setProperty("--pp","#F59E0B");box.style.borderColor="#F59E0B";box.style.background="#FFFBEB";
    const g=SP_GOALS[sportGoal];const items=cart.map(dish_).filter(Boolean);
    const kc=items.reduce((a,d)=>a+d.cal,0),pr=items.reduce((a,d)=>a+d.p,0);
    const per=Math.round(g.kcal/3);
    h=`<div class="pp-title">🏋️ ${ar?"خطتك الرياضية":"Votre plan performance"}</div>
    <div class="pp-sub">${ar?"اختر هدفك ثم أضف وجباتك. نعرض السعرات والبروتين مقابل هدف اليوم (حوالي 3 وجبات).":"Choisissez votre objectif puis ajoutez vos repas. Calories et protéines comparées à l'objectif du jour (≈ 3 repas)."}</div>
    <div class="pp-chips">${Object.keys(SP_GOALS).map(k=>`<button class="${k===sportGoal?"on":""}" onclick="spGoal('${k}')">${SP_GOALS[k][L]}</button>`).join("")}</div>
    <div class="pp-stat">🔥 <span dir="ltr">${kc} / ${g.kcal} kcal</span></div><div class="pp-bar"><i style="width:${Math.min(100,kc/g.kcal*100)}%"></i></div>
    <div class="pp-stat">💪 <span dir="ltr">${pr} / ${g.p} g</span> ${ar?"بروتين":"protéines"}</div><div class="pp-bar"><i style="width:${Math.min(100,pr/g.p*100)}%"></i></div>
    <div class="pp-sub" style="margin:0">${ar?`مرجع: وجبة ≈ ${per} kcal`:`Repère : ≈ ${per} kcal par repas`}</div>`;
  }else if(persona==="famille"){
    box.style.setProperty("--pp","#14B8A6");box.style.borderColor="#14B8A6";box.style.background="#F0FDFA";
    const need=famPeople,have=cart.length;
    h=`<div class="pp-title">👨‍👩‍👧 ${ar?"طلب العائلة":"Commande famille"}</div>
    <div class="pp-sub">${ar?"كم عدد الأشخاص؟ أضف الأطباق (يمكن تكرار الطبق). نوصي بطبق لكل شخص.":"Combien de personnes ? Ajoutez les plats (un plat peut être répété). Repère : 1 plat par personne."}</div>
    <div class="pp-chips">${[2,3,4,5,6].map(n=>`<button class="${n===famPeople?"on":""}" onclick="famPeopleSet(${n})">${n} ${ar?"أشخاص":"pers."}</button>`).join("")}</div>
    ${Object.entries(famQty).map(([id,q])=>{const d=dish_(+id);return `<div class="pp-row"><span class="nm">${ar?d.ar:d.name}</span><span class="q"><button onclick="famAdj(${id},-1)">−</button><b>${q}</b><button onclick="famAdj(${id},1)">+</button></span><span>${d.price*q} MAD</span></div>`;}).join("")}
    <div class="pp-total">${have}/${need} ${ar?"أطباق":"plats"}${have<need?(ar?` · ينقص ${need-have}`:` · il manque ${need-have}`):" ✓"} · ${ar?"الإجمالي":"Total"} ${cartTotal()} MAD</div>`;
  }else{
    box.style.setProperty("--pp","#EC4899");box.style.borderColor="#EC4899";box.style.background="#FDF2F8";
    const now=casaNow(),days=[0,1].map(i=>new Date(now.today.getTime()+i*864e5));
    const slots=[ar?"الطبق الأول":"Plat 1",ar?"الطبق الثاني":"Plat 2",ar?"للمشاركة (اختياري)":"À partager (facultatif)"];
    h=`<div class="pp-title">💑 ${ar?"عشاء لشخصين":"Dîner à deux"}</div>
    <div class="pp-sub">${ar?"اختر الموعد ثم طبقين (وطبقاً للمشاركة إن أردت).":"Choisissez le créneau puis deux plats (et un plat à partager si vous voulez)."}</div>
    <div class="pp-chips">${days.map((d,i)=>`<button class="${i===coupleDay?"on":""}" onclick="cpDay(${i})">${i?(ar?"غداً":"Demain"):(ar?"اليوم":"Aujourd'hui")} ${fmtD(d)}</button>`).join("")}</div>
    <div class="pp-chips">${["19:30","20:00","20:30","21:00"].map(t=>`<button class="${t===coupleTime?"on":""}" onclick="cpTime('${t}')">${t}</button>`).join("")}</div>
    ${slots.map((sl,i)=>{const d=dish_(couplePlan[i]);return `<div class="pp-slot ${i===coupleActive?"active":""}" onclick="cpPick(${i})"><span>${sl}</span><b>${d?(ar?d.ar:d.name)+" · "+d.price+" MAD":"+"}</b></div>`;}).join("")}
    <div class="pp-total">${ar?"الإجمالي":"Total"} ${cartTotal()} MAD</div>`;
  }
  box.innerHTML=h;
}
function toggleCart(id){
  if(wpIsOn()){ wpAssign(id); return; }
  cart = cart.includes(id) ? cart.filter(x=>x!==id) : [...cart,id];
  renderPlans();
  renderDishes();
}

function menuSlide(dir) {
  const el = $e("dishes-list");
  if(!el) return;
  const cardW = el.querySelector(".dish-card")?.offsetWidth || 220;
  el.scrollBy({ left: dir * (cardW + 14) * 3, behavior:"smooth" });
}


/* ═══════════════════════════════════════════
   CHAT THEME — synced to persona
═══════════════════════════════════════════ */
function applyChatTheme(p) {
  const win = $e("chat-window");
  const fab = $e("fab-savy");
  if (win) win.setAttribute("data-persona", p || "employee");
  if (fab) fab.setAttribute("data-persona", p || "employee");
}

/* ═══════════════════════════════════════════
   PERSONA SELECTION (hero)
═══════════════════════════════════════════ */
function selectPersona(p, noScroll) {
  const prevPersona = persona;
  persona = p;
  ["employee","sportif","famille","couple"].forEach(x=>{
    const el=$e("pc-"+x);
    if(el){ el.className="persona-card"; if(x===p){ el.classList.add("active-"+x, "just-selected"); setTimeout(()=>el.classList.remove("just-selected"),400); } }
  });
  applyChatTheme(p);
  // Sync menu persona tab to match selected hero card
  activePersonaMenu = p;
  if(p!==prevPersona){ cart=[]; }
  syncCart();
  renderPlans();
  renderDishes();
  const hl  = $e("persona-highlight");
  const pbt = $e("ph-btn");
  const isAr = lang==="ar"||false;
  const configs = {
    employee:{ border:"var(--green)", bg:"var(--greenXL)", icon:"💼", title: isAr?"وجبة المكتب":"Repas Énergie", desc: isAr?"طاقة للعمل بدون خمول. مطبوخ بكل حب.":"Énergie soutenue toute la journée. Zéro fatigue post-déjeuner.", btnBg:"var(--green)", btnColor:"#fff", btnShadow:"rgba(0,128,96,0.35)", btnTxt: isAr?"اطلب وجبتي الآن 💼":"Commander mon repas 💼" },
    sportif: { border:"#F59E0B", bg:"#FFFBEB",            icon:"🏋️", title: isAr?"التغذية الرياضية":"Performance & Macros", desc: isAr?"ماكروز محسوبة بدقة لأهدافك الرياضية. 💪":"Macros calculés pour vos objectifs de performance. 💪", btnBg:"linear-gradient(135deg,#F59E0B,#FCD34D)", btnColor:"#78350F", btnShadow:"rgba(245,158,11,0.35)", btnTxt: isAr?"اطلب وجبة الرياضي 🏋️":"Commande Sport 🏋️" },
    famille: { border:"#14B8A6", bg:"#F0FDFA",            icon:"👨‍👩‍👧", title: isAr?"وجبة العائلة":"Menu Famille", desc: isAr?"أطباق للجميع — الكبير والصغير. طازج ومتوازن.":"Des plats pour tous — frais, équilibrés, généreux.", btnBg:"#14B8A6", btnColor:"#fff", btnShadow:"rgba(13,148,136,0.35)", btnTxt: isAr?"اطلب وجبة العائلة 👨‍👩‍👧":"Commander le Menu Famille 👨‍👩‍👧" },
    couple:  { border:"var(--pink)", bg:"var(--pinkXL)",  icon:"💑", title: isAr?"تجربة الزوجين":"Dîner en Amoureux", desc: isAr?"عشاء خاص مطبوخ بكل حب. لأن كل لحظة تستحق. 💕":"Un dîner élégant pour deux, préparé avec tout l'amour du monde. 💕", btnBg:"linear-gradient(135deg,var(--pink),var(--pinkL))", btnColor:"#fff", btnShadow:"rgba(233,30,140,0.35)", btnTxt: isAr?"اطلب عشاء الزوجين 💑":"Réserver mon Dîner 💑" },
  };
  const c = configs[p] || configs.employee;
  hl.style.borderColor = c.border;
  hl.style.background  = c.bg;
  $e("ph-icon").textContent  = c.icon;
  $e("ph-title").textContent = c.title;
  $e("ph-desc").textContent  = c.desc;
  pbt.style.background = c.btnBg;
  pbt.style.color      = c.btnColor;
  pbt.style.boxShadow  = `0 4px 14px ${c.btnShadow}`;
  pbt.textContent      = c.btnTxt;

  // ── Scroll to the menu filtered for this persona ──
  const menuSection = (p==="employee"&&$e("weekly-plan")) || $e("persona-plan") && ["sportif","famille","couple"].includes(p) && $e("persona-plan") || $e("menu");
  if (menuSection && !noScroll) {
    setTimeout(() => {
      menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }
}

function resetChatForPersona(p) {
  // Prepare chat state for this persona but do NOT open the window
  // Chat only opens when user explicitly clicks the SAVY FAB icon

  // Clear state
  chatHistory = [];
  leadShown   = false;
  leadDone    = false;
  userMsgCount = 0;
  const _msgs = $e("chat-msgs");
  const _lf   = $e("chat-lead-form");
  const _ia   = $e("chat-input-area");
  if(_msgs) _msgs.innerHTML = "";
  if(_lf)   _lf.style.display  = "none";
  if(_ia)   _ia.style.display = "block";

  // Brief transition indicator then new greeting
  const isAr = lang === "ar" || false;
  const labels = {
    employee: { fr:"💼 Mode Employé(e)", ar:"💼 وضع الموظف" },
    sportif:  { fr:"🏋️ Mode Sportif(ve)", ar:"🏋️ وضع الرياضي" },
    famille:  { fr:"👨‍👩‍👧 Mode Famille",     ar:"👨‍👩‍👧 وضع العائلة" },
    couple:   { fr:"💑 Mode Couple",        ar:"💑 وضع الزوجين" },
  };
  const lbl = (labels[p] || labels.employee)[isAr ? "ar" : "fr"];

  // Show a smooth mode-switch pill
  const msgs = $e("chat-msgs");
  const pill = document.createElement("div");
  pill.style.cssText = "text-align:center;margin:6px 0;";
  pill.innerHTML = `<span style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;background:var(--border);color:var(--muted);font-family:'Syne',sans-serif;">${lbl}</span>`;
  msgs.appendChild(pill);

  setTimeout(() => initChat(), 300);
}

/* ═══════════════════════════════════════════
   CHAT OPEN / CLOSE
═══════════════════════════════════════════ */
function openChat() {
  chatOpen = true;
  const cw = $e("chat-window");
  if(cw) cw.classList.add("open");
  if(chatHistory.length === 0) initChat();
}
function closeChat() {
  chatOpen = false;
  const cw = $e("chat-window");
  if(cw) cw.classList.remove("open");
}

/* ═══════════════════════════════════════════
   CHAT PERSONA (inside chat window)
═══════════════════════════════════════════ */
function chatSetPersona(p) {
  persona = p;
  applyChatTheme(p);
  ["employee","sportif","famille","couple"].forEach(x=>{
    const el=$e("cpb-"+x);
    if(el){ el.className="p-btn"; if(x===p) el.classList.add("sel-"+x); }
  });
  chatHistory = [];
  $e("chat-msgs").innerHTML = "";
  leadShown = false; leadDone = false; userMsgCount = 0;
  const rlf=$e("chat-lead-form"); if(rlf) rlf.style.display="none";
  const ria=$e("chat-input-area"); if(ria) ria.style.display="block";
  initChat();
}

/* ═══════════════════════════════════════════
   CHAT INIT — Groq generates the opening message
   Each seed tells Groq exactly who clicked, what
   SAVY already knows about them, and how to open.
═══════════════════════════════════════════ */
async function initChat() {
  const p    = persona || "employee";
  const isAr = lang === "ar" || false;

  // Per-persona seed — gives Groq full visitor context so the
  // opening is 100% tailored, not generic.
  const seeds = {
    employee: {
      fr: `[SYSTEM_OPEN:employee]
Un(e) professionnel(le) actif(ve) vient de sélectionner "Employé(e)" et d'ouvrir le chat.
Ce que tu sais déjà : cette personne travaille, son temps est limité au déjeuner, elle veut manger sain sans se fatiguer à choisir.
Ouvre la conversation en reconnaissant sa réalité de professionnel(le) actif(ve). Montre que tu comprends : pause courte, besoin d'énergie pour tenir l'après-midi, pas le temps de chercher.
Invite-la naturellement à te dire ce dont elle a envie aujourd'hui — sans poser de question fermée.`,
      ar: `[SYSTEM_OPEN:employee]
موظف أو موظفة اختار/ت "موظف/ة" وفتح/ت المحادثة.
ما تعرفه بالفعل: هذا الشخص يعمل، وقت الغداء محدود، يريد أكلاً صحياً وسريعاً بدون تعقيد.
افتح المحادثة بطريقة تُظهر أنك تفهم حياته/حياتها المهنية المشغولة. أشعره/أشعرها أنك هنا لتسهّل يومه/يومها.
ادعوه/ادعوها بشكل طبيعي لإخبارك بما يريد/تريد اليوم.`,
    },
    sportif: {
      fr: `[SYSTEM_OPEN:sportif]
Un(e) sportif(ve) vient de sélectionner "Sportif(ve)" et d'ouvrir le chat.
Ce que tu sais déjà : cette personne fait du sport, suit sa nutrition, s'intéresse aux protéines et aux macros.
Ouvre la conversation en reconnaissant son profil d'athlète. Montre que tu comprends les enjeux : récupération, protéines, énergie pour l'entraînement.
Invite-le/la naturellement à te parler de son objectif du moment — sans l'assommer de questions.`,
      ar: `[SYSTEM_OPEN:sportif]
رياضي أو رياضية اختار/ت "رياضي/ة" وفتح/ت المحادثة.
ما تعرفه: هذا الشخص يمارس الرياضة ويهتم بالتغذية والبروتين والماكروز.
افتح المحادثة بطريقة تُظهر أنك تفهم متطلبات الرياضي: استرداد، بروتين، طاقة للتمرين.
ادعوه/ادعوها بشكل طبيعي لإخبارك عن هدفه/هدفها الرياضي الحالي.`,
    },
    famille: {
      fr: `[SYSTEM_OPEN:famille]
Quelqu'un vient de sélectionner "Famille" et d'ouvrir le chat — il/elle commande pour plusieurs personnes.
Ce que tu sais déjà : cette personne a une famille à nourrir, veut des plats qui plaisent à tout le monde (grands et petits), cherche variété et générosité.
Ouvre la conversation chaleureusement en reconnaissant qu'on commande pour toute la famille. Montre que tu es prêt(e) à trouver quelque chose qui ravit tout le monde.
Invite-les naturellement à te dire combien ils sont et si y'a des enfants — pour mieux les conseiller.`,
      ar: `[SYSTEM_OPEN:famille]
شخص اختار "عائلة" وفتح المحادثة — يطلب لعدة أشخاص.
ما تعرفه: هذا الشخص يريد أطباقاً تناسب الجميع، كبير وصغير، تنوع وكرم.
افتح المحادثة بدفء وحرارة مُعترفاً بأن الطلب لعائلة كاملة. أشعره أنك هنا لإسعاد الجميع.
ادعوه بشكل طبيعي ليخبرك كم هم وإن كان هناك أطفال — حتى تنصحه بشكل أفضل.`,
    },
    couple: {
      fr: `[SYSTEM_OPEN:couple]
Un couple vient de sélectionner "Couple" et d'ouvrir le chat pour planifier un dîner romantique.
Ce que tu sais déjà : ces deux personnes veulent un beau dîner ensemble, cherchent quelque chose d'élégant et de mémorable, l'ambiance compte autant que la nourriture.
Ouvre avec chaleur et une pointe poétique — reconnais que c'est un moment spécial pour deux. Ne sois pas clinique.
Invite-les naturellement à te décrire l'ambiance qu'ils souhaitent ce soir — légère et raffinée, ou généreuse et chaleureuse.`,
      ar: `[SYSTEM_OPEN:couple]
زوجان أو زوجين اختارا "زوجان" وفتحا المحادثة لتنظيم عشاء رومانسي.
ما تعرفه: هذان الشخصان يريدان عشاءً جميلاً معاً، يبحثان عن شيء أنيق لا يُنسى، الأجواء تهمهما بقدر الطعام.
افتح بدفء ولمسة شاعرية — اعترف بأن هذه لحظة خاصة لاثنين.
ادعوهما بشكل طبيعي لإخبارك عن الأجواء التي يريدانها الليلة.`,
    },
  };

  const seedObj = seeds[p] || seeds.employee;
  const seedText = isAr ? seedObj.ar : seedObj.fr;

  showTyping();

  try {
    const res  = await fetch(GROQ_API_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        messages: [{ role: "user", content: seedText }],
        lang,
        persona: p,
      }),
    });
    const data = await res.json();
    let greeting = (data.reply || "").trim();

    // Strip the lead trigger if Groq somehow fires it on the opening
    greeting = greeting.replace("SAVY_GET_LEAD", "").trim();

    if (!greeting) throw new Error("empty");

    hideTyping();
    addBotMsg(greeting, p === "couple");
    // Seed goes into history as assistant turn so future context is clean
    chatHistory.push({ role: "assistant", content: greeting });

  } catch (e) {
    // True network / server error — show a minimal static opener
    hideTyping();
    const fallback = (false)
      ? "سلام ! 👋 أنا Chef SAVY — كيفاش نقدر نعاونك دابا ؟"
      : isAr
      ? "سلام ! 👋 أنا Chef SAVY — كيف نقدر نساعدك اليوم ؟"
      : "Bonjour ! 👋 Je suis Chef SAVY — comment puis-je vous aider aujourd'hui ?";
    addBotMsg(fallback, p === "couple");
    chatHistory.push({ role: "assistant", content: fallback });
  }
}

/* ═══════════════════════════════════════════
   MESSAGE RENDERERS
═══════════════════════════════════════════ */
function addBotMsg(text, isGlow=false) {
  const msgs = $e("chat-msgs");
  const div  = document.createElement("div");
  div.className = isGlow ? "msg-bot msg-glow" : "msg-bot";

  // Avatar
  const avatarDiv = document.createElement("div");
  avatarDiv.className = "msg-avatar";
  avatarDiv.innerHTML = `<svg width="16" height="16" viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="21" rx="13" ry="5" fill="#a7f3d0" opacity=".9"/>
    <rect x="27" y="16" width="26" height="14" rx="4" fill="#a7f3d0" opacity=".9"/>
    <ellipse cx="40" cy="13" rx="9.5" ry="8" fill="#a7f3d0"/>
    <rect x="26" y="28" width="28" height="20" rx="9" fill="#a7f3d0"/>
    <circle cx="34" cy="37" r="3.2" fill="#008060"/>
    <circle cx="46" cy="37" r="3.2" fill="#008060"/>
  </svg>`;

  // Bubble — safe text insertion with <br> for newlines only
  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  text.split("\n").forEach((line, i, arr) => {
    bubble.appendChild(document.createTextNode(line));
    if (i < arr.length - 1) bubble.appendChild(document.createElement("br"));
  });

  // Timestamp
  const timeDiv = document.createElement("div");
  timeDiv.className = "msg-time";
  timeDiv.textContent = _getTimeNow();

  // Reactions
  const reactRow = document.createElement("div");
  reactRow.className = "msg-reactions";
  ["👍","❤️","🔥"].forEach(emoji => {
    const btn = document.createElement("button");
    btn.className = "msg-react-btn";
    btn.textContent = emoji;
    btn.addEventListener("click", () => reactMsg(btn));
    reactRow.appendChild(btn);
  });

  const rightCol = document.createElement("div");
  rightCol.appendChild(bubble);
  rightCol.appendChild(timeDiv);
  rightCol.appendChild(reactRow);

  div.appendChild(avatarDiv);
  div.appendChild(rightCol);
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addUserMsg(text) {
  const msgs = $e("chat-msgs");
  const div  = document.createElement("div");
  div.className = "msg-user";

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.textContent = text;  // safe — no innerHTML

  const timeDiv = document.createElement("div");
  timeDiv.className = "msg-time";
  timeDiv.textContent = _getTimeNow() + " · ✓✓";

  const col = document.createElement("div");
  col.appendChild(bubble);
  col.appendChild(timeDiv);
  div.appendChild(col);
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = $e("chat-msgs");
  const div  = document.createElement("div");
  div.id = "typing-indicator";
  div.className = "msg-bot";
  div.innerHTML = `
    <div class="msg-avatar">
      <svg width="16" height="16" viewBox="0 0 80 80" fill="none">
        <ellipse cx="40" cy="21" rx="13" ry="5" fill="#a7f3d0" opacity=".9"/>
        <rect x="27" y="16" width="26" height="14" rx="4" fill="#a7f3d0" opacity=".9"/>
        <ellipse cx="40" cy="13" rx="9.5" ry="8" fill="#a7f3d0"/>
        <rect x="26" y="28" width="28" height="20" rx="9" fill="#a7f3d0"/>
        <circle cx="34" cy="37" r="3.2" fill="#008060"/>
        <circle cx="46" cy="37" r="3.2" fill="#008060"/>
      </svg>
    </div>
    <div class="msg-bubble">
      <div class="typing-dots"><span></span><span></span><span></span></div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}
function hideTyping() {
  const el = $e("typing-indicator");
  if(el) el.remove();
}

function setQuickChips(chips) {
  const el = $e("quick-chips");
  if(!el) return;
  el.innerHTML = "";
  const isCouple = persona === "couple";
  chips.forEach(c => {
    const icon = c.includes("menu") ? "🍽️"
               : c.includes("cal") || c.includes("kcal") ? "🔥"
               : c.includes("prot") || c.includes("macros") ? "💪"
               : c.includes("livr") ? "🛵"
               : c.includes("prix") ? "💳"
               : c.includes("ingr") ? "🥗"
               : "💬";
    const btn = document.createElement("button");
    btn.className = "q-chip-enhanced" + (isCouple ? " pink" : "");
    btn.textContent = icon + " " + c;
    btn.dataset.text = c;
    btn.addEventListener("click", () => chatSendText(btn.dataset.text));
    el.appendChild(btn);
  });
}

/* ═══════════════════════════════════════════
   CHAT SEND
═══════════════════════════════════════════ */
async function chatSend() {
  const inp  = $e("chat-inp");
  const text = inp.value.trim();
  if(!text || leadDone) return;
  inp.value = "";
  $e("quick-chips").innerHTML = "";
  await chatSendText(text);
}

async function chatSendText(text) {
  if(leadDone) return;
  addUserMsg(text);
  userMsgCount++;
  chatHistory.push({ role:"user", content:text });
  $e("chat-send-btn").disabled = true;
  showTyping();

  const isAr    = lang === "ar" || false;
  const p       = persona || "employee";
  const isCouple = p === "couple";

  try {
    const res  = await fetch(GROQ_API_URL, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ messages: chatHistory, lang, persona:p, ctx:{ cart:(typeof cart!=="undefined"&&Array.isArray(cart))?cart.slice(0,12):[], soldOut:((window.SAVY_CFG||{}).soldOut)||[], stock:((window.SAVY_CFG||{}).stock)||{}, prof:(window.savyMem&&window.savyMem.get())||null, nx:(window.savyNx&&window.savyNx.ctx())||null } })
    });
    const data = await res.json();
    let reply  = (data.reply||"").trim();
    let picks  = Array.isArray(data.dishes) ? data.dishes : [];
    // older server: parse the tag ourselves
    reply = reply.replace(/\[\[\s*ADD\s*:([^\]]*)\]\]/gi, (_,l)=>{ String(l).split(/[,\s]+/).forEach(x=>{const n=parseInt(x,10); if(n&&!picks.includes(n)) picks.push(n);}); return ""; }).trim();

    if(!reply) throw new Error("empty");
    if(data.profile&&window.savyMem)window.savyMem.offer(data.profile);
    if(data.allergyDropped)reply+=(lang==="ar"?"\n⚠️ حذفتُ بعض الأطباق احتياطاً بسبب الحساسية التي ذكرتَها.":(lang==="en"?"\n⚠️ I removed some dishes for safety because of your allergy.":"\n⚠️ J'ai retiré des plats par sécurité (allergie déclarée)."));

    // Lead form only when the assistant signals a confirmed chat order
    const triggerLead = reply.includes("SAVY_GET_LEAD");
    reply = reply.replace("SAVY_GET_LEAD","").trim();

    hideTyping();
    chatHistory.push({ role:"assistant", content:reply });
    window.__cxQuick=Array.isArray(data.quick)?data.quick:null;
    addBotMsg(reply, isCouple, picks);

    if(triggerLead && !leadShown) {
      setTimeout(() => showLeadForm(p), 800);
    }
  } catch(e) {
    hideTyping();
    const fallback = getFallbackReply(p, isAr, text);
    chatHistory.push({ role:"assistant", content: fallback.text });
    addBotMsg(fallback.text, isCouple);
  }

  $e("chat-send-btn").disabled = false;
  $e("chat-inp").focus();
}

/* ═══════════════════════════════════════════
   FALLBACK — only fires on network/API failure.
   Per-persona so even the error feels contextual.
═══════════════════════════════════════════ */
function getFallbackReply(p, isAr, userMsg) {
  const q = (userMsg||"").toLowerCase();

  // ── Keyword-matched static FAQ (works fully offline) ──────────────────
  const faq = [
    { keys:["livraison","delivery","توصيل","وصول","وقت"],
      fr:"🛵 Livraison en 45 min max à Tétouan, M'diq et Martil. Cuisine ouverte de 10h à 21h30.",
      ar:"🛵 التوصيل خلال 45 دقيقة إلى تطوان، مارتيل والمضيق. المطبخ يعمل من 10 صباحاً إلى 9:30 مساءً." },
    { keys:["prix","price","tarif","cost","سعر","تكلفة","ثمن"],
      fr:"💰 Nos plats vont de 7 à 55 MAD (entrées, plats, desserts). Paiement cash à la livraison.",
      ar:"💰 أسعارنا من 7 إلى 55 درهم (مقبلات، أطباق رئيسية، حلويات). الدفع نقداً عند التسليم." },
    { keys:["calories","calorie","kcal","macro","protéine","protein","بروتين","سعرات"],
      fr:"🔥 Chaque plat affiche ses calories et macros. Filtre par 'High Protein' ou 'Low Carb' dans le menu !",
      ar:"🔥 كل طبق يعرض السعرات والماكروز. فلتر 'بروتين عالي' أو 'كارب منخفض' في المنيو!" },
    { keys:["commande","order","commander","اطلب","طلب","كيف"],
      fr:"🍽️ Choisis tes plats → clique sur + → puis sur Commander. C'est tout !",
      ar:"🍽️ اختر أطباقك من المنيو → انقر إضافة → ثم 'اطلب الآن'. بسيط !" },
    { keys:["ingrédient","fresh","frais","طازج","مكونات"],
      fr:"✅ Tous nos plats sont préparés le jour même avec des ingrédients frais du marché local.",
      ar:"✅ كل أطباقنا تُحضَّر يوميًا بمكونات طازجة من السوق المحلي." },
    { keys:["allergi","allergen","gluten","حساسية","غلوتين"],
      fr:"⚠️ Informe-nous de tes allergies dans le message WhatsApp — notre chef adaptera ta commande.",
      ar:"⚠️ أخبرنا بحساسيتك عبر واتساب وسيتكيف الشيف مع طلبك." },
    { keys:["fidélité","loyalty","points","نقاط","ولاء","خصم"],
      fr:"🎁 Code SAVY10 : -10% sur ta première commande. Et tous les 10 commandes, un plat offert !",
      ar:"🎁 كود SAVY10: خصم 10% على أول طلب. وكل 10 طلبات تحصل على طبق هدية!" },
    { keys:["zone","ville","city","مدينة","منطقة","تطوان","مضيق","مارتيل"],
      fr:"📍 On livre à Tétouan, M'diq et Martil. D'autres zones arrivent bientôt !",
      ar:"📍 نوصّل إلى تطوان، المضيق ومارتيل. مناطق أخرى قريباً!" },
  ];

  for(const item of faq){
    if(item.keys.some(k=>q.includes(k))){
      return { text: (isAr ? item.ar : item.fr) + (isAr ? "\n\n_(وضع غير متصل — معلومات ثابتة)_" : "\n\n_(mode hors-ligne — info statique)_") };
    }
  }

  // ── Per-persona generic fallback ─────────────────────────────────────
  const msgs = {
    employee: {
      fr: "Petite coupure réseau 😕 Réessaie dans quelques secondes — ta pause déjeuner ne va pas attendre !",
      ar: "انقطع الاتصال لحظياً 😕 جرّب مجدداً — وقت الغداء لا ينتظر !",
    },
    sportif: {
      fr: "Connexion perdue un instant 😕 Réessaie vite, champion — tes macros t'attendent !",
      ar: "انقطع الاتصال للحظة 😕 جرّب مجدداً بطل — الماكروز في انتظارك !",
    },
    famille: {
      fr: "Petite coupure réseau 😕 Réessaie dans quelques secondes — toute la famille attend son repas !",
      ar: "انقطع الاتصال لحظياً 😕 جرّب مجدداً — العائلة تنتظر !",
    },
    couple: {
      fr: "Petite interruption 😕 Réessaie dans un instant — votre soirée mérite le meilleur 💑",
      ar: "انقطع الاتصال للحظة 😕 جرّب مجدداً — سهرتكم تستحق الأفضل 💑",
    },
  };
  const set = msgs[p] || msgs.employee;
  const key = isAr ? "ar" : "fr";
  return { text: set[key] };
}

/* ═══════════════════════════════════════════
   LEAD FORM
═══════════════════════════════════════════ */
function showLeadForm(p) {
  if(leadShown) return;
  leadShown = true;
  const isAr   = lang==="ar"||false;
  const isCouple = p==="couple";

  const prompt = isAr
    ? "ممتاز ! 🧬 لإتمام طلبكم، يرجى ملء المعلومات التالية :"
    : "Parfait ! 🧬 Pour finaliser votre commande, veuillez compléter vos informations ci-dessous :";
  addBotMsg(prompt, isCouple);

  setTimeout(() => {
    const hideIA=$e("chat-input-area"); if(hideIA) hideIA.style.display="none";
    const form = $e("chat-lead-form");
    form.style.display = "block";
    form.dir = isAr ? "rtl" : "ltr";
    if(isCouple) {
      $e("lead-submit-btn").className = "lead-submit lead-submit-pink";
      $e("lead-submit-btn").textContent = isAr ? "🌸 أرسل طلبي ✨" : "🌸 Envoyer ma commande ✨";
    }
    form.scrollIntoView({behavior:"smooth",block:"center"});
  }, 600);
}

/* ═══════════════════════════════════════════
   SUBMIT LEAD
═══════════════════════════════════════════ */
function submitLead() {
  const name  = ($e("lead-name").value  || "").trim();
  const city  = ($e("lead-city").value  || "").trim();
  const phone = ($e("lead-phone").value || "").trim();
  const isCouple = persona === "couple";
  const isAr   = lang === "ar" || false;

  const hi = (id) => {
    const el = $e(id);
    if(el){ el.style.borderColor = "#e53935"; setTimeout(() => el.style.borderColor = "", 1500); }
  };
  if(!name)  { showFieldError("lead-name",  "required"); return; }
  if(!city)  { showFieldError("lead-city",  "required"); return; }
  if(!phone) { showFieldError("lead-phone", "required"); return; }
  if(!validatePhone(phone)) { showFieldError("lead-phone", "phone"); return; }

  leadDone = true;
  const sbtn = $e("lead-submit-btn");
  if(sbtn){ sbtn.textContent = isAr ? "⏳ جاري..." : "⏳ ..."; sbtn.disabled = true; }

  saveToSheets({ name, city, phone, persona: persona || "employee", lang,
    conversation: chatHistory.filter(m => m.role === "user").map(m => m.content).join(" | ") });

  setTimeout(() => {
    const hideLF=$e("chat-lead-form"); if(hideLF) hideLF.style.display="none";
    const finalMsg = isAr
      ? `شكراً جزيلاً، ${name} ! 🍽️
طلبكم في يد شيفنا — سيُحضَّر بعناية وكل الحب ويُسلَّم خلال 45 دقيقة. ستصلكم رسالة تأكيد على WhatsApp. 💚`
      : `Merci beaucoup, ${name} ! 🍽️
Votre commande est entre les mains de notre chef — préparée avec soin et livrée dans 45 minutes. Vous recevrez une confirmation sur votre WhatsApp. 💚`;
    addBotMsg(finalMsg, isCouple);
    const cst = $e("chat-status-txt");
    if(cst) cst.textContent = isAr ? "✅ طلبك في الطريق — 45 دق ⏱️" : "✅ Commande en route — 45 min ⏱️";
    const waMsg = encodeURIComponent(`Salam SAVY ! Juste rempli le formulaire. Nom: ${name} · Adresse: ${city} · Je veux commander 🍽️`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${waMsg}`, "_blank");
    animateLoyaltyPoints(10);
  }, 1200);
}

/* ═══════════════════════════════════════════
   GOOGLE SHEETS
═══════════════════════════════════════════ */
function saveToSheets(data) {
  if(!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL.includes("PASTE")) return;
  try {
    const iframe = document.createElement("iframe");
    iframe.name  = "savy-sheet-frame";
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    const form = document.createElement("form");
    form.method = "POST";
    form.action = GOOGLE_SHEET_URL;
    form.target = "savy-sheet-frame";
    Object.entries(data).forEach(([k,v])=>{
      const inp = document.createElement("input");
      inp.type="hidden"; inp.name=k; inp.value=v||"";
      form.appendChild(inp);
    });
    document.body.appendChild(form);
    form.submit();
    setTimeout(()=>{ form.remove(); iframe.remove(); }, 3000);
  } catch(e) { console.warn("Sheets error:", e); }
}

/* ═══════════════════════════════════════════
   KEYBOARD AVOIDANCE — lift chat above keyboard
═══════════════════════════════════════════ */
(function initKeyboardAvoidance() {
  const inp = $e("chat-inp");
  const win = $e("chat-window");
  if (!inp || !win) return;

  function adjustChat() {
    if (!window.visualViewport) return;
    const vv        = window.visualViewport;
    const fullH     = window.innerHeight;
    const visibleH  = vv.height;
    const offset    = fullH - visibleH - vv.offsetTop;
    if (offset > 50) {
      // Keyboard is open — lift the chat window
      win.style.bottom    = (offset + 8) + "px";
      win.style.maxHeight = (visibleH - 90) + "px";
    } else {
      win.style.bottom    = "84px";
      win.style.maxHeight = "440px";
    }
  }

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", adjustChat);
    window.visualViewport.addEventListener("scroll", adjustChat);
  }

  inp.addEventListener("focus",  adjustChat);
  inp.addEventListener("blur",   () => {
    setTimeout(() => {
      win.style.bottom    = "84px";
      win.style.maxHeight = "440px";
    }, 200);
  });
})();

/* ═══════════════════════════════════════════
/* background removed — static design */



/* ═══════════════════════════════════════════
   REVIEWS / TESTIMONIALS
═══════════════════════════════════════════ */

const reviews = [
  { name:"Youssef B.", city:"Tétouan", persona:"sportif",  avatar:"YB", color:"#D97706",
    stars:5, tag:"💪 Sportif",
    fr:"Franchement incroyable. Les macros sont exactement ce qu'il me faut pour ma préparation. Livré en 38 minutes, encore chaud. SAVY a changé ma routine.",
    ar:"صراحة خدمة لا مثيل لها. المواد الغذائية بالضبط اللي كنت محتاجها لتحضيري. وصلت في 38 دقيقة وما زالت ساخنة. غيّر SAVY روتيني.",
    en:"Honestly incredible. The macros are exactly what I need for my training. Delivered in 38 minutes, still hot. SAVY changed my routine." },
  { name:"Salma E.", city:"M'diq", persona:"couple", avatar:"SE", color:"#be185d",
    stars:5, tag:"💑 Couple",
    fr:"On a commandé pour notre anniversaire. La présentation était magnifique, le goût encore mieux. Chef SAVY a vraiment cuisiné avec amour.",
    ar:"طلبنا في ذكرى زواجنا. التقديم كان رائعاً والطعم أروع. الشيف ساڤي طبخ بحب حقيقي.",
    en:"We ordered for our anniversary. The presentation was beautiful, the taste even better. Chef SAVY really cooked with love." },
  { name:"Karim A.", city:"Martil", persona:"employee", avatar:"KA", color:"#1E40AF",
    stars:5, tag:"💼 Employé",
    fr:"Je commande tous les midis depuis 3 semaines. Zéro fatigue post-déjeuner, je reste concentré toute l'après-midi. Meilleur investissement de ma journée.",
    ar:"أطلب كل يوم منذ 3 أسابيع. لا إجهاد بعد الغداء، أبقى مركّزاً طوال المساء. أفضل استثمار في يومي.",
    en:"I order every lunch for 3 weeks now. Zero post-lunch fatigue, I stay focused all afternoon. Best investment of my day." },
  { name:"Nadia M.", city:"Tétouan", persona:"famille", avatar:"NM", color:"#0D9488",
    stars:5, tag:"👨‍👩‍👧 Famille",
    fr:"Mes enfants ont adoré ! Ce qui m'impressionne c'est que chaque plat est adapté — les enfants ont mangé leur portion, moi la mienne. Bravo SAVY.",
    ar:"أحب أطفالي الطعام! ما يدهشني أن كل طبق كان مناسباً — الأطفال أكلوا حصتهم وأنا حصتي. أحسنت يا SAVY.",
    en:"My kids loved it! What impresses me is every portion is tailored — kids got their serving, I got mine. Well done SAVY." },
  { name:"Hamza O.", city:"M'diq", persona:"sportif", avatar:"HO", color:"#D97706",
    stars:5, tag:"💪 Sportif",
    fr:"Le calculateur nutritionnel m'a bluffé. J'ai mis mes données, il m'a recommandé exactement les plats qu'il me fallait. C'est vraiment intelligent.",
    ar:"حاسبة السعرات أذهلتني. أدخلت بياناتي وأوصى لي بالضبط بالأطباق التي احتجتها. ذكاء حقيقي.",
    en:"The nutrition calculator blew me away. I entered my data and it recommended exactly the dishes I needed. Genuinely smart." },
  { name:"Fatima Z.", city:"Tétouan", persona:"employee", avatar:"FZ", color:"#1E40AF",
    stars:5, tag:"💼 Employée",
    fr:"La livraison en 45 minutes c'est réel ! J'habite en haut de la ville et ça arrive toujours à l'heure. Le packaging est propre et bien isolé thermiquement.",
    ar:"توصيل 45 دقيقة حقيقي! أسكن فوق المدينة ودائماً يصل في الوقت. التغليف نظيف وجيد العزل.",
    en:"The 45-minute delivery is real! I live at the top of the city and it always arrives on time. Packaging is clean and well insulated." },
  { name:"Amine R.", city:"Martil", persona:"sportif", avatar:"AR", color:"#D97706",
    stars:5, tag:"💪 Sportif",
    fr:"Je suis coach sportif et je recommande SAVY à tous mes clients. Les portions sont précises, les ingrédients frais et l'IA connaît vraiment la nutrition.",
    ar:"أنا مدرب رياضي وأوصي بـ SAVY لجميع عملائي. الحصص دقيقة والمكونات طازجة والذكاء الاصطناعي يعرف التغذية فعلاً.",
    en:"I'm a sports coach and I recommend SAVY to all my clients. Portions are precise, ingredients fresh, and the AI truly understands nutrition." },
  { name:"Rim B.", city:"M'diq", persona:"couple", avatar:"RB", color:"#be185d",
    stars:5, tag:"💑 Couple",
    fr:"Mon mari et moi on a des objectifs différents — lui muscle, moi perte de poids. SAVY gère les deux en une seule commande. Magique !",
    ar:"أنا وزوجي لدينا أهداف مختلفة — هو بناء عضلات وأنا خسارة وزن. ساڤي يتعامل مع الاثنين في طلب واحد. سحر!",
    en:"My husband and I have different goals — him bulking, me cutting. SAVY handles both in one order. Magic!" },
  { name:"Omar S.", city:"Tétouan", persona:"employee", avatar:"OS", color:"#1E40AF",
    stars:5, tag:"💼 Employé",
    fr:"J'avais l'habitude de sauter le déjeuner au bureau. Maintenant je commande SAVY et je mange sainement en 5 minutes. Productivité au top.",
    ar:"كنت معتاداً على تخطي الغداء في المكتب. الآن أطلب SAVY وآكل بصحة في 5 دقائق. إنتاجية في أعلى مستوياتها.",
    en:"I used to skip lunch at the office. Now I order SAVY and eat healthy in 5 minutes. Productivity through the roof." },
  { name:"Kenza L.", city:"Martil", persona:"famille", avatar:"KL", color:"#0D9488",
    stars:5, tag:"👨‍👩‍👧 Famille",
    fr:"Trois enfants, trois goûts différents — et SAVY satisfait tout le monde. Le service client est également très réactif. On est clients à vie.",
    ar:"ثلاثة أطفال وثلاثة أذواق مختلفة — وساڤي يُرضي الجميع. خدمة العملاء أيضاً سريعة جداً. نحن عملاء مدى الحياة.",
    en:"Three kids, three different tastes — and SAVY satisfies everyone. Customer service is also super responsive. We're customers for life." },
  { name:"Tarik F.", city:"Tétouan", persona:"sportif", avatar:"TF", color:"#D97706",
    stars:5, tag:"💪 Sportif",
    fr:"Compétition dans 2 mois et SAVY est mon allié nutrition. Chaque repas est calculé pour ma phase de sèche. Résultats visibles en 3 semaines.",
    ar:"منافسة بعد شهرين وساڤي هو حليفي الغذائي. كل وجبة محسوبة لمرحلة التخفيف عندي. نتائج ظاهرة في 3 أسابيع.",
    en:"Competition in 2 months and SAVY is my nutrition ally. Every meal is calculated for my cutting phase. Visible results in 3 weeks." },
  { name:"Zineb H.", city:"M'diq", persona:"famille", avatar:"ZH", color:"#0D9488",
    stars:5, tag:"👨‍👩‍👧 Famille",
    fr:"Ce que j'aime le plus c'est la transparence sur les calories. Je sais exactement ce que mes enfants mangent. Plus besoin de stresser pour les repas.",
    ar:"ما أحبه أكثر هو الشفافية في السعرات الحرارية. أعرف بالضبط ما يأكله أطفالي. لا داعي للقلق على الوجبات بعد الآن.",
    en:"What I love most is the calorie transparency. I know exactly what my kids are eating. No more stressing about meals." },
];

renderWWD();
renderCuisineTabs();
renderDietFilters();
renderDishes();



/* ═══════════════════════════════════════════
   FAQ TOGGLE
═══════════════════════════════════════════ */
function toggleFaq(item) {
  const isOpen = item.classList.contains("open");
  document.querySelectorAll(".faq-item.open").forEach(el => el.classList.remove("open"));
  if (!isOpen) item.classList.add("open");
}

function renderReviews() {
  const isAr = lang === "ar" || false;
  const track = $e("rev-track");
  if(!track) return;

  // Build one set of cards
  const cards = reviews.map(r => {
    const txt = r[lang] || r.fr;
    return `<div class="rev-card">
      <div class="rev-card-top">
        <div class="rev-avatar" style="background:${r.color}">${r.avatar}</div>
        <div>
          <div class="rev-name">${r.name}</div>
          <div class="rev-meta">📍 ${r.city}</div>
        </div>
        <div class="rev-stars" style="margin-left:auto">★★★★★</div>
      </div>
      <p class="rev-text">${txt}</p>
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;">
        <span class="rev-tag">${r.tag}</span>
        <span class="rev-verified">${isAr ? "عميل موثّق" : (lang==="en" ? "Verified customer" : "Client vérifié")}</span>
      </div>
    </div>`;
  }).join("");

  // Duplicate for seamless infinite loop
  track.innerHTML = cards + cards;

  // Speed: 45s for full loop; pause on hover is CSS
  track.style.animationDuration = "45s";
}

window.addEventListener("resize", () => { renderReviews(); });

setLang('ar');

/* ═══════════════════════════════════════════
   STICKY MOBILE BOTTOM BAR
═══════════════════════════════════════════ */
(function initMobileBar() {
  const bar = $e("mobile-order-bar");
  if (!bar) return;

  // Only show on mobile (<600px)
  function isMobile() { return window.innerWidth < 600; }

  let barVisible = false;
  let heroBottom = 0;

  function calcHeroBottom() {
    const hero = $e("hero");
    if (hero) heroBottom = hero.getBoundingClientRect().bottom + window.scrollY;
  }

  function updateBar() {
    if (!isMobile()) { bar.classList.remove("mob-bar-visible"); barVisible = false; return; }
    const scrolled = window.scrollY;
    if (scrolled > heroBottom - 60 && !barVisible) {
      bar.classList.add("mob-bar-visible");
      barVisible = true;
    } else if (scrolled <= heroBottom - 60 && barVisible) {
      bar.classList.remove("mob-bar-visible");
      barVisible = false;
    }
  }

  // Update i18n text for bar
  function updateBarLang(l) {
    const isAr = l === "ar";
    const titleEl = $e("mob-bar-title");
    const subEl   = $e("mob-bar-sub");
    const btnEl   = $e("mob-bar-btn");
    if (titleEl) titleEl.textContent = isAr ? "🛵 اطلب الآن — 45 دقيقة" : (l==="en" ? "🛵 Order Now — 45 min" : "🛵 Commander — 45 min");
    if (subEl)   subEl.textContent   = isAr ? "💵 كاش عند التوصيل · تطوان" : (l==="en" ? "💵 Cash on delivery · Tétouan" : "💵 Cash à la livraison · Tétouan");
    if (btnEl)   btnEl.textContent   = isAr ? "شوف القائمة" : (l==="en" ? "View menu" : "Voir le menu");
    // Also update button action based on cart state
    if (btnEl) {
      btnEl.onclick = function() {
        if (typeof cart !== "undefined" && cart.length > 0) {
          openWhatsApp();
        } else {
          $e("menu").scrollIntoView({ behavior: "smooth" });
        }
      };
    }
  }

  calcHeroBottom();
  window.addEventListener("scroll", updateBar, { passive: true });
  window.addEventListener("resize", () => { calcHeroBottom(); updateBar(); });

  // Hook into setLang — patch it to also call updateBarLang
  const _origSetLang = window.setLang;
  window.setLang = function(l) { _origSetLang(l); updateBarLang(l); };
  // Init with current lang
  updateBarLang(typeof lang !== "undefined" ? lang : "ar");
})();

/* ═══════════════════════════════════════════
   EXIT INTENT
═══════════════════════════════════════════ */

/* ═══ WELCOME CHOOSER — "Who are you ordering for?" shown first ═══ */
function renderWelcome(){
  const t=copy[lang]||copy.fr, ar=lang==="ar";
  const set=(id,v)=>{const e=$e(id);if(e)e.textContent=v;};
  set("welcome-title",t.personaLabel.replace(/^🍽️\s*/,"🍽️ "));
  set("welcome-sub",{ar:"اختر وسنفتح لك القسم المناسب مباشرة",fr:"Choisissez et nous vous menons directement à la bonne section",en:"Pick one and we'll take you straight to your section"}[lang]||"");
  ["employee","sportif","famille","couple"].forEach(p=>{const k=p[0].toUpperCase()+p.slice(1);set("wl-"+p+"-lbl",t["pc"+k+"Lbl"]);set("wl-"+p+"-desc",t["pc"+k+"Desc"]);});
  set("wl-skip",{ar:"تصفّح الموقع أولاً",fr:"Parcourir le site d'abord",en:"Browse the site first"}[lang]||"");
  document.querySelectorAll(".wl-langs button").forEach(b=>b.classList.toggle("on",b.dataset.l===lang));
}
function welcomeOpen(){return $e("welcome-overlay")?.classList.contains("open");}
function openWelcome(){renderWelcome();$e("welcome-overlay").classList.add("open");document.body.style.overflow="hidden";}
function closeWelcome(){$e("welcome-overlay").classList.remove("open");document.body.style.overflow="";try{sessionStorage.setItem("savy_welcome","1");}catch(e){}}
function chooseWho(p){try{sessionStorage.setItem("savy_welcome","1");}catch(e){} location.href=p+".html";}
window.addEventListener("load",()=>{ if(!document.querySelector("#welcome-overlay")) return; let seen=false;try{seen=sessionStorage.getItem("savy_welcome")==="1";}catch(e){} if(!seen||/[?&]choose=1/.test(location.search))openWelcome();});


/* ═══ CHECKOUT POPUP — personal info + (employee) delivery slot & payment ═══ */
let ck={name:"",phone:"",city:"Tétouan",address:"",notes:""};
const CK_T={
 ar:{title:"أكمل معلوماتك لتأكيد الطلب",name:"الاسم الكامل",phone:"رقم الهاتف",city:"المدينة",addr:"العنوان (الحي، الشارع، الطابق / اسم الشركة)",company:"اسم الشركة (اختياري)",notes:"ملاحظات (اختياري)",go:"💬 إرسال الطلب عبر واتساب",e1:"أدخل اسمك",e2:"أدخل رقم هاتف صحيح",e3:"أدخل عنوان التوصيل",sum:"ملخص طلبك",done:"تم تجهيز طلبك!",done2:"فتحنا واتساب برسالة جاهزة — اضغط إرسال هناك لإتمام الطلب.",reopen:"فتح واتساب مجدداً",close:"إغلاق",slot:"موعد التوصيل (موعد واحد لكل الأسبوع)",pay:"من يدفع؟",office:"🏢 توصيل إلى المكتب",pickup:"🛍️ استلام"},
 fr:{title:"Vos informations pour confirmer la commande",name:"Nom complet",phone:"Téléphone",city:"Ville",addr:"Adresse (quartier, rue, étage / entreprise)",company:"Entreprise (facultatif)",notes:"Remarques (facultatif)",go:"💬 Envoyer la commande sur WhatsApp",e1:"Entrez votre nom",e2:"Entrez un numéro valide",e3:"Entrez l'adresse de livraison",sum:"Récapitulatif",done:"Commande prête !",done2:"WhatsApp s'est ouvert avec le message prêt — appuyez sur Envoyer pour finaliser.",reopen:"Rouvrir WhatsApp",close:"Fermer",slot:"Créneau de livraison (un seul pour toute la semaine)",pay:"Qui paie ?",office:"🏢 Livraison au bureau",pickup:"🛍️ Retrait"},
 en:{title:"Your details to confirm the order",name:"Full name",phone:"Phone",city:"City",addr:"Address (area, street, floor / company)",company:"Company (optional)",notes:"Notes (optional)",go:"💬 Send order on WhatsApp",e1:"Enter your name",e2:"Enter a valid phone number",e3:"Enter the delivery address",sum:"Order summary",done:"Order ready!",done2:"WhatsApp opened with your message — press Send there to finish.",reopen:"Reopen WhatsApp",close:"Close",slot:"Delivery slot (one for the whole week)",pay:"Who pays?",office:"🏢 Office delivery",pickup:"🛍️ Pickup"}
};
function ckT(){return CK_T[lang]||CK_T.fr;}
function ckTail(){
  const bits=[]; if(ck.name) bits.push(`👤 Nom: ${ck.name}`); if(ck.phone) bits.push(`📞 Tél: ${ck.phone}`);
  if(ck.address) bits.push(`📍 Adresse: ${ck.city} — ${ck.address}`); if(ck.notes) bits.push(`📝 ${ck.notes}`);
  return (bits.length?"\n"+bits.join("\n"):"\n📍 Adresse: \n👤 Nom: ")+"\n\n(Code SAVY10 si 1ère commande 🎁)";
}
function ckStatsHtml(){
  const ar=lang==="ar", T=(f,a,e)=>ar?a:(lang==="en"?e:f), n=cart.length, tot=cartTotal();
  let h=`<div class="ck-stat"><div class="n">${n}</div><div class="l">🍽️ ${T("repas","وجبة","meals")}</div></div>
         <div class="ck-stat price"><div class="n">${tot}<small>MAD</small></div><div class="l">💰 ${T("total","الإجمالي","total")}</div></div>`;
  if(persona==="employee"&&wpPay!=="employee"&&tot){const sp=paySplit(tot);
    h+=`<div class="ck-split"><span>🏢 ${T("Entreprise","الشركة","Company")} <b>${sp.co} MAD</b></span><span>👤 ${T("Vous","أنت","You")} <b>${sp.em} MAD</b></span></div>`;}
  return h;
}
function renderCheckoutExtras(){
  const box=$e("ck-extras"); if(!box) return;
  const t=ckT(), L=lang==="ar"?"ar":"fr", T=(f,a)=>lang==="ar"?a:f;
  $e("ck-extras-card").style.display=persona==="employee"?"":"none";
  if(persona!=="employee"){box.innerHTML="";return;}
  const pays=Object.keys(WP_PAY[L]).map(k=>`<button class="${k===wpPay?"on":""}" onclick="wpSetPay('${k}')">${WP_PAY[L][k]}</button>`).join("");
  const hybrid=wpPay==="hybrid"?`<div class="wp-pay" style="margin-top:8px"><button class="${wpSub==="pct"?"on":""}" onclick="wpSet('sub','pct')">${T("Pourcentage","نسبة")}</button><button class="${wpSub==="fixed"?"on":""}" onclick="wpSet('sub','fixed')">${T("Montant fixe","مبلغ ثابت")}</button></div>
    <div class="wp-pay" style="margin-top:8px;align-items:center">${wpSub==="pct"?[25,50,75].map(x=>`<button class="${x===wpPct?"on":""}" onclick="wpSetPct(${x})">${T("Entreprise","الشركة")} ${x}%</button>`).join(""):`<input class="wp-fixed-inp" type="number" min="0" max="500" value="${wpFixed}" onchange="wpFixedSet(this.value)"> <span style="font-size:12px">MAD</span>`}</div>
    <div class="wp-pay" style="margin-top:8px"><button class="${wpScope==="day"?"on":""}" onclick="wpSet('scope','day')">${T("Par jour","على كل يوم")}</button><button class="${wpScope==="week"?"on":""}" onclick="wpSet('scope','week')">${T("Sur la semaine","على الأسبوع")}</button></div>`:"";
  box.innerHTML=`<div class="ck-sec">🕛 ${t.slot}</div>
    <div class="wp-pay">${["12:00","12:30","13:00","13:30"].map(x=>`<button class="${x===wpWin?"on":""}" onclick="wpSet('win','${x}')">${x}</button>`).join("")}</div>
    <div class="wp-pay" style="margin:8px 0 14px"><button class="${wpMeth==="office"?"on":""}" onclick="wpSet('meth','office')">${t.office}</button><button class="${wpMeth==="pickup"?"on":""}" onclick="wpSet('meth','pickup')">${t.pickup}</button></div>
    <div class="ck-sec">💳 ${t.pay}</div><div class="wp-pay">${pays}</div>${hybrid}
    <div class="wp-note" style="margin-bottom:6px">${T("Paiement cash à la livraison pour la part de l'employé. Paiement en ligne bientôt.","الدفع نقداً عند التسليم لحصة الموظف. الدفع الإلكتروني قريباً.")}</div>`;
  const sm=$e("ck-sum"); if(sm) sm.innerHTML=ckStatsHtml();
}
function renderCheckout(){
  const t=ckT(), set=(i,v)=>{const e=$e(i);if(e)e.textContent=v;};
  set("ck-title",t.title);set("ck-l-name",t.name);set("ck-l-phone",t.phone);set("ck-l-addr",t.addr);set("ck-l-company",t.company);set("ck-l-notes",t.notes);set("ck-go",t.go);
  set("ck-sec-info",{ar:"📦 معلومات التوصيل",fr:"📦 Informations de livraison",en:"📦 Delivery details"}[lang]||"📦");
  $e("ck-sum").innerHTML=ckStatsHtml();
  $e("ck-city").innerHTML=["Tétouan","M'diq","Martil"].map(c=>`<button class="${c===ck.city?"on":""}" onclick="ck.city='${c}';renderCheckout()">${c}</button>`).join("");
  $e("ck-f-company").style.display=persona==="employee"?"":"none";
  $e("ck-company").value=wpCompany;
  renderCheckoutExtras();
}
function ckOpen(){return $e("checkout-overlay")?.classList.contains("open");}
function openCheckout(){
  $e("ck-form").style.display="";$e("ck-done").style.display="none";
  ["ck-name","ck-phone","ck-addr","ck-notes"].forEach((i,k)=>{$e(i).value=[ck.name,ck.phone,ck.address,ck.notes][k];$e(i).classList.remove("bad");});
  $e("ck-err").textContent="";
  renderCheckout();
  $e("checkout-overlay").classList.add("open");document.body.style.overflow="hidden";
}
function closeCheckout(){$e("checkout-overlay").classList.remove("open");document.body.style.overflow="";}
function submitCheckout(){
  const t=ckT(), digits=(ck.phone||"").replace(/\D/g,"");
  const bad=[["ck-name",!ck.name.trim(),t.e1],["ck-phone",digits.length<9,t.e2],["ck-addr",!ck.address.trim(),t.e3]];
  bad.forEach(([i,b])=>$e(i).classList.toggle("bad",b));
  const first=bad.find(x=>x[1]); if(first){$e("ck-err").textContent=first[2];$e(first[0]).focus();return;}
  $e("ck-err").textContent="";
  sendOrderWhatsApp();
  $e("ck-form").style.display="none";
  const d=$e("ck-done");d.style.display="";
  d.innerHTML=`<div style="font-size:44px">✅</div><h3>${t.done}</h3><p style="font-size:13px;color:var(--sub);line-height:1.7">${t.done2}</p><button class="ck-go" onclick="sendOrderWhatsApp(true)">${t.reopen}</button><button class="wl-skip" onclick="closeCheckout()">${t.close}</button>`;
}

let exitShown = false;

function showExitPopup() {
  if(exitShown || welcomeOpen() || ckOpen()) return;
  // Don't show if order was already submitted
  if($e("order-track-section")?.style.display !== "none" &&
     $e("order-track-section")?.style.display !== "") return;
  exitShown = true;
  $e("exit-overlay").classList.add("open");
}

function closeExitPopup() {
  $e("exit-overlay").classList.remove("open");
}

// Desktop: mouse leaves toward top of page
document.addEventListener("mouseleave", e => {
  if(e.clientY < 60) showExitPopup();
});

// Mobile: page hidden (app switch / tab change)
// (disabled: popup on app switch annoyed mobile visitors)

// Close on overlay click
$e("exit-overlay").addEventListener("click", function(e) {
  if(e.target === this) closeExitPopup();
});


/* ═══════════════════════════════════════════
   WHATSAPP INTEGRATION
═══════════════════════════════════════════ */
const WA_NUMBER = "212708700830";

function buildCartMessage() {
  const items = cart.map(id => dishes.find(x => x.id === id)).filter(Boolean);
  if(!items.length) return null;
  const total = items.reduce((s,d) => s + d.price, 0);
  const tail = ckTail();
  let text;
  if(persona==="employee"){
    const w=weekInfo(), co=wpCompany.trim(), sp=paySplit(total);
    const wl=[0,1,2,3,4].filter(i=>dayOn[i]&&dayOk[i]).map(i=>`📅 ${DN.fr[i]} ${fmtD(w.days[i])} — ${dayTotal(i)} MAD\n`+weekPlan[i].map(id=>`   • ${dish_(id).name} — ${dish_(id).price} MAD`).join("\n")).join("\n");
    const pay=wpPay==="hybrid"?`Mixte — ${wpSub==="pct"?wpPct+"%":wpFixed+" MAD"} ${wpScope==="day"?"par jour":"sur la semaine"} → entreprise ${sp.co} MAD / employé ${sp.em} MAD`:WP_PAY.fr[wpPay];
    text=`Salam SAVY ! Commande de la semaine (Formule Entreprise) 💼\n\n${wl}\n\n💰 Total: ${total} MAD\n💳 Paiement: ${pay}\n🕛 Créneau: ${wpWin} (une livraison pour la semaine) · ${wpMeth==="office"?"Livraison bureau":"Retrait"}\n🏢 Entreprise: ${co}`+tail;
  }else if(persona==="couple"){
    const day=coupleDay?"demain":"aujourd'hui";
    const sl=["Plat 1","Plat 2","À partager"];
    const l=couplePlan.map((id,i)=>{const d=dish_(id);return d?`• ${sl[i]}: ${d.name} — ${d.price} MAD`:null;}).filter(Boolean).join("\n");
    text=`Salam SAVY ! Dîner à deux 💑 (${day} à ${coupleTime})\n\n${l}\n\n💰 Total: ${total} MAD`+tail;
  }else if(persona==="famille"){
    const l=Object.entries(famQty).map(([id,q])=>{const d=dish_(+id);return `• ${q}× ${d.name} — ${d.price*q} MAD`;}).join("\n");
    text=`Salam SAVY ! Commande famille 👨‍👩‍👧 (${famPeople} personnes)\n\n${l}\n\n💰 Total: ${total} MAD`+tail;
  }else{
    const lines = items.map(d => `• ${d.name} — ${d.price} MAD`).join("\n");
    const sg=persona==="sportif"?`\n🎯 Objectif: ${SP_GOALS[sportGoal].fr} (${items.reduce((a,d)=>a+d.cal,0)} kcal · ${items.reduce((a,d)=>a+d.p,0)}g P)\n`:"\n";
    text=`Salam SAVY ! Bghit ncommande 🍽️\n\n${lines}\n${sg}💰 Total: ${total} MAD`+tail;
  }
  return { items, total, text };
}

function openWhatsApp() {
  if(cart.length===0 && document.querySelector("#welcome-overlay")){ openWelcome(); return; }   // home page: pick a profile first
  if(persona==="employee"){
    const on=[0,1,2,3,4].filter(i=>dayOn[i]);
    if(on.some(i=>!dayOk[i])){ const p=$e("weekly-plan"); if(p&&p.scrollIntoView) p.scrollIntoView({behavior:"smooth",block:"start"}); return; }   // finish & confirm every chosen day first
  }
  if(cart.length>0 && buildCartMessage()){ openCheckout(); return; }   // confirm → collect personal info first
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Salam ! Bghit ncommande mn SAVY 🍽️ — wayla nshof le menu. 3afak ayda liya 🙏")}`, "_blank");
}
function sendOrderWhatsApp(reopen) {
  const order = buildCartMessage(); if(!order) return;
  if(!reopen) {
    try{ window.gtag && gtag("event","whatsapp_click"); }catch(e){}
    saveToSheets({
      name: ck.name, city: ck.city, phone: ck.phone,
      persona: persona || "", lang: lang || "",
      conversation: (persona==="employee" ? "[Entreprise "+(wpCompany||"-")+"] " : "") + order.items.map(d => d.name).join(" | ") + (ck.address?(" || "+ck.address):""),
      order_total: order.total
    });
  }
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(order.text)}`, "_blank");
}

function openWhatsAppOrder() {
  const dish = chatHistory.find(m => m.role === "user");
  const context = dish ? encodeURIComponent(`Salam SAVY ! J'ai discuté avec votre chef IA et je voudrais commander. Mon choix: ${dish.content}`) 
                       : encodeURIComponent("Salam ! Bghit ncommande mn SAVY 🍽️");
  window.open(`https://wa.me/${WA_NUMBER}?text=${context}`, "_blank");
}

function animateLoyaltyPoints(add) {
  const el = $e("loyalty-pts");
  if(!el) return;
  let cur = parseInt(el.textContent) || 120;
  const target = cur + add;
  const step = () => { if(cur < target) { cur++; el.textContent = cur; requestAnimationFrame(step); } };
  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════════
   INLINE ORDER TRACKING (post-submit)
═══════════════════════════════════════════ */
let _otsTimer = null;
let _otsStep  = 1;
const OTS_ETA   = [28, 22, 12, 5];
const OTS_FILLS = [35, 55, 78, 100];

function showOrderTracking(customerName) {
  const section = $e("order-track-section");
  if(!section) return;
  section.style.display = "";  // reveal section

  // Show the navbar tracking button
  const navBtn = $e("nav-track-btn");
  if(navBtn) navBtn.style.display = "flex";

  // Reset to step 1 (received done, preparing active)
  _otsStep = 1;
  _otsRender();

  // Highlight section with a flash
  section.style.transition = "box-shadow .4s";
  section.style.boxShadow  = "0 0 0 3px var(--green)";
  setTimeout(() => { section.style.boxShadow = ""; }, 1800);

  // Scroll to it smoothly
  setTimeout(() => {
    section.scrollIntoView({ behavior:"smooth", block:"center" });
  }, 300);

  // Simulate step progression every 8s
  if(_otsTimer) clearInterval(_otsTimer);
  _otsTimer = setInterval(() => {
    if(_otsStep < 3) { _otsStep++; _otsRender(); }
    else clearInterval(_otsTimer);
  }, 8000);
}

function _otsRender() {
  const isAr = lang === "ar" || false;
  const t = copy[lang] || copy.fr;
  const steps = document.querySelectorAll(".ots-step");
  const stepLabels = [t.otsS0||"Commande reçue", t.otsS1||"En préparation", t.otsS2||"Emballage", t.otsS3||"En route"];
  const activeTime  = t.otsActive || "en cours...";

  steps.forEach((s, i) => {
    s.classList.remove("ots-done","ots-active");
    const titleEl = s.querySelector(".ots-step-title");
    const timeEl  = s.querySelector(".ots-step-time");
    const dotEl   = s.querySelector(".ots-dot");
    if(titleEl) titleEl.textContent = stepLabels[i];
    if(i < _otsStep) {
      s.classList.add("ots-done");
      if(dotEl) dotEl.textContent = "✓";
    } else if(i === _otsStep) {
      s.classList.add("ots-active");
      if(dotEl) dotEl.textContent = ["","👨‍🍳","📦","🛵"][i] || "●";
      if(timeEl) timeEl.textContent = activeTime;
    } else {
      if(dotEl) dotEl.textContent = ["✅","👨‍🍳","📦","🛵"][i] || "●";
    }
  });

  const etaEl  = $e("ots-eta");
  const fillEl = document.querySelector(".ots-progress-fill");
  if(etaEl)  etaEl.textContent  = OTS_ETA[_otsStep];
  if(fillEl) fillEl.style.width = OTS_FILLS[_otsStep] + "%";

  // Update nav button label
  const navLbl = $e("nav-track-lbl");
  if(navLbl) {
    const labels = isAr
      ? ["طلبك وصل 🎉","جاري التحضير 👨‍🍳","التغليف 📦","في الطريق 🛵"]
      : (lang==="en"
        ? ["Order received 🎉","Preparing 👨‍🍳","Packaging 📦","On the way 🛵"]
        : ["Commande reçue 🎉","En préparation 👨‍🍳","Emballage 📦","En route 🛵"]);
    navLbl.textContent = labels[_otsStep];
  }
}

function scrollToTracking() {
  const s = $e("order-track-section");
  if(s) s.scrollIntoView({ behavior:"smooth", block:"center" });
}



/* ═══════════════════════════════════════════
   NUTRITIONAL CALCULATOR
═══════════════════════════════════════════ */
let _nc = { gender: "male", goal: "maintain" };

function ncSetGender(g) {
  _nc.gender = g;
  const m = $e("nc-male");
  const f = $e("nc-female");
  if(m) m.classList.toggle("active", g==="male");
  if(f) f.classList.toggle("active", g==="female");
  const section = $e("nutri-calc");
  if(section) section.classList.toggle("female-mode", g==="female");
}
function ncSetGoal(g) {
  _nc.goal = g;
  ["cut","main","bulk"].forEach(x => { const el=$e("nc-"+x); if(el) el.classList.remove("active"); });
  const active = $e("nc-"+g);
  if(active) active.classList.add("active");
}

function calcNutri() {
  const age    = parseInt($e("nc-age").value)    || 28;
  const weight = parseFloat($e("nc-weight").value) || 70;
  const height = parseFloat($e("nc-height").value) || 170;
  const act    = parseFloat($e("nc-activity").value) || 1.55;

  if (isNaN(age) || isNaN(weight) || isNaN(height)) return;

  // Harris-Benedict revised
  let bmr;
  if (_nc.gender === "male")
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  else
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);

  let tdee = bmr * act;
  if (_nc.goal === "cut")  tdee -= 300;
  if (_nc.goal === "bulk") tdee += 250;
  tdee = Math.round(tdee);

  const prot = Math.round(weight * (_nc.goal === "bulk" ? 2.0 : 1.8));
  const fat  = Math.round(tdee * 0.27 / 9);
  const carb = Math.round((tdee - prot * 4 - fat * 9) / 4);

  $e("nc-kcal").textContent = tdee.toLocaleString();
  $e("nc-prot").textContent = prot;
  $e("nc-carb").textContent = carb;
  $e("nc-fat").textContent  = fat;

  // Recommend from live dishes array in current language
  const isAr   = lang === "ar" || false;
  const mealCal   = tdee / 3;
  const tolerance = 130;

  let suitable = dishes
    .filter(d => Math.abs(d.cal - mealCal) < tolerance)
    .sort((a, b) => b.p - a.p)
    .slice(0, 6);

  // If nothing matches, take 4 closest
  if (!suitable.length) {
    suitable = [...dishes]
      .sort((a, b) => Math.abs(a.cal - mealCal) - Math.abs(b.cal - mealCal))
      .slice(0, 4);
  }

  const chipsEl = $e("nc-dishes");
  if (chipsEl) {
    chipsEl.innerHTML = suitable.map(d =>
      `<span class="nutri-dish-chip" onclick="$e('menu').scrollIntoView({behavior:'smooth'})">${d.e} ${d.name} · ${d.cal} kcal · ${d.p}g 🥩</span>`
    ).join("");
  }

  const resEl = $e("nutri-results");
  if (resEl) {
    resEl.classList.add("show");
    setTimeout(() => resEl.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
  }
}

/* ═══════════════════════════════════════════
   ENHANCED CHAT FEATURES
═══════════════════════════════════════════ */
// Reset chat
function resetChat() {
  chatHistory = [];
  leadShown = false; leadDone = false; userMsgCount = 0;
  const msgs = $e("chat-msgs");
  if(msgs) msgs.innerHTML = "";
  const lf = $e("chat-lead-form");
  const ia = $e("chat-input-area");
  if(lf) lf.style.display = "none";
  if(ia) ia.style.display = "block";
  const qc = $e("quick-chips");
  if(qc) qc.innerHTML = "";
  initChat();
}

// Scroll-to-bottom button logic
function scrollChatToBottom() {
  const msgs = $e("chat-msgs");
  if(msgs) msgs.scrollTo({ top: msgs.scrollHeight, behavior:"smooth" });
}
(function initScrollBtn() {
  const msgs = $e("chat-msgs");
  const btn  = $e("chat-scroll-btn");
  if(!msgs || !btn) return;
  msgs.addEventListener("scroll", () => {
    const atBottom = msgs.scrollHeight - msgs.scrollTop - msgs.clientHeight < 60;
    btn.classList.toggle("visible", !atBottom && msgs.scrollHeight > msgs.clientHeight + 80);
  });
})();

// Enhanced quick chips with icons — replaced above; this duplicate is removed.

// Voice input (Web Speech API)
let _recognition = null;
let _recording   = false;
function toggleVoice() {
  const btn = $e("voice-btn");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SpeechRecognition) { alert("Votre navigateur ne supporte pas la voix"); return; }
  if(_recording) {
    if(_recognition) _recognition.stop();
    _recording = false;
    if(btn) btn.classList.remove("recording");
    return;
  }
  _recognition = new SpeechRecognition();
  _recognition.lang = (lang === "ar" || false) ? "ar-MA" : "fr-FR";
  _recognition.interimResults = false;
  _recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    $e("chat-inp").value = transcript;
    _recording = false;
    if(btn) btn.classList.remove("recording");
  };
  _recognition.onerror = () => {
    _recording = false;
    if(btn) btn.classList.remove("recording");
  };
  _recognition.onend = () => {
    _recording = false;
    if(btn) btn.classList.remove("recording");
  };
  _recognition.start();
  _recording = true;
  if(btn) btn.classList.add("recording");
}

// Message timestamps helper
function _getTimeNow() {
  return new Date().toLocaleTimeString("fr-FR", {hour:"2-digit",minute:"2-digit"});
}

// Reaction handler
function reactMsg(btn) {
  const row = btn.parentElement;
  row.querySelectorAll(".msg-react-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
}

// Navbar scroll shadow
window.addEventListener("scroll",()=>{
  const nb=$e("navbar"); if(nb) nb.style.boxShadow = window.scrollY>40 ? "0 2px 20px rgba(0,128,96,0.1)" : "none";
});




/* ═══════════════════════════════════════════
   PACKAGING SLIDESHOW
═══════════════════════════════════════════ */
let _slideIdx = 0;
const _SLIDE_COUNT = 4;
let _slideTimer = null;

function _updateSlides() {
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.slide-dot');
  slides.forEach((s, i) => s.classList.toggle('active', i === _slideIdx));
  dots.forEach((d, i)   => d.classList.toggle('active', i === _slideIdx));
}
function nextSlide() {
  _slideIdx = (_slideIdx + 1) % _SLIDE_COUNT;
  _updateSlides();
  _resetSlideTimer();
}
function prevSlide() {
  _slideIdx = (_slideIdx - 1 + _SLIDE_COUNT) % _SLIDE_COUNT;
  _updateSlides();
  _resetSlideTimer();
}
function goSlide(i) {
  _slideIdx = i;
  _updateSlides();
  _resetSlideTimer();
}
function _resetSlideTimer() {
  if (_slideTimer) clearInterval(_slideTimer);
  _slideTimer = setInterval(nextSlide, 3500);
}
// Start auto-play on load
window.addEventListener('load', () => { _resetSlideTimer(); });


/* ═══ MULTI-PAGE BOOTSTRAP ═══ */
const PAGE=document.body.dataset.page||"home";
const PX={
 employee:{fr:["🕛 Livraison 12:00 – 13:30","📅 Lundi → Vendredi","🏢 Entreprise ou employé"],ar:["🕛 توصيل 12:00 – 13:30","📅 من الإثنين إلى الجمعة","🏢 الشركة أو الموظف يدفع"],en:["🕛 Delivery 12:00 – 13:30","📅 Monday → Friday","🏢 Company or employee pays"]},
 sportif:{fr:["🔥 480 kcal","💪 38 g protéines","🐟 Oméga-3"],ar:["🔥 480 سعرة","💪 38 غ بروتين","🐟 أوميغا-3"],en:["🔥 480 kcal","💪 38 g protein","🐟 Omega-3"]},
 famille:{fr:["👨‍👩‍👧 2 à 6 personnes","🍽️ Plats à partager","🛵 Livré en 45 min"],ar:["👨‍👩‍👧 من 2 إلى 6 أشخاص","🍽️ أطباق للمشاركة","🛵 توصيل في 45 دقيقة"],en:["👨‍👩‍👧 2 to 6 people","🍽️ Dishes to share","🛵 Delivered in 45 min"]},
 couple:{fr:["🕯️ 19:30 – 21:00","🍷 Dîner pour deux","✨ Plat signature"],ar:["🕯️ 19:30 – 21:00","🍷 عشاء لشخصين","✨ طبق مميّز"],en:["🕯️ 19:30 – 21:00","🍷 Dinner for two","✨ Signature dish"]}
};
function renderFc(){const a=(PX[PAGE]||{})[lang]||(PX[PAGE]||{}).fr;if(!a)return;a.forEach((t,i)=>{const e=$e("fc"+(i+1));if(e)e.textContent=t;});}
function renderPageSwitch(){
  renderFc();
  const t=copy[lang]||copy.fr;
  [["employee","pcEmployeeLbl"],["sportif","pcSportifLbl"],["famille","pcFamilleLbl"],["couple","pcCoupleLbl"]].forEach(([k,key])=>{const e=$e("ps-"+k+"-lbl");if(e)e.textContent=t[key];});
  const b=$e("ph-back");if(b)b.textContent={ar:"→ رجوع",fr:"← Retour",en:"← Back"}[lang]||"←";
}
(function(){
  const origSetLang=setLang;
  setLang=function(l){origSetLang(l);try{renderPageSwitch();if(PAGE!=="home")selectPersona(PAGE,true);}catch(e){}};
  window.addEventListener("load",()=>{ if(PAGE!=="home"){ try{renderPageSwitch();selectPersona(PAGE,true);}catch(e){console.error(e);} } });
})();
