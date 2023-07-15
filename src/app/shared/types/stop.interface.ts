import { Coords } from "./coords.interface";

export interface Stop {
  id: string;
  name: string;
  ordinalNumber: string;
  relatedStops: StopMetadata[];
  schedules: Schedule[];
  location: Coords;
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

export interface StopIdentifier {
  name: string;
  ordinalNumber: string;
}
