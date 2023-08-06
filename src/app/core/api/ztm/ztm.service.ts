import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ScheduleNotFoundError, StopNotFoundError } from "@core";
import { Coords } from "@types";
import { crowDistance, normalize } from "@utilities";
import { map, Observable, of, shareReplay, switchMap, zip } from "rxjs";

import { ZtmConfigService } from "./config";
import {
  GeolocalizedZtmStopMetadata,
  GeolocalizedZtmStopWithRelatedStops,
  GeolocalizedZtmStopWithSchedules,
  ZtmEstimatedSchedulesResponse,
  ZtmLineSchedule,
  ZtmLineSchedulesResponse,
  ZtmLineScheduleWithStop,
  ZtmStop,
  ZtmStopsResponse,
  ZtmStopWithRelatedStops,
  ZtmStopWithSchedules
} from "./domain";

interface GetLineSchedule {
  stopId: string;
  lineNumber: string;
  stopDepartureTime: string;
}

@Injectable({ providedIn: "root" })
export class ZtmService {
  private stops?: Observable<ZtmStopsResponse>;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ZtmConfigService
  ) {}

  getStopWithSchedules(stopName: string, ordinalNumber: string): Observable<ZtmStopWithSchedules> {
    return this.getStopByName(stopName, ordinalNumber).pipe(
      switchMap(ztmStop =>
        this.httpClient
          .get<ZtmEstimatedSchedulesResponse>(
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
          .filter(stop => normalize(stop.stopDesc) === normalizedStopName)
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
      this.stops = this.httpClient
        .get<ZtmStopsResponse>(this.configService.stopsEndpointUrl)
        .pipe(shareReplay());
    }

    return this.stops;
  }

  getGeolocalizedStopsWithSchedules(
    currentLocation: Coords,
    searchDistance: number
  ): Observable<GeolocalizedZtmStopWithSchedules[]> {
    return this.getStopsInRadius(currentLocation, searchDistance).pipe(
      switchMap(ztmStops =>
        ztmStops.length
          ? zip(
              ztmStops.map(ztmStop =>
                this.httpClient
                  .get<ZtmEstimatedSchedulesResponse>(
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
    searchDistance: number
  ): Observable<GeolocalizedZtmStopWithRelatedStops[]> {
    return this.getStops().pipe(
      map(({ stops: ztmStops }) => {
        const foundStops: { [stopDesc: string]: GeolocalizedZtmStopWithRelatedStops } = {};

        for (const stop of ztmStops) {
          if (foundStops[stop.stopDesc]) {
            continue;
          }

          const distanceToStop = crowDistance(currentLocation, {
            lat: stop.stopLat,
            lon: stop.stopLon
          });

          if (distanceToStop <= searchDistance) {
            foundStops[stop.stopDesc] = {
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
            !foundStops[stop.stopDesc] ||
            foundStops[stop.stopDesc]?.relatedStops.some(
              relatedStop => relatedStop.stopCode === stop.stopCode
            )
          ) {
            continue;
          }

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

          if (parseInt(stop.stopCode) < parseInt(foundStops[stop.stopDesc].stopCode)) {
            foundStops[stop.stopDesc] = {
              ...stop,
              distance: distanceToStop,
              relatedStops: [...foundStops[stop.stopDesc].relatedStops, stopMetadata]
            };
          } else {
            foundStops[stop.stopDesc].relatedStops.push(stopMetadata);
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

  getLineSchedule({
    stopId,
    lineNumber,
    stopDepartureTime
  }: GetLineSchedule): Observable<ZtmLineScheduleWithStop[]> {
    return this.httpClient
      .get<ZtmLineSchedulesResponse>(
        this.configService.entireScheduleByLineNumberEndpointUrl(lineNumber)
      )
      .pipe(
        map(({ stopTimes: ztmLineSchedules }) => {
          let currentStopIndex = ztmLineSchedules.findIndex(
            schedule =>
              String(schedule.stopId) === stopId &&
              schedule.departureTime.endsWith(stopDepartureTime)
          );

          if (!~currentStopIndex) {
            throw new ScheduleNotFoundError();
          }

          const lineSchedules: ZtmLineSchedule[] = [];
          let stopSequenceNumber = ztmLineSchedules[currentStopIndex].stopSequence;

          while (
            currentStopIndex < ztmLineSchedules.length - 1 &&
            !this.isFirstStopInSequence(stopSequenceNumber)
          ) {
            lineSchedules.push(ztmLineSchedules[currentStopIndex]);

            currentStopIndex++;
            stopSequenceNumber = ztmLineSchedules[currentStopIndex].stopSequence;
          }

          return lineSchedules;
        }),
        switchMap(ztmSchedules =>
          ztmSchedules.length
            ? zip(
                ztmSchedules.map(schedule =>
                  this.getStopById(String(schedule.stopId)).pipe(
                    map(ztmStop => ({ stop: ztmStop, schedule }))
                  )
                )
              )
            : of([])
        )
      );
  }

  private isFirstStopInSequence(stopSequenceNumber: number): boolean {
    return stopSequenceNumber === 0;
  }

  private getStopById(stopId: string): Observable<ZtmStop> {
    return this.getStops().pipe(
      map(stopsResponse => {
        const stop = stopsResponse.stops.find(stop => String(stop.stopId) === stopId);

        if (!stop) {
          throw new StopNotFoundError();
        }

        return stop;
      })
    );
  }
}
