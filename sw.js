// Offline copy of the locked board (Patrick 2026-10-21). Only the encrypted page is stored; the password still opens it.
// Pages: try the network first so the daily refresh shows up, fall back to the saved copy when offline.
// Libraries and fonts from CDNs: use the saved copy, refresh it in the background.
const C='nwc-board-v1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin===location.origin){e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./'))));return}
  if(!/^https:$/.test(u.protocol))return;
  e.respondWith(caches.open(C).then(c=>c.match(r).then(m=>{const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res}).catch(()=>m);return m||net})))});
