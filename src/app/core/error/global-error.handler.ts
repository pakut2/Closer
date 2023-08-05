import { Inject, Injectable, NgZone } from "@angular/core";
import { Snackbar } from "@components";
import { ENVIRONMENT, StopConflictError, StopNotFoundError } from "@core";
import { Environment } from "@env";
import { SentryErrorHandler } from "@sentry/angular-ivy";
import { init as sentryInit } from "@sentry/angular-ivy";

@Injectable({ providedIn: "root" })
export class GlobalErrorHandler extends SentryErrorHandler {
  constructor(
    @Inject(ENVIRONMENT) private readonly env: Environment,
    private readonly zone: NgZone,
    private readonly snackbar: Snackbar
  ) {
    if (env.isProduction) {
      sentryInit({
        dsn: env.sentryDsn,
        release: `closer@${env.version}`
      });
    }

    super();
  }

  override handleError(error: unknown): void {
    const isSelfThrownError = this.isSelfThrownError(error);

    this.zone.run(() => {
      if (isSelfThrownError) {
        this.snackbar.open(error.message);
      } else {
        this.snackbar.open("They look like errors to you?");
      }
    });

    if (!isSelfThrownError) {
      super.handleError(error);
    }
  }

  private isSelfThrownError(error: unknown): error is StopConflictError | StopNotFoundError {
    return error instanceof StopConflictError || error instanceof StopNotFoundError;
  }
}
