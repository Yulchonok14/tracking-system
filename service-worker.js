// Listen for install event, set callback
self.addEventListener('install', function(event) {
  console.log('install service-worker');
});

self.addEventListener('activate', function(event) {
  console.log('activate service-worker');
});

self.addEventListener('push', function(event) {

  if (event.data) {
    console.log('This push event has data: ', event.data.text());
    var payload = JSON.parse(event.data.text());
    var title = payload.data.title;
    var message = payload.data.message;

    event.waitUntil(
      self.registration.showNotification(title, {
        body: message
      })
    );
  } else {
    console.log('This push event has no data.');
  }
});

self.addEventListener('notificationclick', function(event) {
  const clickedNotification = event.notification;
  clickedNotification.close();

  // Do something as the result of the notification click
  /*const promiseChain = doSomething();
  event.waitUntil(promiseChain);*/
});
