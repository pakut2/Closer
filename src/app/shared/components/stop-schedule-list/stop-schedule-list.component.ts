import { Component, Input } from "@angular/core";
import { Schedule } from "@types";

@Component({
  selector: "app-stop-schedule-list",
  templateUrl: "./stop-schedule-list.component.html",
  styleUrls: ["./stop-schedule-list.component.scss"]
})
export class StopScheduleListComponent {
  @Input() schedules!: Schedule[];
}
