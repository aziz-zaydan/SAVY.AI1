const https = require("https");

// ─── Config ─────────────────────────────────────────────────────
const MAX_TURNS       = 20;
const MAX_CONTENT_LEN = 2000;

// ─── معلومات المتجر (عدّلها هنا عند تغيّر الشروط) ────────────────────────────
const { check } = require("./lib/guard");

const FACTS = {
  areas: "Tétouan · M'diq · Martil",
  eta: "45 min",
  hours: "10:00–21:30",
  payment: "cash à la livraison",
  deliveryFee: "livraison gratuite",
  promo: "code SAVY10 = -10% sur la première commande",
  weekly: "abonnement hebdomadaire entreprises : -10%, un plat par jour choisi à l'avance",
  loyalty: "tous les 10 commandes, un plat offert",
};

// ─── القائمة (مولّدة من الموقع — 17 طبقاً) ────────────────────────────────
const DISHES = [{"id":1,"fr":"Salade marocaine","ar":"سلطة مغربية","course":"starter","price":8,"cal":120,"p":2,"c":8,"f":9,"t":10,"tag":"Vegan","diet":"vegan","personas":["employee","famille","couple"],"ing":"Tomates · Concombre · Oignons · Huile"},{"id":2,"fr":"Coleslaw","ar":"سلطة كول سلو","course":"starter","price":11,"cal":85,"p":4,"c":15,"f":1,"t":10,"tag":"Vegetarian","diet":"vegetarian","personas":["employee","famille"],"ing":"Chou · Carottes · Yaourt"},{"id":3,"fr":"Salade de lentilles","ar":"سلطة عدس","course":"starter","price":9,"cal":275,"p":13,"c":35,"f":10,"t":35,"tag":"Vegan","diet":"vegan","personas":["employee","sportif","famille"],"ing":"Lentilles · Tomates · Oignons · Huile"},{"id":4,"fr":"Salade de riz au thon","ar":"سلطة أرز بالتونة","course":"starter","price":27,"cal":340,"p":19,"c":41,"f":10,"t":25,"tag":"High Protein","diet":"balanced","personas":["employee","sportif"],"ing":"Riz · Thon en boîte · Tomates · Huile"},{"id":5,"fr":"Salade de carottes au citron","ar":"سلطة جزر بالليمون","course":"starter","price":7,"cal":130,"p":1,"c":11,"f":9,"t":10,"tag":"Vegan","diet":"vegan","personas":["employee","sportif","couple"],"ing":"Carottes · Citron · Huile"},{"id":6,"fr":"Riz au poulet et légumes","ar":"أرز بالدجاج والخضر","course":"main","price":30,"cal":785,"p":33,"c":87,"f":33,"t":45,"tag":"Balanced","diet":"high-protein","personas":["employee","sportif","famille"],"ing":"Cuisses de poulet · Riz · Carottes · Oignons · Huile"},{"id":7,"fr":"Burger de poulet + pommes de terre au four","ar":"Burger دجاج + بطاطس فرن","course":"main","price":40,"cal":685,"p":42,"c":63,"f":30,"t":45,"tag":"Finger Food","diet":"high-protein","personas":["employee","sportif","famille"],"ing":"Blanc de poulet · Pain burger · Laitue · Pommes de terre · Huile · Fromage"},{"id":8,"fr":"Pâtes sauce tomate au poulet","ar":"باستا بصلصة الطماطم والدجاج","course":"main","price":30,"cal":640,"p":38,"c":83,"f":18,"t":40,"tag":"Balanced","diet":"high-protein","personas":["employee","sportif","famille"],"ing":"Pâtes · Blanc de poulet · Tomates · Oignons · Huile"},{"id":9,"fr":"Tajine de kefta aux œufs","ar":"طاجين كفتة بالبيض","course":"main","price":50,"cal":540,"p":31,"c":11,"f":42,"t":40,"tag":"Moroccan","diet":"high-protein","personas":["employee","famille","couple"],"ing":"Viande hachée de bœuf · Œufs · Tomates · Oignons · Huile"},{"id":10,"fr":"Couscous aux légumes et poulet","ar":"كسكس بالخضر والدجاج","course":"main","price":30,"cal":880,"p":41,"c":92,"f":39,"t":65,"tag":"Moroccan","diet":"high-protein","personas":["employee","famille"],"ing":"Semoule de couscous · Cuisses de poulet · Carottes · Pommes de terre · Oignons · Huile"},{"id":11,"fr":"Wrap de poulet","ar":"Wrap دجاج","course":"main","price":35,"cal":300,"p":30,"c":29,"f":7,"t":25,"tag":"Finger Food","diet":"high-protein","personas":["employee","sportif","couple"],"ing":"Blanc de poulet · Galette wrap · Laitue · Tomates · Yaourt"},{"id":12,"fr":"Burger de bœuf + pommes de terre au four","ar":"Burger لحم + بطاطس فرن","course":"main","price":55,"cal":835,"p":37,"c":62,"f":50,"t":45,"tag":"Finger Food","diet":"high-protein","personas":["employee","famille","couple"],"ing":"Viande hachée de bœuf · Pain burger · Fromage · Pommes de terre · Huile"},{"id":13,"fr":"Pâtes crémeuses au poulet","ar":"باستا كريمية بالدجاج","course":"main","price":40,"cal":835,"p":44,"c":76,"f":39,"t":35,"tag":"Balanced","diet":"high-protein","personas":["employee","couple","famille"],"ing":"Pâtes · Blanc de poulet · Crème fraîche · Fromage · Huile"},{"id":14,"fr":"Salade de fruits","ar":"سلطة فواكه","course":"dessert","price":11,"cal":115,"p":1,"c":28,"f":0,"t":10,"tag":"Vegan","diet":"vegan","personas":["employee","sportif","famille","couple"],"ing":"Fruits de saison · Sucre"},{"id":15,"fr":"Yaourt au miel","ar":"زبادي بالعسل","course":"dessert","price":19,"cal":135,"p":5,"c":25,"f":2,"t":2,"tag":"Vegetarian","diet":"vegetarian","personas":["employee","sportif","couple"],"ing":"Yaourt · Miel"},{"id":16,"fr":"Cake au citron","ar":"كعكة بالليمون (Cake)","course":"dessert","price":10,"cal":465,"p":7,"c":62,"f":21,"t":50,"tag":"Tradition","diet":"vegetarian","personas":["employee","famille","couple"],"ing":"Farine · Sucre · Œufs · Huile · Citron"},{"id":17,"fr":"Riz au lait","ar":"أرز بالحليب","course":"dessert","price":11,"cal":315,"p":9,"c":53,"f":7,"t":30,"tag":"Tradition","diet":"vegetarian","personas":["employee","famille","couple"],"ing":"Riz · Lait · Sucre"}];
const VALID_IDS = new Set(DISHES.map(d => d.id));
const COURSE = { starter: "ENTRÉES", main: "PLATS", dessert: "DESSERTS" };

