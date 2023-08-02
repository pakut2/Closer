import { Directive, HostListener } from "@angular/core";
import { EVENT_NAME } from "@constants";
import { MessagingService } from "@core";

@Directive({
  selector: "[appPullToRefresh]"
})
export class PullToRefreshDirective {
  private readonly refreshHeightThreshold = 300;
  private initialTouchHeight = 0;
  private shouldRefresh = false;

  constructor(private readonly messagingService: MessagingService) {}

  @HostListener("touchstart", ["$event"])
  onTouchStart(touchEvent: TouchEvent): void {
    const initialTouch = touchEvent.touches[0];

    if (!initialTouch) {
      return;
    }

    this.initialTouchHeight = initialTouch.clientY;
  }

  @HostListener("touchmove", ["$event"])
  onTouchMove(touchEvent: TouchEvent): void {
    const touch = touchEvent.touches[0];

    if (!touch) {
      return;
    }

    const touchHeight = touch.clientY;
    const swipeHeight = touchHeight - this.initialTouchHeight;

    this.shouldRefresh = swipeHeight > this.refreshHeightThreshold && window.scrollY === 0;
  }

  @HostListener("touchend")
  onTouchEnd(): void {
    if (this.shouldRefresh) {
      this.messagingService.sendMessage({ eventName: EVENT_NAME.REFRESH_STOPS, payload: null });

      this.shouldRefresh = false;
    }
  }
}
