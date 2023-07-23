import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { Snackbar } from "@components";
import { StopConflictError, StopNotFoundError } from "@core";

@Injectable({ providedIn: "root" })
export class GlobalErrorHandler extends ErrorHandler {
  constructor(private readonly zone: NgZone, private readonly snackbar: Snackbar) {
    super();
  }

  override handleError(error: unknown): void {
    this.zone.run(() => {
      if (error instanceof StopConflictError || error instanceof StopNotFoundError) {
        this.snackbar.open(error.message);
      } else {
        this.snackbar.open("They look like errors to you?");
      }
    });

    super.handleError(error);
  }
}
