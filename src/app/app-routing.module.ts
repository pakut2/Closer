import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ScheduleComponent } from "@features";

@NgModule({
  imports: [RouterModule.forRoot([{ path: "", component: ScheduleComponent }])],
  exports: [RouterModule]
})
export class AppRoutingModule {}
