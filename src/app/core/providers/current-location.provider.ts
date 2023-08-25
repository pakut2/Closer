import { InjectionToken, ValueProvider } from "@angular/core";
import { Geolocation } from "@capacitor/geolocation";
import { Coords } from "@types";
import { from, map, Observable } from "rxjs";

export const CURRENT_LOCATION = new InjectionToken<Observable<Coords>>("CURRENT_LOCATION");

export const CurrentLocationProvider: ValueProvider = {
  provide: CURRENT_LOCATION,
  useValue: from(Geolocation.getCurrentPosition({ enableHighAccuracy: true })).pipe(
    map(({ coords }) => ({ lat: coords.latitude, lon: coords.longitude }))
  )
};
