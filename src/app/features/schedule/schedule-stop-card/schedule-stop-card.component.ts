import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EVENT_NAME } from "@constants";
import { MessagingService } from "@core";
import { Stop } from "@types";
import { Scroll } from "@utilities";
import { filter } from "rxjs";

@Component({
  selector: "app-schedule-stop-card",
  templateUrl: "./schedule-stop-card.component.html",
  styleUrls: ["./schedule-stop-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleStopCardComponent implements OnInit {
  @Input() stop!: Stop;
  @Output() changeSchedule = new EventEmitter<string>();
  @Output() remove = new EventEmitter<never>();

  relatedStopOrdinalNumbers!: string[];
  removeAnimationActive = false;

  constructor(
    private readonly element: ElementRef,
    private readonly scroll: Scroll,
    private readonly messagingService: MessagingService,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.relatedStopOrdinalNumbers = this.stop.relatedStops.map(stop => stop.ordinalNumber);

    this.messagingService.currentMessage
      .pipe(
        filter(
          message =>
            message.eventName === EVENT_NAME.STOP_MODIFIED &&
            message.payload.stopName === this.stop.name
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.scroll.scrollToElement(this.element));
  }
}
