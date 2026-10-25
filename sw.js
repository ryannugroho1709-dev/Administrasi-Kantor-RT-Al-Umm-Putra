// Service Worker — app shell caching + push notification handler
const CACHE_NAME = "rt-putra-shell-v5";
const APP_SHELL = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

// Network-first untuk index.html supaya update selalu kepakai; fallback ke cache kalau offline.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(req, { cache: "no-store" })
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match("./index.html")))
  );
});

// ── PUSH NOTIFICATION (Web Push via VAPID — fase berikutnya) ──────────────────
self.addEventListener("push", (event) => {
  let data = { title: "Aplikasi Guru Kelas", body: "Ada notifikasi baru.", icon: "./icons/icon-192.png" };
  try { if (event.data) data = { ...data, ...event.data.json() }; } catch (e) {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || "./icons/icon-192.png",
      badge: "./icons/favicon-64.png",
      tag: data.tag || "push-notif",
      renotify: true,
      data: { url: data.url || "/" },
    })
  );
});

// ── KLIK NOTIFIKASI → buka / fokus ke aplikasi ────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      // Kalau sudah ada tab yang buka aplikasi, fokus ke sana
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      // Kalau tidak ada, buka tab baru
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
