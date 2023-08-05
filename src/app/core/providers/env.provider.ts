import { InjectionToken, ValueProvider } from "@angular/core";
import { env, Environment } from "@env";

export const ENVIRONMENT = new InjectionToken<Environment>("ENVIRONMENT");

export const EnvironmentProvider: ValueProvider = {
  provide: ENVIRONMENT,
  useValue: env
};
