import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EVENT_NAME } from "@constants";
import { MessagingService } from "@core";
import { Stop } from "@types";
import { Scroll } from "@utilities";
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
  @ViewChild("bottom") pageBottom!: ElementRef<HTMLDivElement>;

  stops$!: Observable<Stop[] | null>;

  constructor(
    readonly scheduleService: ScheduleService,
    private readonly messagingService: MessagingService,
    private readonly destroyRef: DestroyRef,
    private readonly scroll: Scroll
  ) {}

  ngOnInit(): void {
    this.stops$ = this.scheduleService.stops$;

    this.messagingService.currentMessage
      .pipe(
        filter(({ eventName }) =>
          [EVENT_NAME.ADD_STOP, EVENT_NAME.STOP_ADDED, EVENT_NAME.STOP_MODIFIED].includes(eventName)
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(message => {
        switch (message.eventName) {
          case EVENT_NAME.ADD_STOP: {
            return this.scheduleService.addStopByName(message.payload.stopName);
          }
          case EVENT_NAME.STOP_ADDED: {
            return setTimeout(() => this.scroll.scrollToElement(this.pageBottom));
          }
        }
      });
  }

  trackStops(index: number, stop: Stop): string {
    return stop.id;
  }
}
