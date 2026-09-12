/* GitHub Pages does not send COOP and COEP, so the browser refuses the page a SharedArrayBuffer
   and the model runtime is left with a single thread. This adds the two headers on the way past.
   It caches nothing: the page you get is always the one on the server. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.cache === 'only-if-cached' && r.mode !== 'same-origin') return;   // Chrome throws on these
  e.respondWith(fetch(r).then(res => {
    if (!res || res.status === 0) return res;                             // opaque: leave it alone
    const h = new Headers(res.headers);
    h.set('Cross-Origin-Embedder-Policy', 'credentialless');
    h.set('Cross-Origin-Opener-Policy', 'same-origin');
    return new Response(res.body, {status:res.status, statusText:res.statusText, headers:h});
  }));
});
