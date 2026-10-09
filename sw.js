const CACHE = 'quiz-hub-v8';
const ASSETS = [
  './', 
  './index.html', 
  './manifest.webmanifest',
  './404.html',
  './css/main.css',
  './js/utils.js', 
  './js/keyboard.js', 
  './js/storage.js',
  './js/settings.js', 
  './js/question-manager.js',
  './js/bookmarks.js', 
  './js/history.js',
  './js/question-stats.js',
  './js/weak.js',
  './js/performance.js',
  './js/mixed.js',
  './js/ai.js',
  './js/practice.js', 
  './js/study.js',
  './js/exam.js', 
  './js/app.js',


  /* All question files */
  './questions/artificial-intelligence.js',
  './questions/basic-computer.js',                 
  './questions/computer-network.js',
  './questions/computer-organization.js',
  './questions/computer-security.js',
  './questions/data-structure.js',
  './questions/dbms.js',
  './questions/digital-logic.js',
  './questions/e-commerce.js',
  './questions/iot.js',
  './questions/multimedia.js',
  './questions/oop.js',
  './questions/operating-system.js',
  './questions/software-engineering.js',
  './questions/theory-of-computation.js',
  './questions/web-technology.js',

  './icons/icon-192.png', 
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});