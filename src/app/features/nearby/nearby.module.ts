import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Coords } from "@types";
import { ZtmModule } from "@ztm";

import { SharedModule } from "../../shared/shared.module";
import { NearbyComponent } from "./nearby.component";
import { NearbyStopCardComponent } from "./nearby-stop-card/nearby-stop-card.component";

@NgModule({
  declarations: [NearbyComponent, NearbyStopCardComponent],
  exports: [NearbyStopCardComponent],
  imports: [CommonModule, MatProgressSpinnerModule, ZtmModule, SharedModule],
  providers: [
    {
      provide: "CURRENT_LOCATION",
      useValue: {
        lat: 54.408646681427896,
        lon: 18.603221635426358
      } satisfies Coords
    }
  ]
})
export class NearbyModule {}
