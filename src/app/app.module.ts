import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ComposerModule } from '../../lib/src/composer.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ComposerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
