import { Component, DestroyRef, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EVENT_NAME } from "@constants";
import { MessagingService } from "@core";
import { ChangeSearchDistanceMessage, GeolocalizedStop } from "@types";
import { filter, Observable } from "rxjs";

import { NearbyService } from "./nearby.service";

@Component({
  selector: "app-nearby",
  templateUrl: "./nearby.component.html",
  styleUrls: ["./nearby.component.scss"],
  providers: [NearbyService]
})
export class NearbyComponent implements OnInit {
  stops$!: Observable<GeolocalizedStop[] | null>;

  constructor(
    readonly nearbyService: NearbyService,
    private readonly messagingService: MessagingService,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.stops$ = this.nearbyService.stops$;

    this.messagingService.currentMessage
      .pipe(
        filter(({ eventName }) => eventName === EVENT_NAME.CHANGE_SEARCH_DISTANCE),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(message =>
        this.nearbyService.changeSearchDistance(
          (message as ChangeSearchDistanceMessage).payload.searchDistance
        )
      );
  }
}
