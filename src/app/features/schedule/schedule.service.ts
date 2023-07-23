import { DestroyRef, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BASE_ORDINAL_NUMBER } from "@constants";
import { StopConflictError, StopNotFoundError, STORAGE_KEY, StorageService } from "@core";
import { Stop, StopIdentifier } from "@types";
import { minuteStart$, removeDiacritics } from "@utilities";
import { ZtmAdapter } from "@ztm";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class ScheduleService {
  private readonly stopsAction = new BehaviorSubject<Stop[] | null>(null);
  readonly stops$ = this.stopsAction.asObservable();

  constructor(
    private readonly ztmAdapter: ZtmAdapter,
    private readonly storageService: StorageService<StopIdentifier[]>,
    private readonly destroyRef: DestroyRef
  ) {
    this.getStops();
    minuteStart$.pipe(takeUntilDestroyed()).subscribe(() => this.getStops());
  }

  private get stops() {
    return this.stopsAction.getValue();
  }

  private set stops(stops: Stop[] | null) {
    if (!stops?.length) {
      this.stopsAction.next([]);
      this.storageService.add(STORAGE_KEY.STOPS, []);
    }

    this.stopsAction.next(stops);
    this.storageService.add(
      STORAGE_KEY.STOPS,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      stops!.map(stop => ({
        name: stop.name,
        ordinalNumber: stop.ordinalNumber
      }))
    );
  }

  private getStops(): void {
    const stopIds = this.storageService.get(STORAGE_KEY.STOPS);

    if (stopIds?.length) {
      this.ztmAdapter
        .getStopsWithSchedules(stopIds)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(stops => (this.stops = stops));
    } else {
      this.stops = [];
    }
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
      });
  }

  changeStopSchedule(existingStop: Stop, ordinalNumber: string): void {
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

          return updatedStop;
        });
      });
  }

  removeStopByName(stopName: string): void {
    const currentStops = this.stops;

    if (!currentStops?.length) {
      return;
    }

    this.stops = currentStops.filter(stop => stop.name !== stopName);
  }
}
