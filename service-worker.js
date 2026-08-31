const CACHE_NAME =
"paintcalc-v999";

const urlsToCache = [
  "/PaintCalculator/",
  "/PaintCalculator/index.html",
  "/PaintCalculator/style.css",
  "/PaintCalculator/app.js",
  "/PaintCalculator/manifest.json",
  "/PaintCalculator/icon-512.png"
];

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })

  );

  self.skipWaiting();

});

self.addEventListener("activate", event => {

  event.waitUntil(
    self.clients.claim()
  );

});

self.addEventListener("fetch", event => {

  event.respondWith(

    fetch(event.request)
      .catch(() => caches.match(event.request))

  );

});
