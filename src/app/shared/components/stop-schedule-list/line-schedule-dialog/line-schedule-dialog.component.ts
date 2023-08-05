import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EntireLineSchedule } from "@types";

@Component({
  selector: "app-line-schedule-dialog",
  templateUrl: "./line-schedule-dialog.component.html",
  styleUrls: ["./line-schedule-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineScheduleDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public readonly data: EntireLineSchedule) {}
}