const MENU = (() => {
  let out = "\nMENU SAVY (17 plats, prix en MAD, [id] = identifiant pour [[ADD:id]]):";
  ["starter", "main", "dessert"].forEach(c => {
    out += "\n\n" + COURSE[c] + ":";
    DISHES.filter(d => d.course === c).forEach(d => {
      out += "\n• [" + d.id + "] " + d.fr + " (" + d.ar + ") — " + d.price + " MAD | " + d.cal + " kcal | " + d.p + "g prot | " + d.tag + " | pour: " + d.personas.join("/") + " | " + d.ing;
    });
  });
  return out + "\n\nSeuls ces 17 plats existent. N'invente JAMAIS un plat, un prix ou une calorie.";
})();

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin":  origin || "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };
}

// ─── Règles communes ─────────────────────────────────────────────────────
function baseRules(lang) {
  const hint = lang === "ar" ? "L'interface du visiteur est en arabe: s'il écrit en arabe ou en darija, réponds en darija marocaine simple, écrite en lettres arabes."
             : lang === "en" ? "L'interface du visiteur est en anglais: réponds en anglais sauf s'il écrit dans une autre langue."
             : "L'interface du visiteur est en français: réponds en français naturel (quelques mots de darija OK).";
  return `
IDENTITÉ
Tu es Chef SAVY, l'assistant de SAVY, cuisine cloud saine à ${FACTS.areas}. Chaleureux, direct, comme un ami qui s'y connaît en cuisine. Jamais un formulaire, jamais un vendeur insistant.

INFOS BOUTIQUE (seules infos valables)
• Livraison en ${FACTS.eta} · zones: ${FACTS.areas} · horaires cuisine ${FACTS.hours}
• Paiement: ${FACTS.payment} · ${FACTS.deliveryFee}
• ${FACTS.promo}
• ${FACTS.weekly}
• Fidélité: ${FACTS.loyalty}
Si tu ne connais pas une info (allergènes précis, adresse, cas particulier), dis-le franchement et invite à écrire sur WhatsApp. N'invente rien.

LANGUE
${hint}
Détecte la langue du dernier message du visiteur et réponds dans cette langue. Ne mélange pas deux langues dans un même message. Darija écrite en lettres latines (bghit, 3afak, wakha) → réponds en darija en lettres arabes.

STYLE
• 1 à 3 phrases courtes, 45 mots maximum. Pas de listes, pas de markdown (pas d'astérisques), 1 à 2 emojis maximum.
• Réponds d'abord à ce qu'il demande, puis pose UNE seule question utile si besoin. S'il ignore ta question, avance sans insister.
• Retiens ce qu'il t'a dit (goûts, allergies, nombre de personnes) et n'y reviens pas par une question.

CONSEIL PERSONNALISÉ (SYSTÈME SAVY)
• Ordre de priorité: 1) sécurité et allergies, 2) régimes, 3) besoins nutritionnels, 4) disponibilité réelle, 5) plats approuvés par le chef, 6) goûts, 7) budget, 8) délai. Ne sacrifie jamais 1-4 pour plaire.
• Découverte progressive: ne pose JAMAIS plus d'une question par message; commence par l'objectif, puis allergies, goûts/dégoûts, calories, budget, nombre de repas/jour, un seul sujet à la fois et seulement s'il manque. Pas de questionnaire.
• Quand il décrit un besoin (ex: perdre du poids, déjeuner riche en protéines < 550 kcal), propose 3 plats maximum du menu qui respectent ses contraintes chiffrées (vérifie les kcal du menu), avec une raison courte par plat, le prix réel et [[ADD:id,id,id]]. Si rien ne correspond exactement, propose le plus proche et dis clairement la différence.
• Substitution: si un plat est indisponible ou contient un allergène/aliment refusé, propose un AUTRE plat du menu (jamais une modification de recette inventée). Précise l'écart de calories/protéines.
• Une recommandation n'est pas une commande: n'écris jamais « commande confirmée » toi-même; la commande se valide dans le panier ou avec le signal de commande.
• Disponibilité: n'annonce jamais un stock, une quantité ou un délai que tu ne vois pas dans le contexte. Si un plat est « stock faible », dis-le honnêtement et encourage à commander vite.
• Nouvelles idées de recettes: tu peux les suggérer comme idée, en précisant qu'elles ne sont pas encore au menu et doivent être validées par le chef avant de pouvoir être commandées.
• Allergies déclarées: ne propose aucun plat dont les ingrédients (liste du menu) les contiennent; en cas de doute sur une trace, dis-le et conseille de confirmer avec le chef avant la commande.
• Réponses rapides: à la fin de chaque message où tu poses une question ou proposes un choix, ajoute [[Q:réponse1|réponse2|réponse3]] avec 2 à 3 réponses très courtes (max 4 mots) que le visiteur peut toucher, dans sa langue. Ne mentionne jamais cette balise.
• Mémoire: quand le visiteur donne une préférence durable (objectif, allergies, goûts, dégoûts, kcal par repas, budget par repas, repas par jour), ajoute en fin de message [[PROFILE:goal=...;kcal=...;likes=a,b;dislikes=a,b;allergies=a,b;budget=...;meals=...]] avec uniquement les champs connus. Ne mentionne jamais cette balise.

PLATS ET CARTES CLIQUABLES
• Quand tu proposes des plats précis (ou qu'il demande le menu/une idée), termine ton message par [[ADD:id,id]] avec 1 à 3 identifiants pris dans le menu. L'application affiche alors des cartes avec un bouton « ajouter ». Ne mentionne jamais cette balise.
• Ne mets la balise que pour des plats qui existent vraiment dans le menu. Ne la mets pas à chaque message, seulement quand tu recommandes quelque chose de concret.
• Un repas complet = entrée + plat (+ dessert). Propose-le et donne le total en MAD en additionnant exactement les prix du menu.
• Calories et macros sont des estimations: dis « environ » quand tu les cites.
• Allergies/régimes: appuie-toi uniquement sur les ingrédients listés. Si un doute subsiste, dis-le et renvoie vers WhatsApp. Jamais de conseil médical.
• COACH NUTRITION: tu peux expliquer calories et macros, proposer des substitutions plus légères, aider à tenir ses objectifs et générer un plan repas du jour (petit-déj, déjeuner, dîner, snack) avec calories approximatives par repas. Pour un plan, tu peux écrire jusqu'à 110 mots, une ligne par repas, sans markdown, et utiliser des plats SAVY avec [[ADD:id]] quand ils conviennent. Donne de l'information générale de bien-être: ne diagnostique pas, ne prescris pas de régime médical, et renvoie vers un professionnel de santé en cas de pathologie, grossesse, trouble alimentaire ou régime très restrictif. Les valeurs sont des estimations. Respecte toujours allergies et préférences du visiteur. Pour estimer un repas à partir d'une photo, invite-le à utiliser l'onglet Scanner.
• Hors sujet (politique, médical, concurrents): réponds poliment en une phrase et ramène vers la cuisine.

COMMANDE
• Quand il veut commander, dis-lui d'appuyer sur « ajouter » puis « commander » (le panier est en bas), ou propose de l'aider à choisir.
• S'il confirme clairement qu'il veut commander avec toi dans le chat (« je prends ça », « wakha », « go »), confirme en une phrase, demande prénom + ville + numéro WhatsApp en une seule phrase, et ajoute SAVY_GET_LEAD tout à la fin (invisible pour lui). N'écris JAMAIS SAVY_GET_LEAD avant une confirmation claire.
${MENU}`;
}

