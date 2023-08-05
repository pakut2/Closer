import { Injectable, NgZone } from "@angular/core";
import { Snackbar } from "@components";
import { ScheduleNotFoundError, StopConflictError, StopNotFoundError } from "@core";
import { SentryErrorHandler } from "@sentry/angular-ivy";

@Injectable({ providedIn: "root" })
export class GlobalErrorHandler extends SentryErrorHandler {
  constructor(private readonly zone: NgZone, private readonly snackbar: Snackbar) {
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

  private isSelfThrownError(
    error: unknown
  ): error is ScheduleNotFoundError | StopConflictError | StopNotFoundError {
    return (
      error instanceof ScheduleNotFoundError ||
      error instanceof StopConflictError ||
      error instanceof StopNotFoundError
    );
  }
}
