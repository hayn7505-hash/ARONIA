const CACHE_NAME = "aronia-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {

  const url = new URL(event.request.url);

  if (
    url.hostname.endsWith("supabase.co")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(async () => {

      const cached =
        await caches.match(event.request);

      if (cached) {
        return cached;
      }

      return new Response(
        "Network request failed",
        {
          status: 503
        }
      );

    })
  );

});
