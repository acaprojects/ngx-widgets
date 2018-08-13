
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { KeysPipe } from './keys.pipe';
import { SafeStylePipe } from './safe-style.pipe';
import { SafeUrlPipe } from './safe-url.pipe';
import { SafePipe } from './safe.pipe';


@NgModule({
    declarations: [
        KeysPipe,
        SafeStylePipe,
        SafeUrlPipe,
        SafePipe
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule
    ],
    exports: [
        KeysPipe,
        SafeStylePipe,
        SafeUrlPipe,
        SafePipe
    ],
    entryComponents: [

    ]
})
export class WidgetsPipeModule {

}

export const ACA_WIDGETS_PIPE_MODULE = WidgetsPipeModule;
