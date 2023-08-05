import { ChangeDetectionStrategy, Component, DestroyRef, Input } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog } from "@angular/material/dialog";
import { Schedule, Stop } from "@types";
import { ZtmAdapter } from "@ztm";

import { LineScheduleDialogComponent } from "./line-schedule-dialog/line-schedule-dialog.component";

@Component({
  selector: "app-stop-schedule-list",
  templateUrl: "./stop-schedule-list.component.html",
  styleUrls: ["./stop-schedule-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StopScheduleListComponent {
  @Input() stop!: Stop;

  constructor(
    private readonly ztmAdapter: ZtmAdapter,
    private readonly destroyRef: DestroyRef,
    private readonly dialog: MatDialog
  ) {}

  onScheduleSelect(schedule: Schedule): void {
    this.ztmAdapter
      .getLineSchedule(this.stop, schedule)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(lineSchedule =>
        this.dialog.open(LineScheduleDialogComponent, {
          data: lineSchedule
        })
      );
  }
}
