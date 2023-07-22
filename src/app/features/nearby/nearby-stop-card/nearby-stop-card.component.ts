import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { GeolocalizedStop } from "@types";

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

  ngOnInit(): void {
    this.relatedStopOrdinalNumbers = this.stop.relatedStops.map(stop => stop.ordinalNumber);
  }
}
