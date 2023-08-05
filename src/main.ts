import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { App as CapacitorApp } from "@capacitor/app";
import { env } from "@env";
import { init as sentryInit } from "@sentry/angular-ivy";

import { AppModule } from "./app/app.module";

if (env.isProduction) {
  sentryInit({
    dsn: env.sentryDsn,
    release: `closer@${env.version}`
  });
}

CapacitorApp.addListener("backButton", ({ canGoBack }) => {
  if (canGoBack) {
    window.history.back();
  } else {
    CapacitorApp.exitApp();
  }
});

let wasAppActive = true;

CapacitorApp.addListener("appStateChange", ({ isActive }) => {
  if (!wasAppActive && isActive) {
    location.reload();
  }

  wasAppActive = isActive;
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  // eslint-disable-next-line no-console
  .catch(err => console.error(err));
