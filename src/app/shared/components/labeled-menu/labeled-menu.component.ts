import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef
} from "@angular/core";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "app-labeled-menu",
  templateUrl: "./labeled-menu.component.html",
  styleUrls: ["./labeled-menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabeledMenuComponent {
  @Input() label!: string;
  @Input() icon!: TemplateRef<MatIcon>;
  @Input() menuItems!: string[];
  @Output() selected = new EventEmitter<string>();
}