const PERSONAS = {
  employee: `
PROFIL: employé(e) / professionnel(le) pressé(e) — pause courte, veut manger sain sans coup de barre l'après-midi.
TON: efficace, énergique, collègue bienveillant. Propose vite, pas de longs discours.
IDÉES: entrées légères (ids 1, 3, 5) + un plat simple comme le wrap (11) ou le riz au poulet (6); couscous (10) pour une vraie recharge.
À découvrir naturellement: léger ou recharge? mange-t-il au bureau? régime particulier?
OUVERTURE [SYSTEM_OPEN:employee]: 2 phrases maximum, reconnais que son temps est précieux et demande ce dont il/elle a envie aujourd'hui.`,

  sportif: `
PROFIL: sportif(ve) régulier(ère) — suit protéines, macros et calories, aime les chiffres précis.
TON: motivant, précis, complice d'athlète. Cite protéines et kcal des plats (environ).
IDÉES: choisis dans le menu les plats avec le plus de protéines par kcal (burgers de poulet/bœuf, pâtes poulet, tajine kefta, salade de riz au thon en entrée).
Repères généraux si demandé: prise de masse ~2 g de protéines/kg/jour, sèche ~1,8, maintien ~1,6. Avant l'entraînement: plus de glucides; après: protéines + glucides.
À découvrir: objectif (masse, sèche, maintien), avant ou après l'entraînement.
OUVERTURE [SYSTEM_OPEN:sportif]: 2 phrases maximum, montre que tu comprends l'enjeu nutrition et demande son objectif du moment.`,

  famille: `
PROFIL: parent qui commande pour plusieurs personnes (enfants, ados, grands-parents) — veut contenter tout le monde, budget important.
TON: chaleureux, rassurant, pratique. Pense variété et quantités.
IDÉES: pour les enfants: burger de poulet (7), pâtes sauce tomate (8), wrap (11); pour tous: couscous (10), riz au poulet (6), tajine de kefta (9); à partager: salades et desserts.
Calcule le total pour le nombre de personnes quand il le donne.
À découvrir: combien de personnes, enfants inclus, allergies, goûts.
OUVERTURE [SYSTEM_OPEN:famille]: 2 phrases maximum, chaleureuse, demande combien ils sont ou ce qui ferait plaisir à la famille.`,

  couple: `
PROFIL: dîner pour deux — date, anniversaire, soirée spéciale. L'ambiance compte autant que le goût.
TON: élégant et un peu poétique, jamais excessif ni cucul. Évoque saveurs, soirée, moments.
IDÉES: une entrée à partager (1, 3 ou 5), deux plats (ex. pâtes crémeuses 13, tajine de kefta 9, couscous 10) et un dessert à partager (yaourt au miel 15, riz au lait 17, cake au citron 16). Donne le total du menu duo.
À découvrir: occasion, ambiance (légère ou généreuse), allergies.
OUVERTURE [SYSTEM_OPEN:couple]: 2 phrases maximum, reconnais un moment spécial à deux avec une touche poétique légère et demande l'ambiance ou l'occasion.`,
};

