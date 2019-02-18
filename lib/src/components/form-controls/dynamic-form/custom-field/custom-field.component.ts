
import { Component, OnInit, Input, Type, SimpleChanges, OnChanges } from '@angular/core';
import { ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicField } from '../dynamic-field.class';
import { BaseWidgetComponent } from '../../../../shared/base.component';

export interface ICustomField<T> {
    field: DynamicField<T>;
    form: FormGroup;
    set: (f: DynamicField<any>, v: FormGroup) => void;
}
@Component({
    selector: 'custom-field',
    templateUrl: './custom-field.template.html',
    styleUrls: ['./custom-field.styles.scss']
})
export class CustomFieldComponent extends BaseWidgetComponent implements OnInit, OnChanges {
    @Input() public field: DynamicField<any>;
    @Input() public form: FormGroup;
    @Input() public cmp: Type<any>;

    public model: { [name: string]: any } = {};

    public onChange: (_: any) => void;
    public onTouch: (_: any) => void;
    public data: { [name: string]: any } = {};

    @ViewChild('container', { read: ViewContainerRef }) private _content: ViewContainerRef;

    constructor(private _cfr: ComponentFactoryResolver) {
        super();
    }

    public ngOnInit() { }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.cmp) {
            this.render();
        }
        if (changes.form && this.model.cmp) {
            this.model.cmp.instance.set(this.field, this.form);
        }
    }

    public render(): void {
        if (!this._cfr || !this._content) {
            return this.timeout('render', () => this.render(), 200);
        }
        if (this.cmp) {
            setTimeout(() => {
                const factory = this._cfr.resolveComponentFactory(this.cmp);
                if (factory) {
                    if (this.model.cmp) {
                        this.model.cmp.destroy();
                    }
                    this.model.cmp = this._content.createComponent(factory);

                    // Inject data into component instance
                    const inst = this.model.cmp.instance;
                    inst.set(this.field, this.form);
                    inst.parent = this;
                    this.timeout('init_cmp', () => { if (inst.init) { inst.init(); } }, 50);
                }
            }, 10);
        }
    }
}
