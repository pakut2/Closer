import { CommonModule } from "@angular/common";
import { ErrorHandler, NgModule } from "@angular/core";

import { GlobalErrorHandler } from "./error";
import { GeolocationService } from "./geolocation.service";
import { MessagingService } from "./messaging.service";
import { StorageService } from "./storage.service";

@NgModule({
  imports: [CommonModule],
  providers: [
    MessagingService,
    StorageService,
    GeolocationService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ]
})
export class CoreModule {}