function buildSystemPrompt(persona, lang, ctx) {
  const p = PERSONAS[persona] ? persona : "employee";
  let extra = "";
  if (ctx && ctx.nx && typeof ctx.nx === "object") {
    const n = ctx.nx, num = v => Math.max(0, Math.min(99999, Math.round(Number(v) || 0)));
    const clip = v => String(v || "").replace(/[\r\n]+/g, " ").slice(0, 120);
    extra += "\nPROFIL NUTRITION DU VISITEUR (estimations): objectif " + clip(n.goal) + ", cible " + num(n.kcal) + " kcal/j (P " + num(n.p) + "g, G " + num(n.c) + "g, L " + num(n.f) + "g)."
      + " Déjà consommé aujourd'hui: " + num(n.eaten && n.eaten.k) + " kcal (P " + num(n.eaten && n.eaten.p) + "g, G " + num(n.eaten && n.eaten.c) + "g, L " + num(n.eaten && n.eaten.f) + "g)."
      + (Array.isArray(n.diet) && n.diet.length ? " Préférences: " + n.diet.slice(0, 6).map(clip).join(", ") + "." : "")
      + (n.allergies ? " Allergies déclarées (à respecter): " + clip(n.allergies) + "." : "")
      + (n.budget ? " Budget: " + num(n.budget) + " MAD/jour." : "");
  }
  if (ctx && Array.isArray(ctx.cart) && ctx.cart.length) {
    const names = ctx.cart.filter(id => VALID_IDS.has(id)).map(id => DISHES.find(d => d.id === id).fr);
    if (names.length) extra += "\nPANIER ACTUEL DU VISITEUR: " + names.join(", ") + ". Ne le lui re-propose pas; complète-le si utile (entrée/dessert manquant).";
  }
  if (ctx && Array.isArray(ctx.soldOut) && ctx.soldOut.length) {
    const names = ctx.soldOut.filter(id => VALID_IDS.has(id)).map(id => DISHES.find(d => d.id === id).fr);
    if (names.length) extra += "\nINDISPONIBLES AUJOURD'HUI (ne les propose pas): " + names.join(", ") + ".";
  }
  if (ctx && ctx.stock && typeof ctx.stock === "object") {
    const lows = Object.keys(ctx.stock).map(k => [parseInt(k, 10), Math.round(Number(ctx.stock[k]))]).filter(x => VALID_IDS.has(x[0]) && x[1] > 0 && x[1] <= 20);
    if (lows.length) extra += "\nSTOCK FAIBLE (portions restantes aujourd'hui): " + lows.map(x => DISHES.find(d => d.id === x[0]).fr + " (" + x[1] + ")").join(", ") + ".";
  }
  if (ctx && ctx.prof && typeof ctx.prof === "object") {
    const clip = v => String(v || "").replace(/[\r\n\[\]]+/g, " ").slice(0, 120);
    const pf = ["goal", "kcal", "likes", "dislikes", "allergies", "budget", "meals"].filter(k => ctx.prof[k]).map(k => k + ": " + clip(ctx.prof[k]));
    if (pf.length) extra += "\nPRÉFÉRENCES MÉMORISÉES (consentement du visiteur; ne les redemande pas): " + pf.join(" | ") + ".";
  }
  return PERSONAS[p] + "\n" + baseRules(lang) + extra;
}

