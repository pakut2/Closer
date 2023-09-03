import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { EVENT_NAME } from "@constants";
import { MessagingService, StopNotFoundError } from "@core";
import { Observable } from "rxjs";

import { SearchService } from "./search.service";

export type StopSearchForm = FormGroup<{
  stopName?: FormControl<string | null | undefined>;
}>;

interface StopSearchFormValue {
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
  @ViewChild(MatAutocompleteTrigger) autocomplete!: MatAutocompleteTrigger;

  readonly stopSearchForm: StopSearchForm = this.formBuilder.group<StopSearchFormValue>({
    stopName: ""
  });
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

  addStopByName({ stopName }: StopSearchFormValue): void {
    this.autocomplete.closePanel();
    this.stopSearchForm.reset();
    setTimeout(() => this.stopNameInput.nativeElement.blur());

    if (!stopName) {
      throw new StopNotFoundError();
    }

    this.messagingService.sendMessage({ eventName: EVENT_NAME.ADD_STOP, payload: { stopName } });
  }
}
