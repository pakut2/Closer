import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";

import { GlobalErrorHandler } from "./error";
import { HttpLoadingInterceptor } from "./interceptors";
import { HapticService, MessagingService, StorageService } from "./services";

@NgModule({
  imports: [CommonModule],
  providers: [
    MessagingService,
    StorageService,
    HapticService,
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
