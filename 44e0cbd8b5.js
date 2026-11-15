(function(){
  var page=document.body.getAttribute("data-page")||"";
  var $=function(i){return document.getElementById(i);};
  function ev(n,p){try{window.gtag&&gtag("event",n,p||{});}catch(e){}}
  /* 1. trust strip under the hero */
  try{
    var hero=$("persona-hero");
    if(hero&&!$("trust-strip")){
      var s=document.createElement("div");s.id="trust-strip";hero.insertAdjacentElement("afterend",s);
      var draw=function(){var a=lang==="ar",f=lang==="fr";
        var it=a?["🛵 توصيل خلال 45 دقيقة","💵 كاش عند التوصيل","📍 تطوان · مضيق · مرتيل"]
               :f?["🛵 Livraison 45 min","💵 Cash à la livraison","📍 Tétouan · M'diq · Martil"]
               :["🛵 45-min delivery","💵 Cash on delivery","📍 Tétouan · M'diq · Martil"];
        s.innerHTML=it.map(function(x){return "<span>"+x+"</span>";}).join("");};
      draw();var _sl=setLang;setLang=function(l){_sl(l);draw();};
    }
  }catch(e){}
  /* 2. remember the customer's delivery details on this phone */
  try{
    var saved=JSON.parse(localStorage.getItem("savy_ck")||"null");
    if(saved&&typeof ck==="object"){["name","phone","city","address"].forEach(function(k){if(saved[k])ck[k]=saved[k];});}
    var _so=sendOrderWhatsApp;
    sendOrderWhatsApp=function(r){try{localStorage.setItem("savy_ck",JSON.stringify({name:ck.name,phone:ck.phone,city:ck.city,address:ck.address}));}catch(e){}_so.apply(this,arguments);};
  }catch(e){}
  /* 3. tag every order with the page it came from + analytics events */
  try{
    var _bm=buildCartMessage;
    buildCartMessage=function(){var o=_bm.apply(this,arguments);if(o&&o.text&&o.text.indexOf("🔖")<0){o.text+="\n🔖 Source: "+page;}return o;};
    var last=0,_sc=syncCart;
    var chk=function(){var n=cart.length;if(n>last)ev("add_to_cart",{page:page,items:n,value:cartTotal()});last=n;};
    syncCart=function(){_sc.apply(this,arguments);chk();};
    if(typeof toggleCart==="function"){var _tc=toggleCart;toggleCart=function(){var r=_tc.apply(this,arguments);chk();return r;};}
    if(typeof openCheckout==="function"){var _oc=openCheckout;openCheckout=function(){ev("begin_checkout",{page:page,items:cart.length,value:cartTotal()});return _oc.apply(this,arguments);};}
    ev("view_persona",{page:page});
  }catch(e){}
})();
