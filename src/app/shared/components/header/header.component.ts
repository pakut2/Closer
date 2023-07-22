import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { EVENT_NAME, SEARCH_DISTANCE } from "@constants";
import { MessagingService } from "@core";
import { filter, map, Observable } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  currentRoute$!: Observable<string>;
  allowedSearchDistance = SEARCH_DISTANCE.map(distance => `${distance} m`);

  constructor(
    private readonly router: Router,
    private readonly messagingService: MessagingService
  ) {}

  ngOnInit(): void {
    this.currentRoute$ = this.router.events.pipe(
      filter(routerEvent => routerEvent instanceof NavigationEnd),
      map(routerEvent => (routerEvent as NavigationEnd).url)
    );
  }

  changeSearchDistance(menuSearchDistance: string): void {
    this.messagingService.sendMessage({
      eventName: EVENT_NAME.CHANGE_SEARCH_DISTANCE,
      payload: { searchDistance: parseInt(menuSearchDistance) }
    });
  }
}
