const CACHE = "bulutoyun-v18";
const ASSETS = ["./BulutOyunTD.html", "./manifest.json", "./icon.svg", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./three.min.js"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;                       // Azure POST vb. dokunma
  let url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (url.origin !== self.location.origin) return;        // dis kaynaklara dokunma
  const belge = req.mode === "navigate" || req.destination === "document";
  // Sayfayi HER ZAMAN tazeden al (tarayici HTTP onbellegini atla) -> eski surum takili kalmaz
  const ag = belge ? fetch(url.href, { cache: "no-store", credentials: "same-origin" }) : fetch(req);
  e.respondWith(ag.then((res) => {
    const kopya = res.clone();
    caches.open(CACHE).then((c) => c.put(req, kopya)).catch(() => {});
    return res;
  }).catch(() => caches.match(req).then((m) => m || caches.match("./BulutOyunTD.html"))));
});
