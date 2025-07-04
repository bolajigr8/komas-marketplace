// // self.addEventListener("push", function (event) {
// //   if (event.data) {
// //     const data = event.data.json();
// //     const options = {
// //       body: data.body,
// //       icon: data.icon || "/icon.png",
// //       badge: "/badge.png",
// //       vibrate: [100, 50, 100],
// //       data: {
// //         dateOfArrival: Date.now(),
// //         primaryKey: "2",
// //       },
// //     };
// //     event.waitUntil(self.registration.showNotification(data.title, options));
// //   }
// // });

// // self.addEventListener("notificationclick", function (event) {
// //   console.log("Notification click received.");
// //   event.notification.close();
// //   event.waitUntil(clients.openWindow("<https://your-website.com>"));
// // });

// const CACHE_NAME = "komas-pwa-v1";
// const ASSETS_TO_CACHE = [
//   "/",
//   "/offline",
//   "/manifest.json",
//   "/icon-192x192.png",
//   "/icon-512x512.png",
//   "/favicon.ico",
// ];

// // Install event - cache assets
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches
//       .open(CACHE_NAME)
//       .then((cache) => {
//         return cache.addAll(ASSETS_TO_CACHE);
//       })
//       .then(() => self.skipWaiting())
//   );
// });

// // Activate event - clean up old caches
// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches
//       .keys()
//       .then((cacheNames) => {
//         return Promise.all(
//           cacheNames
//             .filter((name) => name !== CACHE_NAME)
//             .map((name) => caches.delete(name))
//         );
//       })
//       .then(() => self.clients.claim())
//   );
// });

// // Fetch event - serve from cache, fall back to network
// self.addEventListener("fetch", (event) => {
//   // Skip non-GET requests and browser extensions
//   if (
//     event.request.method !== "GET" ||
//     event.request.url.startsWith("chrome-extension") ||
//     event.request.url.includes("extension") ||
//     // Skip API and tracking requests
//     event.request.url.includes("/api/") ||
//     event.request.url.includes("/analytics/")
//   ) {
//     return;
//   }

//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       // Return from cache if available
//       if (response) {
//         return response;
//       }

//       // Otherwise fetch from network
//       return fetch(event.request)
//         .then((response) => {
//           // Don't cache if response is invalid
//           if (
//             !response ||
//             response.status !== 200 ||
//             response.type !== "basic"
//           ) {
//             return response;
//           }

//           // Clone the response
//           const responseToCache = response.clone();

//           // Cache the fetched response
//           caches.open(CACHE_NAME).then((cache) => {
//             cache.put(event.request, responseToCache);
//           });

//           return response;
//         })
//         .catch(() => {
//           // If offline and requesting a page, show offline page
//           if (event.request.destination === "document") {
//             return caches.match("/offline");
//           }

//           // For images, return a fallback
//           if (event.request.destination === "image") {
//             return caches.match("/images/fallback.jpg");
//           }

//           // For other resources, just fail
//           return new Response("Network error happened", {
//             status: 408,
//             headers: { "Content-Type": "text/plain" },
//           });
//         });
//     })
//   );
// });

// // Push event - show notification
// self.addEventListener("push", (event) => {
//   if (event.data) {
//     const data = event.data.json();
//     const options = {
//       body: data.body,
//       icon: data.icon || "/icon.png",
//       badge: "/badge.png",
//       vibrate: [100, 50, 100],
//       data: {
//         dateOfArrival: Date.now(),
//         url: data.url || "/",
//       },
//       actions: [
//         {
//           action: "view",
//           title: "View",
//         },
//         {
//           action: "close",
//           title: "Close",
//         },
//       ],
//     };

//     event.waitUntil(self.registration.showNotification(data.title, options));
//   }
// });

// // Notification click event
// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();

//   if (event.action === "close") {
//     return;
//   }

//   // Open the URL from the notification data or default to homepage
//   const urlToOpen = event.notification.data.url || "/";

//   event.waitUntil(
//     clients
//       .matchAll({ type: "window", includeUncontrolled: true })
//       .then((windowClients) => {
//         // Check if there is already a window/tab open with the target URL
//         for (let i = 0; i < windowClients.length; i++) {
//           const client = windowClients[i];
//           if (client.url === urlToOpen && "focus" in client) {
//             return client.focus();
//           }
//         }

//         // If no window/tab is open, open a new one
//         if (clients.openWindow) {
//           return clients.openWindow(urlToOpen);
//         }
//       })
//   );
// });