// Allergènes → mots-clés d'ingrédients (liste du menu)
const ALLERGENS = [
  [/arachide|cacahu|peanut|فول سوداني|كاوكاو/i, []],
  [/gluten|bl[eé]|wheat|farine|قمح|غلوتين/i, ["pâtes", "semoule", "pain", "galette", "farine", "couscous"]],
  [/lactose|lait|laitier|dairy|milk|حليب|لاكتوز/i, ["yaourt", "fromage", "crème", "lait"]],
  [/[oœ]euf|egg|بيض/i, ["œufs", "oeufs", "farine"]],
  [/poisson|thon|fish|tuna|حوت|تونة/i, ["thon"]],
  [/sésame|sesame|سمسم/i, ["pain burger"]],
  [/miel|honey|عسل/i, ["miel"]],
  [/citron|lemon|حامض|ليمون/i, ["citron"]],
  [/poulet|chicken|دجاج/i, ["poulet"]],
  [/b[oœ]uf|beef|viande|بقر|لحم/i, ["bœuf", "boeuf", "viande"]],
];
function conflicts(dish, allergyText) {
  const t = String(allergyText || "");
  if (!t) return false;
  const ing = (dish.ing || "").toLowerCase();
  return ALLERGENS.some(([re, words]) => re.test(t) && words.some(w => ing.includes(w)));
}

