import { moveItemInArray } from "@angular/cdk/drag-drop";
import { DestroyRef, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BASE_ORDINAL_NUMBER, EVENT_NAME } from "@constants";
import {
  MessagingService,
  StopConflictError,
  StopNotFoundError,
  STORAGE_KEY,
  StorageService
} from "@core";
import { Stop, StopNaturalKey } from "@types";
import { normalize, Time } from "@utilities";
import { ZtmAdapter } from "@ztm";
import { BehaviorSubject, filter, Observable, of, switchMap } from "rxjs";

@Injectable()
export class ScheduleService {
  private readonly stops$ = new BehaviorSubject<Stop[]>([]);

  constructor(
    private readonly ztmAdapter: ZtmAdapter,
    private readonly storageService: StorageService<StopNaturalKey[]>,
    private readonly time: Time,
    private readonly messagingService: MessagingService,
    private readonly destroyRef: DestroyRef
  ) {
    this.init();
  }

  private get stops() {
    return this.stops$.getValue();
  }

  private set stops(stops: Stop[]) {
    this.stops$.next(stops);

    this.storageService.set(
      STORAGE_KEY.STOPS,
      stops.map(stop => ({
        name: stop.name,
        ordinalNumber: stop.ordinalNumber
      }))
    );
  }

  private init(): void {
    this.initStops();

    this.time
      .onMinuteStart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.initStops());

    this.messagingService.currentMessage
      .pipe(
        filter(({ eventName }) => eventName === EVENT_NAME.REFRESH_STOPS),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.initStops());
  }

  private initStops(): void {
    this.storageService
      .get(STORAGE_KEY.STOPS)
      .pipe(
        switchMap(stopIds =>
          stopIds?.length ? this.ztmAdapter.getStopsWithSchedules(stopIds) : of([])
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(stops => (this.stops = stops));
  }

  getStops(): Observable<Stop[]> {
    return this.stops$;
  }

  addStopByName(stopName: string): void {
    const currentStops = this.stops;

    const normalizedStopName = normalize(stopName);

    if (currentStops.some(stop => normalize(stop.name) === normalizedStopName)) {
      throw new StopConflictError(stopName);
    }

    this.ztmAdapter
      .getStopWithSchedules({ name: stopName, ordinalNumber: BASE_ORDINAL_NUMBER })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(newStop => {
        this.stops = [...currentStops, newStop];

        this.messagingService.sendMessage({ eventName: EVENT_NAME.STOP_ADDED, payload: null });
      });
  }

  changeStopSchedule(newOrdinalNumber: string, existingStop: Stop): void {
    const currentStops = this.stops;

    if (existingStop.ordinalNumber === newOrdinalNumber) {
      return;
    }

    if (!currentStops.some(stop => stop.name === existingStop.name)) {
      throw new StopNotFoundError(existingStop.name);
    }

    this.ztmAdapter
      .getStopWithSchedules({ name: existingStop.name, ordinalNumber: newOrdinalNumber })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(updatedStop => {
        this.stops = currentStops.map(stop => {
          if (stop.name !== existingStop.name) {
            return stop;
          }

          return updatedStop;
        });

        setTimeout(() =>
          this.messagingService.sendMessage({
            eventName: EVENT_NAME.STOP_MODIFIED,
            payload: { stopName: existingStop.name }
          })
        );
      });
  }

  removeStopByName(stopName: string): void {
    const currentStops = this.stops;

    if (!currentStops.length) {
      return;
    }

    this.stops = currentStops.filter(stop => stop.name !== stopName);
  }

  reorderStops(previousIndex: number, currentIndex: number): void {
    if (previousIndex === currentIndex) {
      return;
    }

    const currentStops = this.stops;
    const movedStop = currentStops[previousIndex];

    moveItemInArray(currentStops, previousIndex, currentIndex);

    this.stops = currentStops;

    setTimeout(() =>
      this.messagingService.sendMessage({
        eventName: EVENT_NAME.STOP_MODIFIED,
        payload: { stopName: movedStop.name }
      })
    );
  }
}
