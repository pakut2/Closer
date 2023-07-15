import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CoreModule } from "@core";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ScheduleModule } from "./features/schedule/schedule.module";
import { SharedModule } from "./shared/shared.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    ScheduleModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
