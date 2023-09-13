import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { env } from "@env";
import { catchError, Observable, throwError } from "rxjs";

import { PushNotificationError } from "../../error";
import { CreateNotification } from "./model";

@Injectable({ providedIn: "root" })
export class NotificationService {
  private readonly notificationServiceUrl = `${env.apiUrl}/notifications`;

  constructor(private readonly httpClient: HttpClient) {}

  createNotification(createNotificationData: CreateNotification): Observable<Notification> {
    return this.httpClient
      .post<Notification>(this.notificationServiceUrl, createNotificationData, {
        headers: new HttpHeaders().append("Content-Type", "application/json")
      })
      .pipe(catchError(() => throwError(() => new PushNotificationError())));
  }
}
