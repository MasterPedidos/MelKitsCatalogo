// ===================================
// SERVICE WORKER - Sempre Atualizado
// ===================================

// Nome do cache (mude ao atualizar arquivos base)
const CACHE_NAME = "pm-cache-v3";

// Arquivos essenciais que podem ser usados offline
const FILES_TO_CACHE = [
  "index.html",
  "manifest.json"
  // ❌ IMPORTANTE: NÃO coloco produtos.json aqui!
  // Assim o navegador SEMPRE baixa o mais novo do GitHub.
];

// INSTALAÇÃO — cria o cache inicial
self.addEventListener("install", event => {
  self.skipWaiting(); // ativa imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// ATIVAÇÃO — remove caches antigos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// FETCH — tenta buscar online SEMPRE primeiro
self.addEventListener("fetch", event => {
  const request = event.request;

  // Sempre buscar produtos.json no servidor (nunca usar cache)
  if (request.url.includes("produtos.json")) {
    event.respondWith(fetch(request));
    return;
  }

  // Para outros arquivos: usa rede, e cai no cache caso offline
  event.respondWith(
    fetch(request)
      .then(response => response)
      .catch(() => caches.match(request))
  );
});
