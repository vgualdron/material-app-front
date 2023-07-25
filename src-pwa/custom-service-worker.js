// service-worker.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');
import {precacheAndRoute} from 'workbox-precaching';
precacheAndRoute(self.__WB_MANIFEST);

//Cambiar este valor cada vez antes de compilar
const LATEST_VERSION = process.env.LATEST_VERSION_APP;
console.log(LATEST_VERSION);

workbox.core.setCacheNameDetails({ prefix: 'd4' })

self.addEventListener('activate', (event) => {
    console.log(`%c ${LATEST_VERSION} `, 'background: #ddd; color: #0000ff');
    if (caches) {
        caches.keys().then((arr) => {
            arr.forEach((key) => {
                if (key.indexOf('d4-precache') < -1) {
                    caches.delete(key).then(() => console.log(`%c Cleared ${key}`, 'background: #333; color: #ff0000'));
                } else {
                    caches.open(key).then((cache) => {
                        cache.match('version').then((res) => {
                            if (!res) {
                                cache.put('version', new Response(LATEST_VERSION, { status: 200, statusText: LATEST_VERSION }));
                            } else if (res.statusText !== LATEST_VERSION) {
                                caches.delete(key).then(() => console.log(`%c Cleared Cache ${LATEST_VERSION}`, 'background: #333; color: #ff0000'));
                            } else console.log(`%c Genial, tienes la última versión ${LATEST_VERSION}`, 'background: #333; color: #00ff00');
                        });
                    });
                }
            });
        });
    }
});
workbox.skipWaiting();
workbox.clientsClaim();
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});