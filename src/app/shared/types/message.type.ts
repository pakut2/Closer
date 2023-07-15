import { EVENT_NAME } from "@constants";

export type Message = InitialMessage | AddStopMessage;

export interface InitialMessage {
  eventName: typeof EVENT_NAME.INITIAL;
  payload: null;
}

export interface AddStopMessage {
  eventName: typeof EVENT_NAME.ADD_STOP;
  payload: { stopName: string };
}
