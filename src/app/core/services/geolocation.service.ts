import { Injectable } from "@angular/core";
import { Geolocation } from "@capacitor/geolocation";
import { Coords } from "@types";
import { from, map, Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class GeolocationService {
  getCurrentLocation(): Observable<Coords> {
    return from(Geolocation.getCurrentPosition({ enableHighAccuracy: true })).pipe(
      map(({ coords }) => ({ lat: coords.latitude, lon: coords.longitude }))
    );
  }
}
