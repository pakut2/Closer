import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { SharedModule } from "@shared";
import { ZtmModule } from "@ztm";

import { ScheduleComponent } from "./schedule.component";
import { ScheduleStopCardComponent } from "./schedule-stop-card/schedule-stop-card.component";

@NgModule({
  declarations: [ScheduleComponent, ScheduleStopCardComponent],
  exports: [ScheduleComponent],
  imports: [CommonModule, DragDropModule, MatIconModule, ZtmModule, SharedModule]
})
export class ScheduleModule {}
