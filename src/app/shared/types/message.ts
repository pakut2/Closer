import { EVENT_NAME } from "@constants";

export type Message =
  | InitialMessage
  | HttpRequestStatus
  | AddStopMessage
  | StopAddedMessage
  | StopModifiedMessage
  | ChangeSearchDistanceMessage;

export interface InitialMessage {
  eventName: typeof EVENT_NAME.INITIAL;
  payload: null;
}

export interface HttpRequestStatus {
  eventName: typeof EVENT_NAME.HTTP_REQUEST_STATUS;
  payload: { inProgress: boolean };
}

export interface AddStopMessage {
  eventName: typeof EVENT_NAME.ADD_STOP;
  payload: { stopName: string };
}

export interface StopAddedMessage {
  eventName: typeof EVENT_NAME.STOP_ADDED;
  payload: null;
}

export interface StopModifiedMessage {
  eventName: typeof EVENT_NAME.STOP_MODIFIED;
  payload: { stopName: string };
}

export interface ChangeSearchDistanceMessage {
  eventName: typeof EVENT_NAME.CHANGE_SEARCH_DISTANCE;
  payload: { searchDistance: number };
}
