import { Injectable } from "@angular/core";
import {
  Coords,
  EntireLineSchedule,
  GeolocalizedStop,
  MinifiedStopSchedule,
  Schedule,
  Stop,
  StopNaturalKey
} from "@types";
import { Time } from "@utilities";
import { DateTime } from "luxon";
import { map, Observable, of, zip } from "rxjs";

import {
  GeolocalizedZtmStopWithSchedules,
  NIGHT_LINE_INDICATOR,
  NIGHT_LINE_PREFIX,
  ZtmLineScheduleWithStop,
  ZtmStopWithSchedules
} from "./domain";
import { ZtmService } from "./ztm.service";

@Injectable({ providedIn: "root" })
export class ZtmAdapter {
  constructor(private readonly ztmService: ZtmService, private readonly time: Time) {}

  getUniqueStopNames(): Observable<string[]> {
    return this.ztmService
      .getStops()
      .pipe(map(ztmStops => [...new Set(ztmStops.stops.map(stop => stop.stopDesc))].sort()));
  }

  getStopsWithSchedules(stopIds: StopNaturalKey[]): Observable<Stop[]> {
    return stopIds.length
      ? zip(
          stopIds.map(({ name: stopName, ordinalNumber }) =>
            this.ztmService.getStopWithSchedules(stopName, ordinalNumber)
          )
        ).pipe(map(ztmStops => ztmStops.map(ztmStop => this.prepareStop(ztmStop))))
      : of([]);
  }

  getStopWithSchedules({ name: stopName, ordinalNumber }: StopNaturalKey): Observable<Stop> {
    return this.ztmService
      .getStopWithSchedules(stopName, ordinalNumber)
      .pipe(map(ztmStop => this.prepareStop(ztmStop)));
  }

  private prepareStop(ztmSchedule: ZtmStopWithSchedules): Stop {
    const { stop, delay: schedules } = ztmSchedule;
    const currentIsoDate = new Date().toISOString();

    return {
      id: String(stop.stopId),
      name: stop.stopDesc,
      ordinalNumber: stop.stopCode,
      relatedStops: stop.relatedStops.map(stopMetadata => ({
        id: String(stopMetadata.stopId),
        ordinalNumber: stopMetadata.stopCode
      })),
      schedules: schedules.map(schedule => ({
        lineNumber: this.fromZtmNightLineFormat(String(schedule.routeId)),
        destination: schedule.headsign,
        departsIn: this.getMinuteDifference(currentIsoDate, schedule.estimatedTime),
        departsAt: schedule.theoreticalTime
      }))
    };
  }

  private fromZtmNightLineFormat(lineNumber: string): string {
    return lineNumber.length > 1 && lineNumber.startsWith(NIGHT_LINE_INDICATOR)
      ? lineNumber.replace(new RegExp(`^${NIGHT_LINE_INDICATOR}`), NIGHT_LINE_PREFIX)
      : lineNumber;
  }

  private getMinuteDifference(currentIsoDate: string, targetTime: string): string {
    const targetIsoTime = DateTime.fromFormat(targetTime, "HH:mm").toUTC().toISOTime();

    if (!targetIsoTime) {
      return targetTime;
    }

    const timeRemaining = this.time.minuteDifference(currentIsoDate, targetIsoTime);

    return timeRemaining > 0 ? `${timeRemaining} min` : ">>>";
  }

  getGeolocalizedStopsWithSchedules(
    currentLocation: Coords,
    searchDistance: number
  ): Observable<GeolocalizedStop[]> {
    return this.ztmService
      .getGeolocalizedStopsWithSchedules(currentLocation, searchDistance)
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

  getLineSchedule(stop: Stop, schedule: Schedule): Observable<EntireLineSchedule> {
    const ztmLineNumber = this.toZtmNightLineFormat(schedule.lineNumber);
    const ztmDepartureTime = `${schedule.departsAt}:00`;

    return this.ztmService
      .getLineSchedule({
        stopId: stop.id,
        lineNumber: ztmLineNumber,
        stopDepartureTime: ztmDepartureTime
      })
      .pipe(
        map(ztmLineSchedules => ({
          lineNumber: schedule.lineNumber,
          destination: schedule.destination,
          schedules: ztmLineSchedules.map(ztmSchedule => this.prepareLineSchedule(ztmSchedule))
        }))
      );
  }

  private toZtmNightLineFormat(lineNumber: string): string {
    return lineNumber.length > 1 && lineNumber.startsWith(NIGHT_LINE_PREFIX)
      ? lineNumber.replace(new RegExp(`^${NIGHT_LINE_PREFIX}`), NIGHT_LINE_INDICATOR)
      : lineNumber;
  }

  private prepareLineSchedule(ztmRouteSchedule: ZtmLineScheduleWithStop): MinifiedStopSchedule {
    return {
      stopName: ztmRouteSchedule.stop.stopDesc,
      departsAt: DateTime.fromISO(ztmRouteSchedule.schedule.departureTime).toFormat("HH:mm")
    };
  }

  getLineNumbersForStop(stop: Stop): Observable<string[]> {
    return this.ztmService.getLineNumbersForStop(stop.id).pipe(
      map(lineNumbers => {
        if (!lineNumbers.length) {
          return [...new Set(stop.schedules.map(schedule => schedule.lineNumber))].sort(
            (lineNumber1: string, lineNumber2: string) =>
              parseInt(lineNumber1) - parseInt(lineNumber2)
          );
        }

        return lineNumbers;
      })
    );
  }
}
