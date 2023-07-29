import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { normalize } from "@utilities";
import { ZtmAdapter } from "@ztm";
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
    const normalizedStopName = normalize(inputStopName);

    return stopNames.filter(stopName => normalize(stopName).includes(normalizedStopName));
  }
}