// Extrait [[ADD:..]] et [[PROFILE:..]] → ids valides sans allergène, texte propre
function parseReply(text, allergyText, blocked) {
  const ids = [];
  let profile = null;
  let quick = null;
  let clean = String(text).replace(/\[\[\s*Q\s*:([^\]]*)\]\]/gi, (_, body) => {
    const arr = String(body).split("|").map(x => x.trim().replace(/[\r\n]+/g, " ").slice(0, 40)).filter(Boolean).slice(0, 3);
    if (arr.length) quick = arr;
    return "";
  });
  clean = clean.replace(/\[\[\s*PROFILE\s*:([^\]]*)\]\]/gi, (_, body) => {
    const o = {};
    String(body).split(";").forEach(kv => {
      const i = kv.indexOf("=");
      if (i < 1) return;
      const k = kv.slice(0, i).trim().toLowerCase();
      const v = kv.slice(i + 1).trim().slice(0, 120);
      if (["goal", "kcal", "likes", "dislikes", "allergies", "budget", "meals"].includes(k) && v) o[k] = v;
    });
    if (Object.keys(o).length) profile = o;
    return "";
  });
  clean = clean.replace(/\[\[\s*ADD\s*:([^\]]*)\]\]/gi, (_, list) => {
    String(list).split(/[,\s]+/).forEach(x => {
      const n = parseInt(x, 10);
      if (VALID_IDS.has(n) && !ids.includes(n)) ids.push(n);
    });
    return "";
  });
  const allergyAll = [allergyText, profile && profile.allergies].filter(Boolean).join(" ");
  const safe = ids.filter(id => !(blocked || []).includes(id) && !conflicts(DISHES.find(d => d.id === id), allergyAll));
  const dropped = ids.length - safe.length;
  clean = clean.replace(/\*\*/g, "").replace(/^[-•]\s+/gm, "").replace(/\n{3,}/g, "\n\n").trim();
  const out = { reply: clean, dishes: safe.slice(0, 3) };
  if (dropped) out.allergyDropped = dropped;
  if (profile) out.profile = profile;
  if (quick) out.quick = quick;
  return out;
}

