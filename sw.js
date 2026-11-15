/* SAVY service worker: تخزين الملفات الثابتة للتحميل السريع. الصفحات وملف الإعدادات يُجلبان من الشبكة أولاً. */
var V="savy-v3",STATIC=["favicon.png","icon-192.png","manifest.webmanifest"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(STATIC);}).then(function(){return self.skipWaiting();}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener("fetch",function(e){
  var r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin)return;
  var img=/\/img\/|\.(png|webp|jpg|svg)$/.test(u.pathname);
  if(img){e.respondWith(caches.open(V).then(function(c){return c.match(r).then(function(m){return m||fetch(r).then(function(n){if(n.ok)c.put(r,n.clone());return n;});});}));return;}
  e.respondWith(fetch(r).then(function(n){if(n.ok&&/\.(html|js|css)$|\/$/.test(u.pathname)){var cp=n.clone();caches.open(V).then(function(c){c.put(r,cp);});}return n;}).catch(function(){return caches.match(r).then(function(m){return m||caches.match("index.html");});}));
});
