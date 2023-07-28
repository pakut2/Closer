import { Injectable } from "@angular/core";
import { MILLISECONDS_IN_SECOND } from "@constants";
import { DateTime } from "luxon";
import { interval, map, Observable, startWith, switchMap, timer } from "rxjs";

@Injectable({ providedIn: "root" })
export class Time {
  private readonly SECONDS_IN_MINUTE = 60;
  private readonly MILLISECONDS_IN_MINUTE = this.SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;

  minuteDifference(currentDate: string, targetDate: string): number {
    const currentDateTime = DateTime.fromISO(currentDate);
    let targetDateTime = DateTime.fromISO(targetDate);

    if (currentDateTime.hour !== 0 && targetDateTime.hour === 0) {
      targetDateTime = targetDateTime.plus({ days: 1 });
    }

    const minuteDifference = targetDateTime.diff(currentDateTime, "minutes").minutes;

    return Math.floor(minuteDifference);
  }

  onMinuteStart(): Observable<boolean> {
    return timer(this.secondsRemainingToFullMinute() * MILLISECONDS_IN_SECOND).pipe(
      switchMap(() => interval(this.MILLISECONDS_IN_MINUTE).pipe(startWith(-1))),
      map(() => true)
    );
  }

  private secondsRemainingToFullMinute(): number {
    return this.SECONDS_IN_MINUTE - new Date().getSeconds();
  }
}
