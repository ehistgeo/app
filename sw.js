// Service worker du portail e-histgeo.
// Stratégie : le cache répond d'abord, le réseau rafraîchit en arrière-plan.
// L'app s'ouvre donc instantanément et hors ligne, et se met à jour à la visite suivante.
// Incrémenter CACHE à chaque changement de la liste ASSETS.

const CACHE = 'ehistgeo-v42';

/* Seuls les fichiers dont la page a besoin pour s'afficher. Les icônes du
   manifeste ne sont pas préchargées : le navigateur ne les demande qu'au moment
   d'installer l'app, et le gestionnaire fetch les mettra en cache alors.
   L'original haute définition est rangé dans source/, hors du chemin servi. */
const ASSETS = [
  './',
  './index.html',
  './mentions.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './logo-160.png',
  './logo-160-sombre.png',
  './favicon-32.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(cached => {
      const fromNetwork = fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached || caches.match('./index.html'));

      return cached || fromNetwork;
    })
  );
});
