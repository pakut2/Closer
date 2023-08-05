import { ZtmBoolean } from "./ztm";
import { ZtmStop } from "./ztm-stop";

export interface ZtmLineSchedulesResponse {
  lastUpdate: string;
  stopTimes: ZtmLineSchedule[];
}

export interface ZtmLineSchedule {
  routeId: number;
  tripId: number;
  agencyId: number;
  topologyVersionId: number;
  arrivalTime: string;
  departureTime: string;
  stopId: number;
  stopSequence: number;
  date: string;
  variantId: number;
  noteSymbol: null;
  noteDescription: null;
  busServiceName: string;
  order: number;
  passenger: boolean;
  nonpassenger: ZtmBoolean;
  ticketZoneBorder: ZtmBoolean;
  onDemand: ZtmBoolean;
  virtual: ZtmBoolean;
  islupek: number;
  wheelchairAccessible: ZtmBoolean;
  stopShortName: string;
  stopHeadsign: string;
  pickupType: null;
  dropOffType: null;
  shapeDistTraveled: null;
  timepoint: null;
}

export interface ZtmLineScheduleWithStop {
  schedule: ZtmLineSchedule;
  stop: ZtmStop;
}
