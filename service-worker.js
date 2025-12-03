// ===============================================
// SERVICE WORKER SIMPLES E ESTÁVEL PARA PWA
// Igual ao comportamento do Pedidos Master
// ===============================================

// Instala imediatamente
self.addEventListener("install", event => {
  self.skipWaiting();
});

// Ativa imediatamente
self.addEventListener("activate", event => {
  clients.claim();
});

// Responde às requisições normalmente
// Se falhar (offline), tenta usar algo do cache
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
