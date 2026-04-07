self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

let notifTimer = null;

function scheduleNext(ms, message) {
  if (notifTimer) clearTimeout(notifTimer);
  notifTimer = setTimeout(() => {
    self.registration.showNotification('Recordatori', {
      body: message,
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [200, 100, 200],
      requireInteraction: false
    });
    scheduleNext(ms, message);
  }, ms);
}

self.addEventListener('message', event => {
  const { type, ms, message } = event.data || {};
  if (type === 'START') {
    scheduleNext(ms, message);
  } else if (type === 'STOP') {
    if (notifTimer) clearTimeout(notifTimer);
    notifTimer = null;
  } else if (type === 'TEST') {
    self.registration.showNotification('Recordatori', {
      body: message,
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [200, 100, 200]
    });
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
