import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ImageCropperComponent } from 'ng2-img-cropper';

import {ACA_WIDGET_COMPONENTS, ACA_WIDGET_MODALS} from './components';
import {ACA_WIDGET_DIRECTIVES} from './directives';
import {ACA_WIDGET_PIPES} from './pipes';
import {ACA_WIDGET_PROVIDERS} from './services';

export * from './directives';
export * from './pipes';
export * from './services';
export * from './components';

@NgModule({
  declarations: [
  	...ACA_WIDGET_COMPONENTS,
    ...ACA_WIDGET_DIRECTIVES,
    ...ACA_WIDGET_PIPES,
    ImageCropperComponent
  ],
  imports: [ CommonModule, FormsModule ],
  exports: [ 
  	...ACA_WIDGET_COMPONENTS,
    ...ACA_WIDGET_DIRECTIVES,
    ...ACA_WIDGET_PIPES
  ],
  providers: [
  	...ACA_WIDGET_PROVIDERS
  ]
})
export class ACA_WIDGET_MODULE {

}
