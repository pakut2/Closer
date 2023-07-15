import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { EVENT_NAME } from "@constants";
import { MessagingService } from "@core";
import { Observable } from "rxjs";

import { SearchService } from "./search.service";

interface FormValue {
  stopName?: string | null;
}

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
  providers: [SearchService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  @ViewChild("stopNameInput") stopNameInput!: ElementRef<HTMLInputElement>;

  readonly stopSearchForm = this.formBuilder.group({ stopName: "" } satisfies FormValue);
  autocompleteStopNames$!: Observable<string[]>;
  stopNameInputActive = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly searchService: SearchService,
    private readonly messagingService: MessagingService
  ) {}

  ngOnInit(): void {
    this.autocompleteStopNames$ = this.searchService.getAutocompleteStopNames(this.stopSearchForm);
  }

  toggleFormVisibility(): void {
    if (!this.stopNameInputActive) {
      this.stopNameInput.nativeElement.focus();
    }

    this.stopNameInputActive = !this.stopNameInputActive;
  }

  trackAutocomplete(index: number, stopName: string): string {
    return stopName;
  }

  addStopByName({ stopName }: FormValue): void {
    // TODO submit after choosing from autocomplete

    this.stopSearchForm.reset();
    this.stopNameInput.nativeElement.blur();

    if (!stopName) {
      // TODO toast
      return;
    }

    this.messagingService.sendMessage({ eventName: EVENT_NAME.ADD_STOP, payload: { stopName } });
  }
}
