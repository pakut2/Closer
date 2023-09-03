import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { env } from "@env";
import { init as sentryInit } from "@sentry/angular-ivy";

import { AppModule } from "./app/app.module";

if (env.isProduction) {
  sentryInit({
    dsn: env.sentryDsn,
    release: `closer@${env.version}`
  });
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  // eslint-disable-next-line no-console
  .catch(err => console.error(err));
