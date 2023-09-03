import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { env } from "@env";
import { Observable } from "rxjs";

import { CreateNotification } from "./model";

@Injectable({ providedIn: "root" })
export class NotificationService {
  private readonly notificationEndpointUrl = `${env.apiUrl}/notifications`;

  constructor(private readonly httpClient: HttpClient) {}

  createNotification(createNotificationData: CreateNotification): Observable<Notification> {
    return this.httpClient.post<Notification>(
      this.notificationEndpointUrl,
      createNotificationData,
      {
        headers: new HttpHeaders().append("Content-Type", "application/json")
      }
    );
  }
}
