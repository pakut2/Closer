import { Injectable } from "@angular/core";
import { Coords, GeolocalizedStop, Stop, StopSlug } from "@types";
import { minuteDifference } from "@utilities";
import { DateTime } from "luxon";
import { map, Observable, of, zip } from "rxjs";

import {
  GeolocalizedZtmStopWithSchedules,
  NIGHT_LINE_INDICATOR,
  NIGHT_LINE_PREFIX,
  ZtmStopWithSchedules
} from "./domain";
import { ZtmService } from "./ztm.service";

@Injectable({ providedIn: "root" })
export class ZtmAdapter {
  constructor(private readonly ztmService: ZtmService) {}

  getUniqueStopNames(): Observable<string[]> {
    return this.ztmService
      .getStops()
      .pipe(map(ztmStops => [...new Set(ztmStops.stops.map(stop => stop.stopName))].sort()));
  }

  getStopsWithSchedules(stopIds: StopSlug[]): Observable<Stop[]> {
    return stopIds.length
      ? zip(
          stopIds.map(({ name: stopName, ordinalNumber }) =>
            this.ztmService.getStopWithSchedules(stopName, ordinalNumber)
          )
        ).pipe(map(ztmStops => ztmStops.map(ztmStop => this.prepareStop(ztmStop))))
      : of([]);
  }

  getStopWithSchedules({ name: stopName, ordinalNumber }: StopSlug): Observable<Stop> {
    return this.ztmService
      .getStopWithSchedules(stopName, ordinalNumber)
      .pipe(map(ztmStop => this.prepareStop(ztmStop)));
  }

  private prepareStop(ztmSchedule: ZtmStopWithSchedules): Stop {
    const { stop, delay: schedules } = ztmSchedule;
    const currentIsoDate = new Date().toISOString();

    return {
      id: String(stop.stopId),
      name: stop.stopName,
      ordinalNumber: stop.stopCode,
      relatedStops: stop.relatedStops.map(stopMetadata => ({
        id: String(stopMetadata.stopId),
        ordinalNumber: stopMetadata.stopCode
      })),
      schedules: schedules.map(schedule => ({
        lineNumber: this.handleNightLine(String(schedule.routeId)),
        destination: schedule.headsign,
        departsIn: this.getMinuteDifference(currentIsoDate, schedule.estimatedTime)
      }))
    };
  }

  private handleNightLine(lineNumber: string): string {
    return lineNumber.length > 1 && lineNumber.startsWith(NIGHT_LINE_INDICATOR)
      ? lineNumber.replace(new RegExp(`^${NIGHT_LINE_INDICATOR}`), NIGHT_LINE_PREFIX)
      : lineNumber;
  }

  private getMinuteDifference(currentIsoDate: string, targetTime: string): string {
    const targetIsoDate = DateTime.fromFormat(targetTime, "HH:mm").toISO();

    if (!targetIsoDate) {
      return targetTime;
    }

    const timeRemaining = minuteDifference(currentIsoDate, targetIsoDate);

    return timeRemaining > 0 ? `${timeRemaining} min` : ">>>";
  }

  getGeolocalizedStopsWithSchedules(
    currentLocation: Coords,
    searchRadius: number
  ): Observable<GeolocalizedStop[]> {
    return this.ztmService
      .getGeolocalizedStopsWithSchedules(currentLocation, searchRadius)
      .pipe(map(ztmStops => ztmStops.map(ztmStop => this.prepareGeolocalizedStop(ztmStop))));
  }

  private prepareGeolocalizedStop(ztmSchedule: GeolocalizedZtmStopWithSchedules): GeolocalizedStop {
    const { stop } = ztmSchedule;

    return {
      ...this.prepareStop(ztmSchedule),
      location: {
        coords: { lat: stop.stopLat, lon: stop.stopLon },
        distance: Math.round(stop.distance)
      },
      relatedStops: stop.relatedStops.map(stopMetadata => ({
        id: String(stopMetadata.stopId),
        ordinalNumber: stopMetadata.stopCode,
        location: {
          coords: { lat: stopMetadata.stopLat, lon: stopMetadata.stopLon },
          distance: Math.round(stopMetadata.distance)
        }
      }))
    };
  }
}
