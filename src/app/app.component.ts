import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private view: ViewContainerRef, private service: AppService) {
        this.service.Overlay.view = view;
    }
}
