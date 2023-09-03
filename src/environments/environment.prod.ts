import { Environment } from "./environment.type";

export const env: Environment = {
  isProduction: true,
  version: import.meta.env.NG_APP_VERSION,
  sentryDsn: import.meta.env.NG_APP_SENTRY_DSN,
  apiUrl: import.meta.env.NG_APP_API_URL
};
