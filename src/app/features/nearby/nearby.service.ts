import { DestroyRef, Inject, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DEFAULT_SEARCH_DISTANCE, EVENT_NAME } from "@constants";
import {
  CURRENT_LOCATION,
  MessagingService,
  StopNotFoundError,
  STORAGE_KEY,
  StorageService
} from "@core";
import { Coords, GeolocalizedStop } from "@types";
import { Time } from "@utilities";
import { ZtmAdapter } from "@ztm";
import { BehaviorSubject, filter, map, Observable, switchMap, zipWith } from "rxjs";

@Injectable()
export class NearbyService {
  private readonly stops$ = new BehaviorSubject<GeolocalizedStop[]>([]);

  private searchDistance?: number;

  constructor(
    @Inject(CURRENT_LOCATION) private readonly currentLocation: Observable<Coords>,
    private readonly ztmAdapter: ZtmAdapter,
    private readonly time: Time,
    private readonly messagingService: MessagingService,
    private readonly destroyRef: DestroyRef,
    private readonly storageService: StorageService<{ distance: number }>
  ) {
    this.init();
  }

  private get stops() {
    return this.stops$.getValue();
  }

  private set stops(stops: GeolocalizedStop[]) {
    this.stops$.next(stops);
  }

  private init(): void {
    this.initGeolocalizedStops();

    this.time
      .onMinuteStart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateStopSchedules());

    this.messagingService.currentMessage
      .pipe(
        filter(({ eventName }) => eventName === EVENT_NAME.REFRESH_STOPS),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.initGeolocalizedStops());
  }

  private initGeolocalizedStops(): void {
    const currentSearchDistance = this.searchDistance;

    if (currentSearchDistance) {
      this.currentLocation
        .pipe(
          switchMap(currentLocation =>
            this.ztmAdapter.getGeolocalizedStopsWithSchedules(
              currentLocation,
              currentSearchDistance
            )
          ),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(stops => (this.stops = stops));

      return;
    }

    this.storageService
      .get(STORAGE_KEY.SEARCH_DISTANCE)
      .pipe(
        map(storageSearchDistance => {
          this.searchDistance = storageSearchDistance?.distance ?? DEFAULT_SEARCH_DISTANCE;

          return this.searchDistance;
        }),
        zipWith(this.currentLocation),
        switchMap(([currentSearchDistance, currentLocation]) =>
          this.ztmAdapter.getGeolocalizedStopsWithSchedules(currentLocation, currentSearchDistance)
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(stops => (this.stops = stops));
  }

  private updateStopSchedules(): void {
    const currentStops = this.stops;

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

  getGeolocalizedStops(): Observable<GeolocalizedStop[]> {
    return this.stops$;
  }

  changeSearchDistance(newSearchDistance: number): void {
    if (newSearchDistance === this.searchDistance) {
      return;
    }

    this.searchDistance = newSearchDistance;
    this.storageService.set(STORAGE_KEY.SEARCH_DISTANCE, { distance: newSearchDistance });

    this.initGeolocalizedStops();
  }

  changeStopSchedule(ordinalNumber: string, existingStop: GeolocalizedStop): void {
    const currentStops = this.stops;

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

        setTimeout(() =>
          this.messagingService.sendMessage({
            eventName: EVENT_NAME.STOP_MODIFIED,
            payload: { stopName: existingStop.name }
          })
        );
      });
  }
}
