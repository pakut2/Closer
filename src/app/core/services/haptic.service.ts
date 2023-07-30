import { Injectable } from "@angular/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

@Injectable({ providedIn: "root" })
export class HapticService {
  async lightVibration(): Promise<void> {
    await Haptics.impact({ style: ImpactStyle.Light });
  }
}
