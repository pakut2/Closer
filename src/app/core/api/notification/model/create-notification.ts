import { SCHEDULE_PROVIDER_NAME } from "@constants";

export interface CreateNotification {
  deviceToken: string;
  reminderTime: number;
  providerName: (typeof SCHEDULE_PROVIDER_NAME)[keyof typeof SCHEDULE_PROVIDER_NAME];
  stopId: string;
  stopName: string;
  lineNumber: string;
}
