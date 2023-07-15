import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { StopIdentifier } from "@types";
import { removeDiacritics } from "@utilities";
import { concatMap, map, Observable, zip } from "rxjs";

import { ZtmConfigService } from "./config";
import {
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

  getStopsWithSchedules(stopIds: StopIdentifier[]): Observable<ZtmStopWithSchedules[]> {
    return zip(
      stopIds.map(stopId => this.getScheduleByStopName(stopId.name, stopId.ordinalNumber))
    );
  }

  private getScheduleByStopName(
    stopName: string,
    ordinalNumber: string
  ): Observable<ZtmStopWithSchedules> {
    return this.getStopByName(stopName, ordinalNumber).pipe(
      concatMap(stop =>
        this.httpClient
          .get<ZtmSchedulesResponse>(
            this.configService.schedulesByStopIdEndpointUrl(String(stop.stopId))
          )
          .pipe(map(ztmSchedules => ({ ...ztmSchedules, stop } satisfies ZtmStopWithSchedules)))
      )
    );
  }

  private getStopByName(
    stopName: string,
    ordinalNumber: string
  ): Observable<ZtmStopWithRelatedStops> {
    return this.getStops().pipe(
      map(stopsResponse => {
        const stopNameWithoutDiacritics = removeDiacritics(stopName);

        const stops = stopsResponse.stops
          .filter(stop => removeDiacritics(stop.stopName) === stopNameWithoutDiacritics)
          .sort(({ stopCode: stopCode1 }, { stopCode: stopCode2 }) =>
            stopCode1.localeCompare(stopCode2)
          );

        if (!stops.length) {
          // TODO error handling (toast?)
          console.error(`Stop with name ${stopName} not found`);
          throw new Error();
        }

        const targetStop = stops.find(stop => stop.stopCode === ordinalNumber) ?? stops[0];

        return {
          ...targetStop,
          relatedStops: stops.map(stop => ({ stopId: stop.stopId, stopCode: stop.stopCode }))
        } satisfies ZtmStopWithRelatedStops;
      })
    );
  }
}
