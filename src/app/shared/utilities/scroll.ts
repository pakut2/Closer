import { ElementRef, Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class Scroll {
  private readonly headerOffset =
    document.getElementsByTagName("header")[0].offsetHeight +
    parseFloat(getComputedStyle(document.documentElement).fontSize);
  private readonly footerOffset = document.getElementsByTagName("footer")[0].offsetTop;

  verticalScrollToElement<T extends HTMLElement>(element: ElementRef<T>): void {
    if (this.isElementInVerticalViewport(element)) {
      return;
    }

    window.scroll({
      top: element.nativeElement.offsetTop - this.headerOffset,
      left: 0,
      behavior: "smooth"
    });
  }

  private isElementInVerticalViewport<T extends HTMLElement>(element: ElementRef<T>): boolean {
    const elementDimensions = element.nativeElement.getBoundingClientRect();

    return (
      elementDimensions.top >= this.headerOffset && elementDimensions.bottom <= this.footerOffset
    );
  }
}
