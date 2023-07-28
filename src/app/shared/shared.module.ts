import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Scroll } from "@utilities";
import { ZtmModule } from "@ztm";

import {
  FooterComponent,
  HeaderComponent,
  LabeledMenuComponent,
  SearchComponent,
  Snackbar,
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
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    ZtmModule,
    RouterLink,
    RouterLinkActive,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  providers: [Snackbar, Scroll]
})
export class SharedModule {}
