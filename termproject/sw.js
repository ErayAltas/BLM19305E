self.addEventListener("install", e => {
    console.log("Installed");
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll(["./", "./src/favicon.ico"]);
        })
    );

});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );

});