import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {
  MAT_RIPPLE_GLOBAL_OPTIONS,
  MatRippleModule,
  RippleGlobalOptions
} from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { STOP_CARD_DRAG_DELAY } from "@constants";
import { SharedModule } from "@shared";
import { ZtmModule } from "@ztm";

import { ScheduleComponent } from "./schedule.component";
import { DisableRippleDirective, DragTriggerDelayDirective } from "./schedule-stop-card/directives";
import { ScheduleStopCardComponent } from "./schedule-stop-card/schedule-stop-card.component";

@NgModule({
  declarations: [
    ScheduleComponent,
    DragTriggerDelayDirective,
    DisableRippleDirective,
    ScheduleStopCardComponent
  ],
  exports: [ScheduleComponent],
  imports: [CommonModule, DragDropModule, MatIconModule, MatRippleModule, ZtmModule, SharedModule],
  providers: [
    {
      provide: MAT_RIPPLE_GLOBAL_OPTIONS,
      useValue: {
        animation: {
          enterDuration: STOP_CARD_DRAG_DELAY,
          exitDuration: 0
        },
        terminateOnPointerUp: true
      } satisfies RippleGlobalOptions
    }
  ]
})
export class ScheduleModule {}
