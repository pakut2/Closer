import { Component, OnInit } from "@angular/core";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { STORAGE_KEY, StorageService } from "@core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
  refreshProgress = 0;

  constructor(private readonly storageService: StorageService<{ deviceToken: string }>) {}

  ngOnInit(): void {
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          CapacitorApp.exitApp();
        }
      });

      let wasAppActive = true;

      CapacitorApp.addListener("appStateChange", ({ isActive }) => {
        if (!wasAppActive && isActive) {
          location.reload();
        }

        wasAppActive = isActive;
      });

      PushNotifications.requestPermissions().then(({ receive }) => {
        if (receive === "granted") {
          PushNotifications.register();
        }
      });

      PushNotifications.addListener("registration", token =>
        this.storageService.set(STORAGE_KEY.DEVICE_TOKEN, { deviceToken: token.value })
      );
    }
  }
}
