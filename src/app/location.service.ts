import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  getCurrentPosition(): Observable<any> {
    return new Observable((observer) => {

      let watchId : number;
      const onSuccess: PositionCallback = function (position) {
        observer.next(position);
      }

      const onError: PositionErrorCallback = function (error){
        observer.error(error);
      }

      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(onSuccess, onError,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 5000
          }
        );
      } else {
        onError(new GeolocationPositionError());
      }

      return {unsubscribe() {navigator.geolocation.clearWatch(watchId); }};
    });
  }



}
