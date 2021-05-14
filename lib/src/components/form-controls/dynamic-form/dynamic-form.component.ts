import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseWidgetComponent } from "../../../shared/base.component";
import { DynamicField } from "./dynamic-field.class";

@Component({
    selector: "dynamic-form",
    templateUrl: "./dynamic-form.template.html",
    styleUrls: ["./dynamic-form.styles.scss"],
})
export class DynamicFormComponent
    extends BaseWidgetComponent
    implements OnChanges, OnInit, OnDestroy
{
    @Input() public fields: DynamicField<any>[] = [];
    @Input() public validate: boolean;
    @Output() public form = new EventEmitter();
    @Output() public valid = new EventEmitter();

    public form_group: FormGroup;
    public last_submit = "";

    public ngOnInit() {
        this.form_group = this.makeFormGroup(this.fields);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.fields) {
            this.form_group = this.makeFormGroup(this.fields);
            this.form_group.valueChanges.subscribe(() => this.emitForm());
        }
        if (changes.validate) {
            this.form_group ? this.form_group.markAsTouched() : "";
            this.emitForm();
        }
    }

    public makeFormGroup(fields: DynamicField<any>[]) {
        const group: any = {};

        const handleItem = (item) => {
            let validators = [];
            if (item.required) {
                validators.push(Validators.required);
            }
            if (item.validators && item.validators.length > 0) {
                validators = [...validators, ...item.validators];
            }
            if (item.children) {
                item.children.forEach(handleItem);
            }
            group[item.key] =
                validators && validators.length > 0
                    ? new FormControl(
                          { value: item.value, disabled: item.disabled },
                          validators
                      )
                    : new FormControl({
                          value: item.value,
                          disabled: item.disabled,
                      });
            if (item.dirty) {
                (group[item.key] as FormControl).markAsDirty();
            }
        };

        if (fields && fields instanceof Array) {
            fields.forEach(handleItem);
        }
        return new FormGroup(group);
    }

    public submit() {
        this.emitForm();
        return false;
    }

    public emitForm() {
        const str = JSON.stringify(this.form_group.value);
        console.log("String:", str === this.last_submit);
        if (
            !this.form_group ||
            !this.form_group.valid ||
            this.last_submit === str
        )
            return;
        this.last_submit = str;
        this.form.emit(this.form_group.value);
        this.valid.emit(this.form_group.valid);
    }
}
