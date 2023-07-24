export const EVENT_NAME = {
  INITIAL: "INITIAL",
  ADD_STOP: "ADD_STOP",
  STOP_ADDED: "STOP_ADDED",
  CHANGE_SEARCH_DISTANCE: "CHANGE_SEARCH_DISTANCE"
} as const;

export const BASE_ORDINAL_NUMBER = "01";

export const DEFAULT_SEARCH_DISTANCE = 500;
export const SEARCH_DISTANCE = [500, 1000, 2500, 5000] as const;

export const MILLISECONDS_IN_SECOND = 1000;
