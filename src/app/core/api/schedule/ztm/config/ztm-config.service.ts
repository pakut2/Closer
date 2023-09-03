import { Injectable } from "@angular/core";
import { env } from "@env";
import { DateTime } from "luxon";

@Injectable({ providedIn: "root" })
export class ZtmConfigService {
  get stopsEndpointUrl(): string {
    return "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/d3e96eb6-25ad-4d6c-8651-b1eb39155945/download/stopsingdansk.json";
  }

  schedulesByStopIdEndpointUrl(stopId: string): string {
    return `https://ckan2.multimediagdansk.pl/delays?stopId=${stopId}`;
  }

  entireScheduleByLineNumberEndpointUrl(lineNumber: string): string {
    const currentDate = DateTime.now().toFormat("yyyy-MM-dd");

    return `https://ckan2.multimediagdansk.pl/stopTimes?date=${currentDate}&routeId=${lineNumber}`;
  }

  stopWithLineNumbersEndpointUrl(stopId: string): string {
    return `${env.apiUrl}/ztm/stop/${stopId}`;
  }
}
