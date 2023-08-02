import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { StopNotFoundError } from "@core";
import { Coords } from "@types";
import { crowDistance, normalize } from "@utilities";
import { map, mergeMap, Observable, of, zip } from "rxjs";

import { ZtmConfigService } from "./config";
import {
  GeolocalizedZtmStopMetadata,
  GeolocalizedZtmStopWithRelatedStops,
  GeolocalizedZtmStopWithSchedules,
  URBAN_ZONE_ID,
  ZtmSchedulesResponse,
  ZtmStopsResponse,
  ZtmStopWithRelatedStops,
  ZtmStopWithSchedules
} from "./domain";

@Injectable({ providedIn: "root" })
export class ZtmService {
  private stops?: Observable<ZtmStopsResponse>;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ZtmConfigService
  ) {}

  getStopWithSchedules(stopName: string, ordinalNumber: string): Observable<ZtmStopWithSchedules> {
    return this.getStopByName(stopName, ordinalNumber).pipe(
      mergeMap(ztmStop =>
        this.httpClient
          .get<ZtmSchedulesResponse>(
            this.configService.schedulesByStopIdEndpointUrl(String(ztmStop.stopId))
          )
          .pipe(
            map(ztmSchedules => ({ ...ztmSchedules, stop: ztmStop } satisfies ZtmStopWithSchedules))
          )
      )
    );
  }

  private getStopByName(
    stopName: string,
    ordinalNumber: string
  ): Observable<ZtmStopWithRelatedStops> {
    return this.getStops().pipe(
      map(stopsResponse => {
        const normalizedStopName = normalize(stopName);

        const stops = stopsResponse.stops
          .filter(stop => normalize(stop.stopName) === normalizedStopName)
          .sort(
            ({ stopCode: stopCode1 }, { stopCode: stopCode2 }) =>
              parseInt(stopCode1) - parseInt(stopCode2)
          );

        if (!stops.length) {
          throw new StopNotFoundError(stopName);
        }

        const targetStop = stops.find(stop => stop.stopCode === ordinalNumber) ?? stops[0];

        return {
          ...targetStop,
          relatedStops: stops.map(stop => ({ stopId: stop.stopId, stopCode: stop.stopCode }))
        } satisfies ZtmStopWithRelatedStops;
      })
    );
  }

  getStops(): Observable<ZtmStopsResponse> {
    if (!this.stops) {
      this.stops = this.httpClient.get<ZtmStopsResponse>(this.configService.stopsEndpointUrl).pipe(
        map(stopsResponse => ({
          ...stopsResponse,
          stops: stopsResponse.stops.filter(stop => stop.zoneId === URBAN_ZONE_ID)
        }))
      );
    }

    return this.stops;
  }

  getGeolocalizedStopsWithSchedules(
    currentLocation: Coords,
    searchRadius: number
  ): Observable<GeolocalizedZtmStopWithSchedules[]> {
    return this.getStopsInRadius(currentLocation, searchRadius).pipe(
      mergeMap(ztmStops =>
        ztmStops.length
          ? zip(
              ztmStops.map(ztmStop =>
                this.httpClient
                  .get<ZtmSchedulesResponse>(
                    this.configService.schedulesByStopIdEndpointUrl(String(ztmStop.stopId))
                  )
                  .pipe(
                    map(
                      ztmSchedules =>
                        ({
                          ...ztmSchedules,
                          stop: ztmStop
                        } satisfies GeolocalizedZtmStopWithSchedules)
                    )
                  )
              )
            )
          : of([])
      )
    );
  }

  private getStopsInRadius(
    currentLocation: Coords,
    searchRadius: number
  ): Observable<GeolocalizedZtmStopWithRelatedStops[]> {
    return this.getStops().pipe(
      map(({ stops: ztmStops }) => {
        const foundStops: { [stopName: string]: GeolocalizedZtmStopWithRelatedStops } = {};

        for (const stop of ztmStops) {
          if (foundStops[stop.stopName]) {
            continue;
          }

          const distanceToStop = crowDistance(currentLocation, {
            lat: stop.stopLat,
            lon: stop.stopLon
          });

          if (distanceToStop <= searchRadius) {
            foundStops[stop.stopName] = {
              ...stop,
              distance: distanceToStop,
              relatedStops: [
                {
                  stopId: stop.stopId,
                  stopCode: stop.stopCode,
                  stopLat: stop.stopLat,
                  stopLon: stop.stopLon,
                  distance: distanceToStop
                }
              ]
            };
          }
        }

        for (const stop of ztmStops) {
          if (
            foundStops[stop.stopName] &&
            !foundStops[stop.stopName].relatedStops.some(
              relatedStop => relatedStop.stopCode === stop.stopCode
            )
          ) {
            const distanceToStop = crowDistance(currentLocation, {
              lat: stop.stopLat,
              lon: stop.stopLon
            });

            const stopMetadata: GeolocalizedZtmStopMetadata = {
              stopId: stop.stopId,
              stopCode: stop.stopCode,
              stopLat: stop.stopLat,
              stopLon: stop.stopLon,
              distance: distanceToStop
            };

            if (parseInt(stop.stopCode) < parseInt(foundStops[stop.stopName].stopCode)) {
              foundStops[stop.stopName] = {
                ...stop,
                distance: distanceToStop,
                relatedStops: [...foundStops[stop.stopName].relatedStops, stopMetadata]
              };
            } else {
              foundStops[stop.stopName].relatedStops.push(stopMetadata);
            }
          }
        }

        return Object.values(foundStops)
          .map(stop => ({
            ...stop,
            relatedStops: stop.relatedStops.sort(
              ({ stopCode: stopCode1 }, { stopCode: stopCode2 }) =>
                parseInt(stopCode1) - parseInt(stopCode2)
            )
          }))
          .sort(({ distance: distance1 }, { distance: distance2 }) => distance1 - distance2);
      })
    );
  }
}
