import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatRipple } from "@angular/material/core";
import { MatDialog } from "@angular/material/dialog";
import { CreateDepartureReminderDialogComponent } from "@components";
import { EVENT_NAME, STOP_CARD_DRAG_DELAY } from "@constants";
import { HapticService, MessagingService } from "@core";
import { Stop } from "@types";
import { Scroll } from "@utilities";
import { ZtmAdapter } from "@ztm";
import { filter } from "rxjs";

@Component({
  selector: "app-schedule-stop-card",
  templateUrl: "./schedule-stop-card.component.html",
  styleUrls: ["./schedule-stop-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleStopCardComponent implements OnInit {
  @ViewChild(MatRipple) ripple!: MatRipple;

  @Input() stop!: Stop;
  @Output() changeSchedule = new EventEmitter<string>();
  @Output() remove = new EventEmitter<never>();

  readonly dragDelay = STOP_CARD_DRAG_DELAY;
  relatedStopOrdinalNumbers!: string[];
  removeAnimationActive = false;

  constructor(
    private readonly element: ElementRef,
    private readonly scroll: Scroll,
    private readonly messagingService: MessagingService,
    private readonly destroyRef: DestroyRef,
    private readonly hapticService: HapticService,
    private readonly ztmAdapter: ZtmAdapter,
    private readonly dialog: MatDialog
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
      .subscribe(() => this.scroll.verticalScrollToElement(this.element));
  }

  onDragStart(): void {
    this.hapticService.lightVibration();
  }

  onStopNameClick() {
    this.ztmAdapter
      .getLineNumbersForStop(this.stop)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(stopLineNumbers =>
        this.dialog.open(CreateDepartureReminderDialogComponent, {
          data: {
            stopId: this.stop.id,
            stopName: this.stop.name,
            stopLineNumbers: stopLineNumbers
          },
          autoFocus: false
        })
      );
  }

  onStopChange(ordinalNumber: string): void {
    this.changeSchedule.emit(ordinalNumber);
  }

  onRemove(transitionEvent: TransitionEvent): void {
    if ((transitionEvent.target as HTMLElement).classList?.contains("slide-right")) {
      this.remove.emit();
    }
  }
}
