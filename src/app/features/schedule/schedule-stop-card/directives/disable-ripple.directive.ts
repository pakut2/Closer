import { Directive, HostListener, Input } from "@angular/core";
import { MatRipple } from "@angular/material/core";

@Directive({
  selector: "[appDisableRipple]"
})
export class DisableRippleDirective {
  @Input("appDisableRipple") ripple?: MatRipple;

  @HostListener("window:scroll")
  onScroll(): void {
    this.ripple?.fadeOutAll();
  }

  @HostListener("touchmove")
  onTouchMove(): void {
    this.ripple?.fadeOutAll();
  }
}
