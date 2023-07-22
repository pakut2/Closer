import { Coords } from "./coords";

export interface Stop {
  id: string;
  name: string;
  ordinalNumber: string;
  relatedStops: StopMetadata[];
  schedules: Schedule[];
}

export interface GeolocalizedStop extends Stop {
  relatedStops: GeolocalizedStopMetadata[];
  location: StopLocation;
}

export interface Schedule {
  lineNumber: string;
  destination: string;
  departsIn: string;
}

interface StopMetadata {
  id: string;
  ordinalNumber: string;
}

interface GeolocalizedStopMetadata {
  id: string;
  ordinalNumber: string;
  location: StopLocation;
}

interface StopLocation {
  coords: Coords;
  distance: number;
}

export interface StopIdentifier {
  name: string;
  ordinalNumber: string;
}
