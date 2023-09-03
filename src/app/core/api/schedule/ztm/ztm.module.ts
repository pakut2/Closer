import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";

import { ZtmConfigService } from "./config";
import { ZtmAdapter } from "./ztm.adapter";
import { ZtmService } from "./ztm.service";

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [ZtmConfigService, ZtmService, ZtmAdapter]
})
export class ZtmModule {}
