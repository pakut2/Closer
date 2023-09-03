import { ChangeDetectionStrategy, Component, DestroyRef, Inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SCHEDULE_PROVIDER_NAME } from "@constants";
import { NotificationService, PushNotificationError, STORAGE_KEY, StorageService } from "@core";

interface CreateReminder {
  stopId: string;
  stopName: string;
  stopLineNumbers: string[];
}

interface ReminderFormValue {
  lineNumber?: string | null;
  reminderTime?: number | null;
}

@Component({
  selector: "app-create-departure-reminder-dialog",
  templateUrl: "./create-departure-reminder-dialog.component.html",
  styleUrls: ["./create-departure-reminder-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateDepartureReminderDialogComponent {
  readonly createReminderForm = this.formBuilder.group({
    lineNumber: ["", Validators.compose([Validators.required])],
    reminderTime: [0, Validators.compose([Validators.min(1)])]
  });

  readonly reminderTimes = Array.from(Array(31).keys())
    .slice(1)
    .filter(reminderTime => reminderTime % 5 === 0);

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: CreateReminder,
    private readonly formBuilder: FormBuilder,
    private readonly storageService: StorageService<{ deviceToken: string }>,
    private readonly destroyRef: DestroyRef,
    private readonly notificationService: NotificationService
  ) {}

  createReminder(reminderData: ReminderFormValue): void {
    this.storageService
      .get(STORAGE_KEY.DEVICE_TOKEN)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(storageDeviceToken => {
        if (!storageDeviceToken || !reminderData.reminderTime || !reminderData.lineNumber) {
          throw new PushNotificationError();
        }

        return this.notificationService
          .createNotification({
            lineNumber: reminderData.lineNumber,
            reminderTime: reminderData.reminderTime,
            stopId: this.data.stopId,
            stopName: this.data.stopName,
            providerName: SCHEDULE_PROVIDER_NAME.ZTM,
            deviceToken: storageDeviceToken.deviceToken
          })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();
      });
  }
}
