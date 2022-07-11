//variabilisation
var nomCache='gesbar-v1';
var contenuCache=[
 '/transitaire/index.htm'
,'/transitaire/liste.htm'
,'/transitaire/enregistrer.htm'
,'/transitaire/parametres.htm'
,'/transitaire/app.js'
,'/transitaire/sw.js'
,'/transitaire/donnees.js'
,'/transitaire/fonctions.js'
,'/transitaire/afterload.js'
,'/transitaire/afterloadparam.js'
,'/transitaire/eventListener.js'
,'/transitaire/css/w3.css'
,'/transitaire/css/w3color.css'
,'/transitaire/images/logo.png'
,'/transitaire/images/logo192blanc.png'
,'/transitaire/images/logo512blanc.png'
,'/transitaire/images/favicon-256x256.png'
,'/transitaire/images/GDA_LOGO_TRANSPARENT.png'
,'/transitaire/images/favicon.ico'
];
//
//installation
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(nomCache).then(function(cache) {
      return cache.addAll(contenuCache);
    })
  );
});
//
//repondre aux requetes par le cache
self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/images/logo.png');
      });
    }
  }));
});
