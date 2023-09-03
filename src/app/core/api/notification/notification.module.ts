import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";

import { NotificationService } from "./notification.service";

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [NotificationService]
})
export class NotificationModule {}
