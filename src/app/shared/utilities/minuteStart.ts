import { interval, map, startWith, switchMap, timer } from "rxjs";

const SECONDS_IN_MINUTE = 60;
const SECOND_IN_MILLISECONDS = 1000;
const MINUTE_IN_MILLISECONDS = SECONDS_IN_MINUTE * SECOND_IN_MILLISECONDS;

const secondsRemainingToFullMinute = (): number => SECONDS_IN_MINUTE - new Date().getSeconds();

export const minuteStart$ = timer(secondsRemainingToFullMinute() * SECOND_IN_MILLISECONDS).pipe(
  switchMap(() => interval(MINUTE_IN_MILLISECONDS).pipe(startWith(-1))),
  map(() => true)
);
