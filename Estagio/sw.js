let staticCacheName = 'static-v1';

this.addEventListener('install', event => {
    this.skipWaiting();

    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll([
                    './main.js',
                    './index.html',
                    './style.css',
                    './manifest.json'
                ]);
            })
    );
});

this.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(function(key){
            return Promise.all(
                key
                    .filter(cacheName => (cacheName.startsWith('static-v0')))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

this.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('offline.html');
            })
    )
});