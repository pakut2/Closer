import { ElementRef, Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class Scroll {
  scrollToElement<T extends HTMLElement>(element: ElementRef<T>): void {
    if (this.isElementInViewport(element)) {
      return;
    }

    element.nativeElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  private isElementInViewport<T extends HTMLElement>(element: ElementRef<T>): boolean {
    const elementDimensions = element.nativeElement.getBoundingClientRect();

    return (
      elementDimensions.top >= 0 &&
      elementDimensions.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }
}
