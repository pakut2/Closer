import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ZtmModule } from "@ztm";

import { SharedModule } from "../../shared/shared.module";
import { ScheduleComponent } from "./schedule.component";
import { ScheduleStopCardComponent } from "./schedule-stop-card/schedule-stop-card.component";

@NgModule({
  declarations: [ScheduleComponent, ScheduleStopCardComponent],
  exports: [ScheduleComponent],
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule, ZtmModule, SharedModule]
})
export class ScheduleModule {}
