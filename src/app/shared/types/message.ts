import { EVENT_NAME } from "@constants";

export type Message = InitialMessage | AddStopMessage | ChangeSearchDistanceMessage;

export interface InitialMessage {
  eventName: typeof EVENT_NAME.INITIAL;
  payload: null;
}

export interface AddStopMessage {
  eventName: typeof EVENT_NAME.ADD_STOP;
  payload: { stopName: string };
}

export interface ChangeSearchDistanceMessage {
  eventName: typeof EVENT_NAME.CHANGE_SEARCH_DISTANCE;
  payload: { searchDistance: number };
}
