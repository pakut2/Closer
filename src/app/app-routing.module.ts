import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NearbyComponent, ScheduleComponent } from "@features";

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: "", component: ScheduleComponent },
      { path: "nearby", component: NearbyComponent }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
