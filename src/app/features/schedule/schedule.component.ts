import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EVENT_NAME } from "@constants";
import { MessagingService } from "@core";
import { AddStopMessage, Stop } from "@types";
import { filter, Observable } from "rxjs";

import { ScheduleService } from "./schedule.service";

@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"],
  providers: [ScheduleService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleComponent implements OnInit {
  stops$!: Observable<Stop[] | null>;

  constructor(
    readonly scheduleService: ScheduleService,
    private readonly messagingService: MessagingService,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.stops$ = this.scheduleService.stops$;

    this.messagingService.currentMessage
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(message => message.eventName === EVENT_NAME.ADD_STOP)
      )
      .subscribe(message =>
        this.scheduleService.addStopByName((message as AddStopMessage).payload.stopName)
      );
  }

  trackStops(index: number, stop: Stop): string {
    return stop.id;
  }
}
