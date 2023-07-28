import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MILLISECONDS_IN_SECOND } from "@constants";

@Injectable({ providedIn: "root" })
export class Snackbar {
  private readonly snackbarDurationInMilliseconds = 2.5 * MILLISECONDS_IN_SECOND;

  constructor(private readonly snackbar: MatSnackBar) {}

  open(message: string, action = ""): void {
    this.snackbar.open(message, action, {
      duration: this.snackbarDurationInMilliseconds,
      panelClass: "snackbar"
    });
  }
}
