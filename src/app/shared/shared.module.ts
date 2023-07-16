import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ZtmModule } from "@ztm";

import { FooterComponent, HeaderComponent, SearchComponent } from "./components";

@NgModule({
  declarations: [HeaderComponent, SearchComponent, FooterComponent],
  exports: [HeaderComponent, FooterComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    ZtmModule,
    RouterLink,
    RouterLinkActive
  ]
})
export class SharedModule {}
