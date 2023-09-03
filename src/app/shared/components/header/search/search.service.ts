import { Injectable } from "@angular/core";
import { normalize } from "@utilities";
import { ZtmAdapter } from "@ztm";
import { concatMap, map, Observable, startWith } from "rxjs";

import { StopSearchForm } from "./search.component";

@Injectable()
export class SearchService {
  constructor(private readonly ztmAdapter: ZtmAdapter) {}

  getAutocompleteStopNames(form: StopSearchForm): Observable<string[]> {
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
    const normalizedStopName = normalize(inputStopName);

    return stopNames.filter(stopName => normalize(stopName).includes(normalizedStopName));
  }
}
