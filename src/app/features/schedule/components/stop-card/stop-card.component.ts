import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { Stop } from "@types";

@Component({
  selector: "app-stop-card",
  templateUrl: "./stop-card.component.html",
  styleUrls: ["./stop-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StopCardComponent {
  @Input() stop!: Stop;
  @Output() update = new EventEmitter<string>();
  @Output() remove = new EventEmitter<never>();

  removeAnimationActive = false;
}
