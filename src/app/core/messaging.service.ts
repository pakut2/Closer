import { Injectable } from "@angular/core";
import { EVENT_NAME } from "@constants";
import { Message } from "@types";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class MessagingService {
  private readonly messageSource = new BehaviorSubject<Message>({
    eventName: EVENT_NAME.INITIAL,
    payload: null
  });
  readonly currentMessage = this.messageSource.asObservable();

  sendMessage(message: Message): void {
    this.messageSource.next(message);
  }
}
