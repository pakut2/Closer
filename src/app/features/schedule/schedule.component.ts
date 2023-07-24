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
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.stops$ = this.scheduleService.stops$;

    this.messagingService.currentMessage
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(
          ({ eventName }) =>
            eventName === EVENT_NAME.ADD_STOP || eventName === EVENT_NAME.STOP_ADDED
        )
      )
      .subscribe(message => {
        switch (message.eventName) {
          case EVENT_NAME.ADD_STOP: {
            return this.scheduleService.addStopByName(message.payload.stopName);
          }
          case EVENT_NAME.STOP_ADDED: {
            return this.scrollToBottom();
          }
        }
      });
  }

  trackStops(index: number, stop: Stop): string {
    return stop.id;
  }

  scrollToBottom(): void {
    setTimeout(() =>
      this.pageBottom.nativeElement.scrollIntoView({
        behavior: "smooth"
      })
    );
  }
}
