
import { Component, OnDestroy, OnChanges, Input, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'a-base-widget-cmp',
    template: '',
    styles: ['']
})
export class BaseWidgetComponent implements OnChanges, OnDestroy {
    @Input() public id = '';
    @Input() public name = '';
    @Input() public klass = 'default';

    protected subs: {
        timers: { [name: string]: number },
        intervals: { [name: string]: number }
        obs: { [name: string]: Subscription | (() => void) }
        promises: { [name: string]: Promise<any> }
    } = {
        timers: {},     // Store for timers
        intervals: {},  // Store for intervals
        obs: {},        // Store for observables
        promises: {}    // Store for promises
    };

    protected _cdr: ChangeDetectorRef;

    constructor() {
        this.id = `${Math.floor(Math.random() * 89_999_999 + 10_000_000)}`;
    }

    public ngOnChanges(changes: any) {
        if (changes.name) {
            this.timeout('update_class', () => {
                this.klass = this.name;
                if (this._cdr) { this._cdr.markForCheck(); }
            }, 0);
        }
    }

    public ngOnDestroy() {
            // Cleanup timers
        for (const k in this.subs.timers) {
            if (this.subs.timers.hasOwnProperty(k)) {
                this.clearTimer(k);
            }
        }
            // Cleanup intervals
        for (const k in this.subs.intervals) {
            if (this.subs.intervals.hasOwnProperty(k)) {
                this.clearInterval(k);
            }
        }
            // Cleanup observables
        for (const k in this.subs.obs) {
            if (this.subs.obs.hasOwnProperty(k) && this.subs.obs[k]) {
                if (this.subs.obs[k] instanceof Subscription) {
                    (this.subs.obs[k] as Subscription).unsubscribe();
                } else {
                    (this.subs.obs[k] as (() => void))();
                }
                this.subs.obs[k] = null;
            }
        }
    }

    public timeout(name: string, fn: () => void, delay: number = 300) {
        this.clearTimer(name);
        if (!(fn instanceof Function)) { return; }
        if (!this.subs.timers) { this.subs.timers = {}; }
        this.subs.timers[name] = <any>setTimeout(() => fn(), delay);
    }

    public clearTimer(name: string) {
        if (this.subs.timers && this.subs.timers[name]) {
            clearTimeout(this.subs.timers[name]);
            this.subs.timers[name] = null;
        }
    }

    public interval(name: string, fn: () => void, delay: number = 300) {
        this.clearInterval(name);
        if (!(fn instanceof Function)) { return; }
        this.subs.intervals[name] = <any>setInterval(() => fn(), delay);
    }

    public clearInterval(name: string) {
        if (this.subs.intervals && this.subs.intervals[name]) {
            clearInterval(this.subs.intervals[name]);
            this.subs.intervals[name] = null;
        }
    }

    public promise(name: string, body: () => void) {
        if (!this.subs.promises[name]) {
            this.subs.promises[name] = new Promise((rs, rj) => {
                body();
                rs();
            });
        }
        return this.subs.promises[name];
    }

    public clearPromise(name: string, timeout: number = 0) {
        if (this.subs.promises[name]) {
            if (timeout && timeout > 0) {
                this.timeout(`promise|${name}`, () => this.subs.promises[name] = null, timeout);
            } else {
                this.subs.promises[name] = null;
            }
        }
    }
}
