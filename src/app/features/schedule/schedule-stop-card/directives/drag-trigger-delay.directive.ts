import { DestroyRef, Directive, ElementRef, HostListener, Input } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Subscription, timer } from "rxjs";

@Directive({
  selector: "[appDragTriggerDelay]"
})
export class DragTriggerDelayDirective {
  @Input("appDragTriggerDelay") dragDelay!: number;

  private dragTimer?: Subscription;

  constructor(private readonly element: ElementRef, private readonly destroyRef: DestroyRef) {}

  @HostListener("touchstart")
  onTouchStart(): void {
    this.startDragTimer();
  }

  @HostListener("touchend")
  onTouchEnd(): void {
    this.stopDragTimer();
  }

  @HostListener("drag")
  onDrag(): void {
    this.stopDragTimer();
  }

  private startDragTimer(): void {
    this.dragTimer = timer(this.dragDelay)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const touchEvent = new TouchEvent("touchmove", {
          bubbles: true,
          cancelable: true,
          view: window
        });

        this.element.nativeElement.dispatchEvent(touchEvent);
      });
  }

  private stopDragTimer(): void {
    this.dragTimer?.unsubscribe();
  }
}
