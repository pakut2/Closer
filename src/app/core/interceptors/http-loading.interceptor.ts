import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EVENT_NAME } from "@constants";
import { finalize, Observable } from "rxjs";

import { MessagingService } from "../services";

@Injectable({ providedIn: "root" })
export class HttpLoadingInterceptor implements HttpInterceptor {
  constructor(private readonly messagingService: MessagingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.messagingService.sendMessage({
      eventName: EVENT_NAME.HTTP_REQUEST_STATUS,
      payload: { inProgress: true }
    });

    return next.handle(request).pipe(
      finalize(() =>
        this.messagingService.sendMessage({
          eventName: EVENT_NAME.HTTP_REQUEST_STATUS,
          payload: { inProgress: false }
        })
      )
    );
  }
}
