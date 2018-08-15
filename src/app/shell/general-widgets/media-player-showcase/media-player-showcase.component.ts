
import { Component } from '@angular/core';

@Component({
    selector: 'media-player-showcase',
    templateUrl: './media-player-showcase.template.html',
    styleUrls: ['./media-player-showcase.styles.scss']
})
export class MediaPlayerShowcaseComponent {
    public model: any = {
        title: 'Media Player',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'awesome-media=player'`
            }, {
                name: 'src', type: 'input', description: 'Path to the media file', data: 'string',
                data_desc: ``,
                example: `'assets/video/the_fall.mp4'`
            }, {
                name: 'color', type: 'input', description: 'Color of the progress bar', data: 'string',
                data_desc: ``,
                example: `'#D50000'`
            }, {
                name: 'autoplay', type: 'input', description: 'Start the media after it has been loaded', data: 'boolean',
                data_desc: ``,
                example: `false`
            }, {
                name: 'time', type: 'output', description: 'Emits the current time of the media in the format mmm:ss', data: 'string',
                data_desc: ``,
                example: `'125:54'`
            }, {
                name: 'length', type: 'output', description: 'Length of the loaded media in the format mmm:ss', data: 'string',
                data_desc: '',
                example: `240:56`
            }
        ],
        inject: '',
        dev: true,
        state: {
            src: 'assets/bunny.webm',
            color: '#D50000'
        }
    };

    public ngOnInit() {
        this.model.inject = `&lt;media-player name=&quot;awesome-media&quot;
     [src]=&quot;media_file&quot;
     color=&quot;#D50000&quot;
     (time)=&quot;media.time = $event&quot;
     (length)=&quot;media.length = $event&quot;&gt;
&lt;/media-player&gt;`;
    }
}
