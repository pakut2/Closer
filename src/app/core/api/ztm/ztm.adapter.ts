import { Injectable } from "@angular/core";
import { Stop, StopIdentifier } from "@types";
import { minuteDifference } from "@utilities";
import { DateTime } from "luxon";
import { map, Observable } from "rxjs";

import { NIGHT_LINE_INDICATOR, NIGHT_LINE_PREFIX, ZtmStopWithSchedules } from "./domain";
import { ZtmService } from "./ztm.service";

@Injectable({ providedIn: "root" })
export class ZtmAdapter {
  constructor(private readonly ztmService: ZtmService) {}

  getUniqueStopNames(): Observable<string[]> {
    return this.ztmService
      .getStops()
      .pipe(map(ztmStops => [...new Set(ztmStops.stops.map(stop => stop.stopName))].sort()));
  }

  getStopsWithSchedules(stopIds: StopIdentifier[]): Observable<Stop[]> {
    return this.ztmService
      .getStopsWithSchedules(stopIds)
      .pipe(map(ztmSchedules => ztmSchedules.map(ztmSchedule => this.prepareStop(ztmSchedule))));
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
      })),
      location: { lat: stop.stopLat, lon: stop.stopLon }
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
}
