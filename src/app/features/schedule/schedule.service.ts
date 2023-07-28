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
import { removeDiacritics, Time } from "@utilities";
import { ZtmAdapter } from "@ztm";
import { BehaviorSubject, Observable, of, switchMap } from "rxjs";

@Injectable()
export class ScheduleService {
  private readonly stopsAction = new BehaviorSubject<Stop[]>([]);
  private readonly stops$ = this.stopsAction.asObservable();

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
    return this.stopsAction.getValue();
  }

  private set stops(stops: Stop[]) {
    if (!stops.length) {
      this.stopsAction.next([]);
      this.storageService.set(STORAGE_KEY.STOPS, []);
    }

    this.stopsAction.next(stops);
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
      .pipe(takeUntilDestroyed())
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
    const currentStops = this.stops ?? [];

    const stopNameWithoutDiacritics = removeDiacritics(stopName);

    if (currentStops.some(stop => removeDiacritics(stop.name) === stopNameWithoutDiacritics)) {
      throw new StopConflictError(stopName);
    }

    this.ztmAdapter
      .getStopWithSchedules({ name: stopName, ordinalNumber: BASE_ORDINAL_NUMBER })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(newStop => {
        if (currentStops.length) {
          this.stops = [...currentStops, newStop];
        } else {
          this.stops = [newStop];
        }

        this.messagingService.sendMessage({ eventName: EVENT_NAME.STOP_ADDED, payload: null });
      });
  }

  changeStopSchedule(existingStop: Stop, ordinalNumber: string): void {
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
}
