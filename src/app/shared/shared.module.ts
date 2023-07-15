import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatIconModule } from "@angular/material/icon";
import { ZtmModule } from "@ztm";

import { HeaderComponent, SearchComponent } from "./components";

@NgModule({
  declarations: [HeaderComponent, SearchComponent],
  exports: [HeaderComponent],
  imports: [CommonModule, MatIconModule, MatAutocompleteModule, ReactiveFormsModule, ZtmModule]
})
export class SharedModule {}
