
import { Component } from '@angular/core';

@Component({
    selector: 'drop-target-showcase',
    templateUrl: './drop-target-showcase.template.html',
    styleUrls: ['./drop-target-showcase.styles.scss']
})
export class DropTargetShowcaseComponent {
    public model: any = {
        title: 'Drop Target',
        bindings: [
            {
                name: 'stream', type: 'input', description: 'Name of file stream to pass the dropped file to', data: 'string',
                data_desc: '',
                example: `'image-files'`
            }, {
                name: 'indicate', type: 'input', description: 'CSS class to add to the host element when a file is dragged over the element', data: 'string',
                data_desc: ``,
                example: `'hover'`
            }
        ],
        inject: '',
        map: {
            src: 'assets/australia.svg'
        }
    };

    public ngOnInit() {
        this.model.inject = `&lt;div drop-target stream="image-stream" indicate="hover" &gt;
&lt;/div&gt;`;
    }
}
