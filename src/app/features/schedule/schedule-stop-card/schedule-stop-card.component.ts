import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { Stop } from "@types";

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

  ngOnInit(): void {
    this.relatedStopOrdinalNumbers = this.stop.relatedStops.map(stop => stop.ordinalNumber);
  }
}
