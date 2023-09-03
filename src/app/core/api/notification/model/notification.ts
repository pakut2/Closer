import { CreateNotification } from "./create-notification";

export interface Notification extends CreateNotification {
  id: string;
  delivered: boolean;
  createdAt: string;
}
