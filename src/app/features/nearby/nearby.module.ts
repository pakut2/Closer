import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CurrentLocationProvider } from "@core";
import { SharedModule } from "@shared";
import { ZtmModule } from "@ztm";

import { NearbyComponent } from "./nearby.component";
import { NearbyStopCardComponent } from "./nearby-stop-card/nearby-stop-card.component";

@NgModule({
  declarations: [NearbyComponent, NearbyStopCardComponent],
  exports: [NearbyStopCardComponent],
  imports: [CommonModule, ZtmModule, SharedModule],
  providers: [CurrentLocationProvider]
})
export class NearbyModule {}
