import { ZtmBoolean } from "./ztm";

export interface ZtmStopsResponse {
  lastUpdate: string;
  stops: ZtmStop[];
}

export interface ZtmStop {
  stopId: number;
  stopCode: string;
  stopName: string;
  stopShortName: string;
  stopDesc: string;
  subName: string;
  date: string;
  zoneId: number;
  zoneName: string;
  virtual: ZtmBoolean;
  nonpassenger: ZtmBoolean;
  depot: ZtmBoolean;
  ticketZoneBorder: ZtmBoolean;
  onDemand: ZtmBoolean;
  activationDate: string;
  stopLat: number;
  stopLon: number;
}

export interface ZtmStopWithRelatedStops extends ZtmStop {
  relatedStops: ZtmStopMetadata[];
}

interface ZtmStopMetadata {
  stopId: number;
  stopCode: string;
}

export interface GeolocalizedZtmStopWithRelatedStops extends ZtmStop {
  distance: number;
  relatedStops: GeolocalizedZtmStopMetadata[];
}

export interface GeolocalizedZtmStopMetadata extends ZtmStopMetadata {
  stopLat: number;
  stopLon: number;
  distance: number;
}
