import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Scroll, Time } from "@utilities";
import { ZtmModule } from "@ztm";

import {
  FooterComponent,
  HeaderComponent,
  LabeledMenuComponent,
  LineScheduleDialogComponent,
  SearchComponent,
  Snackbar,
  StopScheduleListComponent
} from "./components";
import { PullToRefreshDirective } from "./directives";

@NgModule({
  declarations: [
    HeaderComponent,
    SearchComponent,
    FooterComponent,
    StopScheduleListComponent,
    LabeledMenuComponent,
    PullToRefreshDirective,
    LineScheduleDialogComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LabeledMenuComponent,
    StopScheduleListComponent,
    PullToRefreshDirective
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatDialogModule,
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
  providers: [Snackbar, Scroll, Time]
})
export class SharedModule {}
