import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Scroll, Time } from "@utilities";
import { ZtmModule } from "@ztm";

import {
  CreateDepartureReminderDialogComponent,
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
    LineScheduleDialogComponent,
    CreateDepartureReminderDialogComponent
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
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSelectModule,
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
