import { Directive, EventEmitter, HostListener, Output } from "@angular/core";
import { EVENT_NAME } from "@constants";
import { MessagingService } from "@core";

@Directive({
  selector: "[appPullToRefresh]"
})
export class PullToRefreshDirective {
  @Output() refreshProgress = new EventEmitter<number>();

  private readonly refreshGestureHeightThreshold = 100;
  private initialTouch: { height: number; wasFromPageTop: boolean } | null = null;
  private shouldRefresh = false;

  constructor(private readonly messagingService: MessagingService) {}

  @HostListener("touchstart", ["$event"])
  onTouchStart(touchEvent: TouchEvent): void {
    const initialTouch = touchEvent.touches[0];

    if (!initialTouch) {
      return;
    }

    this.initialTouch = { height: initialTouch.clientY, wasFromPageTop: this.isFullyScrolledUp() };
  }

  @HostListener("touchmove", ["$event"])
  onTouchMove(touchEvent: TouchEvent): void {
    if (!this.initialTouch || !this.initialTouch.wasFromPageTop) {
      return;
    }

    const touch = touchEvent.touches[0];

    if (!touch) {
      return;
    }

    const touchHeight = touch.clientY;
    const swipeHeight = touchHeight - this.initialTouch.height;

    const refreshProgress = this.isFullyScrolledUp()
      ? Math.min(Number((swipeHeight / this.refreshGestureHeightThreshold).toFixed(1)) * 100, 100)
      : 0;

    if (refreshProgress > 0) {
      this.togglePageScrolling(false);
    }

    this.refreshProgress.emit(refreshProgress);

    this.shouldRefresh = this.isRefreshGestureComplete(refreshProgress);
  }

  @HostListener("touchend")
  onTouchEnd(): void {
    this.refreshProgress.emit(0);
    this.togglePageScrolling(true);

    if (this.shouldRefresh) {
      this.messagingService.sendMessage({ eventName: EVENT_NAME.REFRESH_STOPS, payload: null });

      this.shouldRefresh = false;
    }
  }

  private isFullyScrolledUp(): boolean {
    return window.scrollY < 5;
  }

  private isRefreshGestureComplete(refreshProgress: number): boolean {
    return refreshProgress === 100;
  }

  private togglePageScrolling(scrollingEnabled: boolean): void {
    if (scrollingEnabled) {
      document.documentElement.style.overflow = "visible";
      document.body.style.overflow = "visible";
    } else {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
  }
}
