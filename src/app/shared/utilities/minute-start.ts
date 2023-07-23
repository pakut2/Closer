import { MILLISECONDS_IN_SECOND } from "@constants";
import { interval, map, startWith, switchMap, timer } from "rxjs";

const SECONDS_IN_MINUTE = 60;
const MILLISECONDS_IN_MINUTE = SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;

const secondsRemainingToFullMinute = (): number => SECONDS_IN_MINUTE - new Date().getSeconds();

export const minuteStart$ = timer(secondsRemainingToFullMinute() * MILLISECONDS_IN_SECOND).pipe(
  switchMap(() => interval(MILLISECONDS_IN_MINUTE).pipe(startWith(-1))),
  map(() => true)
);
