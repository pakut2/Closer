import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { GeolocationService } from "@core";
import { SharedModule } from "@shared";
import { ZtmModule } from "@ztm";

import { NearbyComponent } from "./nearby.component";
import { NearbyStopCardComponent } from "./nearby-stop-card/nearby-stop-card.component";

@NgModule({
  declarations: [NearbyComponent, NearbyStopCardComponent],
  exports: [NearbyStopCardComponent],
  imports: [CommonModule, ZtmModule, SharedModule],
  providers: [
    {
      provide: "CURRENT_LOCATION",
      deps: [GeolocationService],
      useFactory: (geolocationService: GeolocationService) =>
        geolocationService.getCurrentLocation()
    }
  ]
})
export class NearbyModule {}