// ─── Groq API call via https.request (Node 14/16/18+ compatible) ────────────
function callGroq(apiKey, payload) {
  return new Promise((resolve, reject) => {
    const body    = JSON.stringify(payload);
    const options = {
      hostname: "api.groq.com",
      path:     "/openai/v1/chat/completions",
      method:   "POST",
      headers:  {
        "Content-Type":   "application/json",
        "Authorization":  `Bearer ${apiKey}`,
        "Content-Length": Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve({ ok: true, json: JSON.parse(data) }); }
          catch { reject(new Error("Invalid JSON from Groq")); }
        } else {
          console.error(`Groq HTTP ${res.statusCode}:`, data);
          resolve({ ok: false, status: res.statusCode, raw: data });
        }
      });
    });
    req.on("error", (err) => reject(err));
    req.write(body);
    req.end();
  });
}


// ─── Static fallback when Groq is unreachable ────────────────────────────────
function getFallbackMsg(persona, lang) {
  const isAr = lang === "ar";
  const map = {
    employee: {
      fr: "Petite coupure réseau 😕 Réessaie dans quelques secondes — ta pause déjeuner ne va pas attendre !",
      ar: "انقطع الاتصال لحظياً 😕 جرّب مجدداً — وقت الغداء لا ينتظر !"
    },
    sportif: {
      fr: "Connexion perdue un instant 😕 Réessaie vite, champion — tes macros t'attendent !",
      ar: "انقطع الاتصال للحظة 😕 جرّب مجدداً بطل — الماكروز في انتظارك !"
    },
    famille: {
      fr: "Petite coupure réseau 😕 Réessaie dans quelques secondes — toute la famille attend son repas !",
      ar: "انقطع الاتصال لحظياً 😕 جرّب مجدداً — العائلة تنتظر !"
    },
    couple: {
      fr: "Petite interruption 😕 Réessaie dans un instant — votre soirée mérite le meilleur 💑",
      ar: "انقطع الاتصال للحظة 😕 جرّب مجدداً — سهرتكم تستحق الأفضل 💑"
    }
  };
  const set = map[persona] || map.employee;
  return isAr ? set.ar : set.fr;
}

// ─── Handler ────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  const guard = check(event, { perMinute: 15, perDay: 300, maxBody: 30000 });
  if (!guard.ok) return guard.response;
  const headers = guard.headers;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("❌ GROQ_API_KEY environment variable is not set in Netlify.");
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Server configuration error — API key missing" }) };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON body" }) }; }

  const { messages, persona = "employee", lang = "fr", ctx = null } = body;
  if (!messages || !Array.isArray(messages)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "messages array required" }) };
  }

  const validPersonas = ["employee", "sportif", "famille", "couple"];
  const safePersona   = validPersonas.includes(persona) ? persona : "employee";

  const normalized = messages
    .slice(-MAX_TURNS)
    .map(m => ({
      role:    m.role === "model" ? "assistant" : m.role,
      content: String(m.content || "").slice(0, MAX_CONTENT_LEN),
    }))
    .filter(m => m.content && (m.role === "user" || m.role === "assistant"));

  let result;
  try {
    result = await callGroq(apiKey, {
      model:       "llama-3.3-70b-versatile",
      messages:    [
        { role: "system", content: buildSystemPrompt(safePersona, lang, ctx) },
        ...normalized,
      ],
      temperature: 0.6,
      max_tokens:  450,
    });
  } catch (err) {
    console.error("Groq request error:", err.message);
    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        reply: getFallbackMsg(safePersona, body.lang),
        _fallback: true
      })
    };
  }

  if (!result.ok) {
    console.error("Groq non-OK:", result.status, result.raw?.slice(0,200));
    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        reply: getFallbackMsg(safePersona, body.lang),
        _fallback: true
      })
    };
  }

  const text = result.json?.choices?.[0]?.message?.content;
  if (!text) {
    return { statusCode: 200, headers, body: JSON.stringify({ reply: "", error: "No reply generated" }) };
  }

  const c = ctx || {};
  const allergyText = [c.nx && c.nx.allergies, c.prof && c.prof.allergies].filter(Boolean).join(" ");
  const blocked = (Array.isArray(c.soldOut) ? c.soldOut : []).map(Number)
    .concat(c.stock && typeof c.stock === "object" ? Object.keys(c.stock).filter(k => Number(c.stock[k]) <= 0).map(Number) : []);
  const parsed = parseReply(text, allergyText, blocked);
  return { statusCode: 200, headers, body: JSON.stringify(parsed) };
};
