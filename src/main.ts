import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { App as CapacitorApp } from "@capacitor/app";

import { AppModule } from "./app/app.module";

CapacitorApp.addListener("backButton", ({ canGoBack }) => {
  if (!canGoBack) {
    CapacitorApp.exitApp();
  } else {
    window.history.back();
  }
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  // eslint-disable-next-line no-console
  .catch(err => console.error(err));
