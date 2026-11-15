(function(){
  var D={
"Choisir les jours":"Choose days","Choisir les plats":"Choose dishes","Choisir un plat":"Choose a dish","Commander":"Order","Commande":"Order",
"Confirmer":"Confirm","Confirmer ce jour ✓":"Confirm this day ✓","Passer ce jour":"Skip this day","Composez chaque jour puis confirmez":"Build each day, then confirm",
"Choisissez un jour ou plusieurs":"Pick one day or several","Choisissez et nous proposons un plat par jour. Vous modifiez ensuite.":"Choose and we suggest one dish per day. You can edit afterwards.",
"Qu'est-ce qui compte pour vous ?":"What matters most to you?","📅 Toute la semaine":"📅 Whole week",
"💼 Espace Employé — Commande de la semaine":"💼 Employee space — weekly order","✏️ Demander une modification":"✏️ Request a change","🛑 Demander l'annulation d'un jour":"🛑 Request to cancel a day",
"Suivre ma commande":"Track my order","Commander mon repas 💼":"Order my meal 💼","Commande Sport 🏋️":"Sport order 🏋️","Commander le Menu Famille 👨‍👩‍👧":"Order the Family Menu 👨‍👩‍👧",
"Réserver mon Dîner 💑":"Book my dinner 💑","💑 Dîner à deux":"💑 Dinner for two","👨‍👩‍👧 Commande famille":"👨‍👩‍👧 Family order",
"Combien de personnes ? Ajoutez les plats (un plat peut être répété). Repère : 1 plat par personne.":"How many people? Add dishes (a dish can be repeated). Guide: 1 dish per person.",
"Choisissez le créneau puis deux plats (et un plat à partager si vous voulez).":"Pick a time slot, then two dishes (and one to share if you like).",
"À partager (facultatif)":"To share (optional)","Plat 1":"Dish 1","Plat 2":"Dish 2","Aujourd'hui 14/11":"Today","Demain 15/11":"Tomorrow",
"Menu Famille":"Family Menu","Des plats pour tous — frais, équilibrés, généreux.":"Dishes for everyone — fresh, balanced, generous.",
"Dîner en Amoureux":"Dinner for Two","Un dîner élégant pour deux, préparé avec tout l'amour du monde. 💕":"An elegant dinner for two, made with all the love in the world. 💕",
"Performance & Macros":"Performance & Macros","Macros calculés pour vos objectifs de performance. 💪":"Macros calculated for your performance goals. 💪",
"Repas Énergie":"Energy Meals","Énergie soutenue toute la journée. Zéro fatigue post-déjeuner.":"Steady energy all day. No post-lunch slump.",
"🏋️ Votre plan performance":"🏋️ Your performance plan","Choisissez votre objectif puis ajoutez vos repas. Calories et protéines comparées à l'objectif du jour (≈ 3 repas).":"Choose your goal, then add your meals. Calories and protein compared with the day's target (≈ 3 meals).",
"Prise de masse":"Bulk","Sèche":"Cut","Maintien":"Maintain","protéines":"protein","min estimées":"min estimated",
"💪 Protéines":"💪 Protein","💪 Plus de protéines":"💪 High protein","💰 Prix":"💰 Price","💰 Moins cher":"💰 Cheapest","💰 Petit budget":"💰 Low budget",
"🥗 Léger":"🥗 Light","🌱 Végétarien":"🌱 Vegetarian","🎲 Varié":"🎲 Mixed","🌿 Frais":"🌿 Fresh",
"🧮 Calculer mes besoins":"🧮 Calculate my needs","✕ Fermer":"✕ Close","✓ Objectif personnalisé — modifier":"✓ Personalised target — edit",
"🛵 Livraison en 45 min":"🛵 45-min delivery","💵 Cash à la livraison · Tétouan":"💵 Cash on delivery · Tétouan","💵 Cash à la livraison · 45 min":"💵 Cash on delivery · 45 min",
"⏱ Garanti":"⏱ Guaranteed","Ingrédients & allergènes":"Ingredients & allergens","⚠ Aucun allergène majeur":"⚠ No major allergen"
  };
  var DAYS=[["Lun","Mon"],["Mar","Tue"],["Mer","Wed"],["Jeu","Thu"],["Ven","Fri"]];
  var ALG=[["Fruits à coque","Tree nuts"],["Crustacés","Shellfish"],["Gluten","Gluten"],["Lait","Milk"],["Œufs","Eggs"],["Soja","Soy"],["Poisson","Fish"],["Sésame","Sesame"]];
  var P=[
   [/^(\d+)\/(\d+) jours confirmés · (\d+) repas$/,"$1/$2 days confirmed · $3 meals"],
   [/^(\d+)\/(\d+) jours confirmés · Total (\d+) MAD$/,"$1/$2 days confirmed · Total $3 MAD"],
   [/^(\d+) plat sélectionné$/,"$1 dish selected"],[/^(\d+) plat\(s\) · (\d+) MAD$/,"$1 dish(es) · $2 MAD"],
   [/^(\d+)\/(\d+) plats · il manque (\d+) · Total (\d+) MAD$/,"$1/$2 dishes · $3 missing · Total $4 MAD"],
   [/^(\d+) pers\.$/,"$1 ppl"],[/^Il reste (\d+) jour\(s\) à confirmer$/,"$1 day(s) left to confirm"],
   [/^📅 Semaine du (.+)$/,"📅 Week of $1"],[/^Repère : ≈ (\d+) kcal par repas$/,"Guide: ≈ $1 kcal per meal"],
   [/^Choisir les plats (\w+)$/,"Choose dishes $1"],[/^🍽️ Menu de (.+) — choisissez 1, 2, 3 plats ou plus$/,"🍽️ Menu for $1 — choose 1, 2, 3 dishes or more"]
  ];
  function dayfix(s){DAYS.forEach(function(d){s=s.replace(new RegExp("\\b"+d[0]+"\\b","g"),d[1]);});return s;}
  function tr(s){
    var core=s.trim();if(!core)return null;
    if(/^(✓ )?(Lun|Mar|Mer|Jeu|Ven)$/.test(core))return dayfix(core);
    if(D[core])return dayfix(D[core]);
    for(var i=0;i<P.length;i++){if(P[i][0].test(core))return dayfix(core.replace(P[i][0],P[i][1]));}
    if(core.charAt(0)==="⚠"&&core.length>2){var t=core;ALG.forEach(function(a){t=t.split(a[0]).join(a[1]);});return t!==core?t:null;}
    return null;
  }
  var busy=false;
  function walk(root){
    if(typeof lang==="undefined"||lang!=="en"||busy)return;busy=true;
    try{
      var w=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT),n,list=[];
      while(n=w.nextNode()){var p=n.parentElement;if(p&&p.tagName!=="SCRIPT"&&p.tagName!=="STYLE")list.push(n);}
      list.forEach(function(n){var r=tr(n.nodeValue);if(r!==null){var m=n.nodeValue.match(/^(\s*)[\s\S]*?(\s*)$/);n.nodeValue=m[1]+r+m[2];}});
      document.querySelectorAll("[placeholder]").forEach(function(e){var r=tr(e.placeholder);if(r)e.placeholder=r;});
    }catch(e){}
    busy=false;
  }
  var q=0;new MutationObserver(function(){if(q)return;q=requestAnimationFrame(function(){q=0;walk();});}).observe(document.body,{childList:true,subtree:true,characterData:true});
  var _sl=setLang;setLang=function(l){var r=_sl.apply(this,arguments);walk();return r;};
  walk();
})();
