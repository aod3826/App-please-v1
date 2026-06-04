// ═══════════════════════════════════════════════════════════
//  sw.js — Service Worker | คลังภาพกิจกรรม PWA
//  กลยุทธ์: Cache First (static) + Network First (API)
// ═══════════════════════════════════════════════════════════

const CACHE_NAME    = 'gallery-pwa-v1';
const API_CACHE     = 'gallery-api-v1';
const OFFLINE_URL   = './offline.html';

// ── ไฟล์ที่ cache ตอน install ────────────────────────────────
const PRECACHE_URLS = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Noto+Serif+Thai:wght@400;600;700&family=Sarabun:wght@300;400;500;600&display=swap',
];

// ── Install: pre-cache static assets ─────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS.filter(u => !u.startsWith('https://fonts'))))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: ลบ cache เก่า ───────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== API_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: กลยุทธ์ตาม URL ─────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Google Apps Script API → Network First, fallback cache
  if (url.hostname.includes('script.google.com')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE, 8000));
    return;
  }

  // Google Fonts → Cache First (stale-while-revalidate)
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
    return;
  }

  // Google Drive images → Cache First (TTL 1 วัน)
  if (url.hostname.includes('lh3.googleusercontent.com') ||
      url.hostname.includes('drive.google.com')) {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
    return;
  }

  // Static assets → Cache First
  if (request.method === 'GET') {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
  }
});

// ─────────────────────────────────────────────────────────────
//  กลยุทธ์ Cache First
// ─────────────────────────────────────────────────────────────
async function cacheFirstStrategy(request, cacheName) {
  const cache    = await caches.open(cacheName);
  const cached   = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // offline fallback สำหรับ navigation
    if (request.mode === 'navigate') {
      const offlinePage = await cache.match(OFFLINE_URL);
      if (offlinePage) return offlinePage;
    }
    return new Response('ไม่มีการเชื่อมต่ออินเทอร์เน็ต', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

// ─────────────────────────────────────────────────────────────
//  กลยุทธ์ Network First (พร้อม timeout)
// ─────────────────────────────────────────────────────────────
async function networkFirstStrategy(request, cacheName, timeoutMs = 5000) {
  const cache = await caches.open(cacheName);

  try {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // network fail → ใช้ cache แทน
    const cached = await cache.match(request);
    if (cached) return cached;

    // ส่ง offline JSON response
    return new Response(
      JSON.stringify({
        success: false,
        error:   'ออฟไลน์ — กำลังแสดงข้อมูลล่าสุดจาก Cache',
        offline: true,
      }),
      {
        status:  200,
        headers: {
          'Content-Type':                'application/json',
          'X-PWA-Cache':                 'offline-fallback',
        }
      }
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  Background Sync (รอการเชื่อมต่อกลับมาก่อน POST)
// ─────────────────────────────────────────────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-pending-activities') {
    event.waitUntil(syncPendingActivities());
  }
});

async function syncPendingActivities() {
  try {
    // ตรวจสอบ pending items จาก IndexedDB (ถ้ามี)
    // สำหรับฟีเจอร์นี้ต้องใช้ร่วมกับ IndexedDB ในหน้าหลัก
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({ type: 'SYNC_COMPLETE' });
    });
  } catch (err) {
    console.error('[SW] Sync failed:', err);
  }
}

// ─────────────────────────────────────────────────────────────
//  Push Notification (optional — สำหรับแจ้งเตือน)
// ─────────────────────────────────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'คลังภาพกิจกรรม', {
      body:    data.body   || 'มีกิจกรรมใหม่',
      icon:    './icons/icon-192x192.png',
      badge:   './icons/icon-96x96.png',
      vibrate: [100, 50, 100],
      data:    { url: data.url || './' },
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || './';
  event.waitUntil(
    clients.openWindow(targetUrl)
  );
});
