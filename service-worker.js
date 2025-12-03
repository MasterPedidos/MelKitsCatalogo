const CACHE_NAME = "melkits-cache-v1";

// Lista mínima de arquivos essenciais
const FILES_TO_CACHE = [
  "index.html",
  "manifest.json",
  "ativo/logo.svg",
  "ativo/SemEstoque.png",
  "produtos.json"
];

// Instalação do Service Worker
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(FILES_TO_CACHE)
          .catch(err => {
            console.warn("⚠ ERRO ao adicionar arquivos no cache (IGNORADO):", err);
            return Promise.resolve(); // NÃO trava o SW
          });
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );

  self.clients.claim();
});

// Interceptar requisições
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna do cache se existir
        if (response) return response;

        // Busca da rede, ignora erro de arquivos ausentes
        return fetch(event.request).catch(err => {
          console.warn("⚠ Falha ao buscar recurso:", event.request.url);
          return new Response("Offline", { status: 503, statusText: "Offline" });
        });
      })
  );
});
