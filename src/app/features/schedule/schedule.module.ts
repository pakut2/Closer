import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ZtmModule } from "@ztm";

import { StopCardComponent } from "./components/stop-card/stop-card.component";
import { ScheduleComponent } from "./schedule.component";

@NgModule({
  declarations: [ScheduleComponent, StopCardComponent],
  exports: [ScheduleComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatMenuModule,
    ZtmModule,
    MatIconModule
  ]
})
export class ScheduleModule {}
