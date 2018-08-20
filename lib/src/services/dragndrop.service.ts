
import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface IDropOptions {
    id: string;
    offset: { x: number, y: number },
    size: { width: number, height: number };
    start: { x: number, y: number }
}

@Injectable({
    providedIn: 'root'
})
export class DragNDropService {
    private model: any = {};
    private subject: BehaviorSubject<any> = new BehaviorSubject(null);
    private observer: Observable<any>;

    constructor() {
        this.observer = this.subject.asObservable();
    }

    public drag(el: any, options: IDropOptions, group: string = 'root') {
        this.subject.next({ el, options, group });
    }

    public release(group: string = 'root') {
        this.subject.next(null);
    }

    public listen(next: (d: any) => void): any {
        return this.observer ? this.observer.subscribe(next) : null;
    }

    public register(group: string, dropzone: any) {
        if (!this.model.group) { this.model.group = {}; }
        if (!this.model.group[group]) { this.model.group[group] = []; }
        let found = false;
        for (const i of this.model.group[group]) {
            if (i.id === dropzone.id) {
                found = true;
                break;
            }
        }
        if (!found) {
            this.model.group[group].push(dropzone);
        }
    }

    public unregister(group: string, dropzone) {
        if (!this.model.group || !this.model.group[group]) { return; }
        for (const i of this.model.group[group]) {
            if (i.id === dropzone.id) {
                this.model.group[group].splice(this.model.group[group].indexOf(i), 1);
                break;
            }
        }
    }

    public update(event) {
        const item = this.subject.getValue();
        if (item && item.el) {
            const group = this.model.group ? this.model.group[item.group] || [] : [];
            for (const i of group) {
                i.clear(event);
            }
        }
    }
}
