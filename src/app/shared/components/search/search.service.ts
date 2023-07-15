import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ZtmAdapter } from "@ztm";
import * as latinize from "latinize";
import { concatMap, map, Observable, startWith } from "rxjs";

@Injectable()
export class SearchService {
  constructor(private readonly ztmAdapter: ZtmAdapter) {}

  getAutocompleteStopNames(
    form: FormGroup<{ stopName: FormControl<string | null> }>
  ): Observable<string[]> {
    return this.ztmAdapter.getUniqueStopNames().pipe(
      concatMap(stopNames =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        form.get("stopName")!.valueChanges.pipe(
          startWith(""),
          map(inputStopName => this.filterMatchingStopNames(inputStopName ?? "", stopNames))
        )
      )
    );
  }

  private filterMatchingStopNames(inputStopName: string, stopNames: string[]): string[] {
    const stopNameWithoutDiacritics = latinize(inputStopName.toLowerCase());

    return stopNames.filter(stopName =>
      latinize(stopName.toLowerCase()).includes(stopNameWithoutDiacritics)
    );
  }
}
