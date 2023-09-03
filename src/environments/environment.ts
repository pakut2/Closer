import { Environment } from "./environment.type";

export const env: Environment = {
  isProduction: false,
  apiUrl: import.meta.env.NG_APP_API_URL
};
