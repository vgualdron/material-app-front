import { register } from 'register-service-worker';
import { Notify } from 'quasar';

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready(/* registration */) {
    console.log('Service worker is active.');
  },
  registered(/* registration */) {
    console.log('Service worker has been registered.');
  },
  cached(/* registration */) {
    console.log('Content has been cached for offline use.');
  },
  updatefound(/* registration */) {
    console.log('New content is downloading.');
  },
  updated(/* registration */) {
    console.log('New content is available; please refresh.');
    Notify.create({
      message: 'Nueva versión de la app está disponible',
      icon: 'cloud_download',
      color: 'green',
      closeBtn: 'Actualizar',
      timeout: 10000,
      actions: [
        {
          size: 'xs',
          bold: true,
          round: true,
          icon: 'close',
          class: 'bg-white',
          color: 'gray-1',
          handler: () => undefined,
        },
      ],
      onDismiss() {
        window.location.reload(true);
      },
    });
  },
  offline() {
    console.log('No internet connection found. App is running in offline mode.');
  },
  error(err) {
    console.error('Error during service worker registration:', err);
  },
});
