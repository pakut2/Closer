import { Component, DestroyRef, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EVENT_NAME } from "@constants";
import { MessagingService } from "@core";
import { HttpRequestStatus } from "@types";
import { filter } from "rxjs";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit {
  isLoading = false;

  constructor(
    private readonly messagingService: MessagingService,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.messagingService.currentMessage
      .pipe(
        filter(({ eventName }) => eventName === EVENT_NAME.HTTP_REQUEST_STATUS),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(message => (this.isLoading = (message as HttpRequestStatus).payload.inProgress));
  }
}
