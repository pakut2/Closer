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
import { MatDialog } from "@angular/material/dialog";
import { CreateDepartureReminderDialogComponent, CreateReminder } from "@components";
import { EVENT_NAME } from "@constants";
import { MessagingService } from "@core";
import { GeolocalizedStop } from "@types";
import { Scroll } from "@utilities";
import { ZtmAdapter } from "@ztm";
import { filter } from "rxjs";

@Component({
  selector: "app-nearby-stop-card",
  templateUrl: "./nearby-stop-card.component.html",
  styleUrls: ["./nearby-stop-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NearbyStopCardComponent implements OnInit {
  @Input() stop!: GeolocalizedStop;
  @Output() changeSchedule = new EventEmitter<string>();

  relatedStopOrdinalNumbers!: string[];
  removeAnimationActive = false;

  constructor(
    private readonly element: ElementRef,
    private readonly scroll: Scroll,
    private readonly messagingService: MessagingService,
    private readonly destroyRef: DestroyRef,
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

  onStopNameClick() {
    this.ztmAdapter
      .getLineNumbersForStop(this.stop)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(stopLineNumbers =>
        this.dialog.open(CreateDepartureReminderDialogComponent, {
          data: {
            stopId: this.stop.id,
            stopName: this.stop.name,
            stopOrdinalNumber: this.stop.ordinalNumber,
            stopLineNumbers: stopLineNumbers
          } satisfies CreateReminder,
          autoFocus: false
        })
      );
  }

  onStopChange(ordinalNumber: string): void {
    this.changeSchedule.emit(ordinalNumber);
  }
}
