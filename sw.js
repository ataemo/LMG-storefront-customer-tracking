// sw.js - Service Worker ຂັ້ນຕ່ຳ ສຳລັບ LMG Store PWA
// ໜ້າທີ່ຫຼັກ: ເຮັດໃຫ້ browser ຖືວ່າເວັບນີ້ "ຕິດຕັ້ງໄດ້ (installable)" ຕາມເງື່ອນໄຂຂອງ Chrome/Android
// ບໍ່ໄດ້ເຮັດ offline cache ແບບເລິກ ເພາະລະບົບນີ້ຕ້ອງການອິນເຕີເນັດເພື່ອດຶງຂໍ້ມູນຈາກ Google Sheets ຢູ່ແລ້ວ

const CACHE_NAME = 'lmg-store-v2';
const CORE_ASSETS = [
  './',
  './index.html'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// ຍຸດທະສາດ: network-first, fallback ໄປ cache ຖ້າ offline (ໜ້າ shell ເທົ່ານັ້ນ)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
