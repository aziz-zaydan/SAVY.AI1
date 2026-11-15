(function(){
  function init(){
  var nav=document.getElementById("navbar");if(!nav||document.getElementById("sx-social"))return;
  function T(f,a,e){return lang==="ar"?a:(lang==="en"?e:f);}
  var C=window.SAVY_CFG||{},S=C.social||{};
  var L={
    instagram:S.instagram!==undefined?S.instagram:"https://www.instagram.com/savy.mar",
    tiktok:S.tiktok!==undefined?S.tiktok:"https://www.tiktok.com/@savy.ma",
    facebook:S.facebook||"",
    whatsapp:S.whatsapp===false?"":("https://wa.me/"+(typeof WA_NUMBER!=="undefined"?WA_NUMBER:"212708700830"))
  };
  var ICON={
    instagram:'<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    tiktok:'<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16.6 2h-3.2v13.2a2.8 2.8 0 1 1-2.8-2.8c.3 0 .6 0 .8.1V9.2a6 6 0 1 0 5.2 5.9V8.6a7.4 7.4 0 0 0 4.3 1.4V6.8a4.3 4.3 0 0 1-4.3-4.8z"/></svg>',
    facebook:'<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-.9.4-1.7 1.8-1.7h1.6V3.9S15.6 3.7 14.4 3.7c-2.6 0-4.3 1.6-4.3 4.4v2.4H7.3v3.3h2.8V22z"/></svg>',
    whatsapp:'<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.200zm4.5-6.100c-.2-.1-1.500-.7-1.700-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.200-.3.200-.5.100-1.600-.8-2.600-1.400-3.600-3.100-.3-.5.300-.5.800-1.500.1-.2 0-.3 0-.5l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.100-.7.300-.7.700-1 1.500-1 2.400.1 1 .5 1.900 1.100 2.700 1.100 1.600 2.500 2.800 4.200 3.500 1.500.6 2.100.7 2.900.6.500-.1 1.500-.6 1.700-1.200.2-.6.200-1.100.1-1.200-.1-.1-.3-.2-.5-.3z"/></svg>'
  };
  var NAME={instagram:"Instagram",tiktok:"TikTok",facebook:"Facebook",whatsapp:"WhatsApp"};
  var bar=document.createElement("div");bar.id="sx-social";nav.appendChild(bar);
  function draw(){
    var h='<div class="sc-i">';
    ["instagram","tiktok","facebook","whatsapp"].forEach(function(k){
      if(!L[k])return;
      h+='<a class="sc-'+k+'" href="'+L[k]+'" target="_blank" rel="noopener" aria-label="'+NAME[k]+'">'+ICON[k]+'</a>';
    });
    bar.innerHTML=h+'</div>';
    bar.style.display=bar.querySelector("a")?"flex":"none";
  }
  draw();
  var _sl=setLang;setLang=function(l){_sl(l);draw();};
}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
