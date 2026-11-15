(function(){try{
  var f=document.getElementById("diet-filters"),w=document.querySelector("#menu .menu-slider-wrap");
  if(!w||!w.parentNode)return;
  var card=document.createElement("div");card.className="pp-card";
  w.parentNode.insertBefore(card,w);
  if(f)card.appendChild(f);
  card.appendChild(w);
}catch(e){}})();

/* sort chips like the employee page */
(function(){try{
  var list=document.getElementById("dishes-list");if(!list)return;
  var by=null,base=dishes.slice();
  var box=document.createElement("div");box.className="pp-sort";
  var bar=document.querySelector(".mv-bar");
  (bar&&bar.parentNode||list.parentNode).insertBefore(box,bar||list);
  function lbl(){var a=lang==="ar";return [["p",a?"💪 بروتين":"💪 Protéines"],["c",a?"💰 أرخص":"💰 Prix"]];}
  function draw(){box.innerHTML=lbl().map(function(x){return '<button type="button" class="'+(by===x[0]?"on":"")+'" data-k="'+x[0]+'">'+x[1]+'</button>';}).join("");if(bar)box.appendChild(bar);}
  box.onclick=function(e){var b=e.target.closest("button");if(!b)return;var k=b.dataset.k;by=(by===k?null:k);apply();draw();};
  function apply(){
    var s=base.slice();
    if(by==="p")s.sort(function(a,b){return b.p-a.p;});
    if(by==="c")s.sort(function(a,b){return a.price-b.price;});
    dishes.splice(0,dishes.length);s.forEach(function(d){dishes.push(d);});
    renderDishes();
  }
  var _sl=setLang;setLang=function(l){_sl(l);draw();};
  draw();
  if(bar){box.appendChild(bar);
    var slim=function(){bar.querySelectorAll("button").forEach(function(x){x.textContent=x.textContent.trim().charAt(0);});};
    var _mv=mealView;mealView=function(h){_mv(h);slim();};
    var _sl2=setLang;setLang=function(l){_sl2(l);slim();};slim();}
}catch(e){}})();
