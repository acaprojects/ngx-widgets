
import { Component } from '@angular/core';

@Component({
    selector: 'context-item-showcase',
    templateUrl: './context-item-showcase.template.html',
    styleUrls: ['./context-item-showcase.styles.scss']
})
export class ContextItemShowcaseComponent {
    public model: any = {
        title: 'Context Item',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'awesome-button'`
            },
            {
                name: 'cmp', type: 'input', description: 'Angular component to render at the user interation position', data: 'Type',
                data_desc: '',
                example: `MyContextMenuComponent`
            },
            {
                name: 'template', type: 'input', description: 'Angular template to render at the user interation position', data: 'TemplateRef<any>',
                data_desc: '',
                example: `<ng-template #my_template>...</ng-template`
            },
            {
                name: 'offset', type: 'output', description: 'Screen offset where the context item will be created', data: 'object',
                data_desc: `{
    top: number;
    left: number;
    right: number;
    bottom: number;
}`,
                example: `{
    top: 480,
    left: 960;
    right: 320;
    bottom: 240;
}`
            }
        ],
        inject: '',
        map: {
            src: 'assets/australia.svg'
        }
    };

    public ngOnInit() {
        this.model.inject = `&lt;div context-item
    name="the-tooltip"
    [cmp]="model.my_component" &gt;
&lt;/div&gt;`;
    }
}
