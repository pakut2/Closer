import { ZtmStopWithRelatedStops } from "./ztm-stop.interface";

export interface ZtmStopWithSchedules extends ZtmSchedulesResponse {
  stop: ZtmStopWithRelatedStops;
}

export interface ZtmSchedulesResponse {
  lastUpdate: string;
  delay: ZtmSchedule[];
}

export interface ZtmSchedule {
  id: string;
  delayInSeconds: number;
  estimatedTime: string;
  headsign: string;
  routeId: number;
  tripId: number;
  status: ZtmScheduleType;
  theoreticalTime: string;
  timestamp: string;
  trip: number;
  vehicleCode: number;
  vehicleId: number;
}

type ZtmScheduleType = "REALTIME" | "SCHEDULED";
