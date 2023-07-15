import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { MessagingService } from "./messaging.service";
import { StorageService } from "./storage.service";

@NgModule({
  imports: [CommonModule],
  providers: [MessagingService, StorageService]
})
export class CoreModule {}
