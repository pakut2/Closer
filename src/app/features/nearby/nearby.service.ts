import { DestroyRef, Inject, inject, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DEFAULT_SEARCH_DISTANCE } from "@constants";
import { StopNotFoundError } from "@core";
import { Coords, GeolocalizedStop } from "@types";
import { minuteStart$ } from "@utilities";
import { ZtmAdapter } from "@ztm";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class NearbyService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly stopsAction = new BehaviorSubject<GeolocalizedStop[] | null>(null);
  readonly stops$ = this.stopsAction.asObservable();

  private searchDistance = DEFAULT_SEARCH_DISTANCE;

  constructor(
    @Inject("CURRENT_LOCATION") private readonly currentLocation: Coords,
    private readonly ztmAdapter: ZtmAdapter
  ) {
    this.getGeolocalizedStops();
    minuteStart$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateStopSchedules());
  }

  private get stops() {
    return this.stopsAction.getValue();
  }

  private set stops(stops: GeolocalizedStop[] | null) {
    if (!stops?.length) {
      this.stopsAction.next([]);
    }

    this.stopsAction.next(stops);
  }

  getGeolocalizedStops(): void {
    this.ztmAdapter
      .getGeolocalizedStopsWithSchedules(this.currentLocation, this.searchDistance)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(stops => (this.stops = stops));
  }

  private updateStopSchedules(): void {
    const currentStops = this.stops ?? [];

    this.ztmAdapter
      .getStopsWithSchedules(
        currentStops.map(stop => ({ name: stop.name, ordinalNumber: stop.ordinalNumber }))
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(updatedStops => {
        this.stops = currentStops.map(stop => {
          const correspondingStop =
            updatedStops.find(updatedStop => updatedStop.name === stop.name) ?? stop;

          return {
            ...correspondingStop,
            relatedStops: stop.relatedStops,
            location: stop.location
          };
        });
      });
  }

  changeSearchDistance(searchDistance: number): void {
    if (searchDistance === this.searchDistance) {
      return;
    }

    this.searchDistance = searchDistance;
    this.getGeolocalizedStops();
  }

  changeStopSchedule(existingStop: GeolocalizedStop, ordinalNumber: string): void {
    const currentStops = this.stops ?? [];

    if (existingStop.ordinalNumber === ordinalNumber) {
      return;
    }

    if (!currentStops.some(stop => stop.name === existingStop.name)) {
      throw new StopNotFoundError(existingStop.name);
    }

    this.ztmAdapter
      .getStopWithSchedules({ name: existingStop.name, ordinalNumber })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(updatedStop => {
        this.stops = currentStops.map(stop => {
          if (stop.name !== existingStop.name) {
            return stop;
          }

          return {
            ...updatedStop,
            relatedStops: existingStop.relatedStops,
            location:
              existingStop.relatedStops.find(
                stop => stop.ordinalNumber === updatedStop.ordinalNumber
              )?.location ?? existingStop.location
          };
        });
      });
  }
}
