import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { App as CapacitorApp } from "@capacitor/app";

import { AppModule } from "./app/app.module";

CapacitorApp.addListener("backButton", ({ canGoBack }) => {
  if (canGoBack) {
    window.history.back();
  } else {
    CapacitorApp.exitApp();
  }
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  // eslint-disable-next-line no-console
  .catch(err => console.error(err));
