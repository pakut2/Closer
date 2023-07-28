import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";

import { GlobalErrorHandler } from "./error";
import { GeolocationService } from "./geolocation.service";
import { HttpLoadingInterceptor } from "./http-loading.interceptor";
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
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoadingInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {}
