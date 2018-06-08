import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class NotificationService {

  constructor(private _http: HttpClient) {
  }

  sendSubscription(subscription) {
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post('/subscription', JSON.stringify(subscription), {headers: myHeaders})
      .subscribe(res => {
          console.log('result: ', res);
          return res;
        },
        error => {
          throw new Error(error.error.message);
        });
  }

  subscribeUserToPush() {
    return navigator.serviceWorker.register('/service-worker.js', {
      scope: '/src/app/'
    })
      .then( (registration) => {
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(
            'BDCqREY9G8__-ZRTC5zWAO5ox73t9yUm_l0rR-kXKm0ZBHtB5vjjHhP90dxjTUuzbMUOoocE2tBPDDdbkOJwnO0'
          )
        };

        return registration.pushManager.subscribe(subscribeOptions);
      })
      .then(function (pushSubscription) {
        console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
        return pushSubscription;
      });
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  askPermission() {
    return new Promise(function(resolve, reject) {
      const permissionResult = Notification.requestPermission(function(result) {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    })
      .then(function(permissionResult) {
        console.log('permissionResult: ', permissionResult);
        if (permissionResult !== 'granted') {
          throw new Error('We weren\'t granted permission.');
        }
      });
  }

  sendPushMessage() {
    const notification = {
      'data': {
        'title' : 'Yuliya',
        'message' : 'You\'re awesome!'
      }
    };
    this._http.post('/trigger-push-msg', notification)
      .subscribe(res => {console.log('result sendPushMessage: ', res); });
  }
}
