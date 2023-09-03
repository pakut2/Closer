interface ImportMeta {
  readonly env: EnvVariables;
}

interface EnvVariables {
  NG_APP_VERSION: string;
  NG_APP_SENTRY_DSN: string;
  NG_APP_API_URL: string;

  [key: string]: string | undefined;
}
