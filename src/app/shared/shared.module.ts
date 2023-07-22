import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ZtmModule } from "@ztm";

import {
  FooterComponent,
  HeaderComponent,
  LabeledMenuComponent,
  SearchComponent,
  StopScheduleListComponent
} from "./components";

@NgModule({
  declarations: [
    HeaderComponent,
    SearchComponent,
    FooterComponent,
    StopScheduleListComponent,
    LabeledMenuComponent
  ],
  exports: [HeaderComponent, FooterComponent, LabeledMenuComponent, StopScheduleListComponent],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatIconModule,
    MatMenuModule,
    ReactiveFormsModule,
    ZtmModule,
    RouterLink,
    RouterLinkActive,
    MatMenuModule,
    MatProgressSpinnerModule
  ]
})
export class SharedModule {}
