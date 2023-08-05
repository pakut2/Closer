import { GeolocalizedZtmStopWithRelatedStops, ZtmStopWithRelatedStops } from "./ztm-stop";

export interface ZtmStopWithSchedules extends ZtmEstimatedSchedulesResponse {
  stop: ZtmStopWithRelatedStops;
}

export interface GeolocalizedZtmStopWithSchedules extends ZtmEstimatedSchedulesResponse {
  stop: GeolocalizedZtmStopWithRelatedStops;
}

export interface ZtmEstimatedSchedulesResponse {
  lastUpdate: string;
  delay: ZtmEstimatedSchedule[];
}

export interface ZtmEstimatedSchedule {
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
