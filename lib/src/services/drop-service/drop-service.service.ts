/**
 * @Author: Stephen von Takack
 * @Date:   13/09/2016 2:55 PM
 * @Email:  steve@acaprojects.com
 * @Filename: drop-files.spec.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 15/12/2016 11:37 AM
 */

// Require what we need from rxjs
import { Injectable, Renderer } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DropFiles } from './drop-files';

@Injectable()
export class DropService {
    // These track the relationship between elements, callbacks and file streams
    private static _streams       = {}; // stream name => Subject
    private static _observers     = {}; // stream name => observer
    private static _streamMapping = {}; // stream name => element array
    private static _callbacks     = {}; // stream name => callback array

    public event: any = {};

    // All the elements we are interested in highlighting when the mouse is over them
    private _dropTargets:  HTMLScriptElement[] = [];
    private _currentTarget: HTMLScriptElement;

    // This is our event observables
    private _event_subjects: any = { dragover: null };
    private _event: any = { dragover: null };
    private _listeners: any = {};

    // Tracks the number of dragenter events by tracking
    // the target elements (works around a firefox issue)
    private _counter = new Set();

    constructor(/*private renderer: Renderer*/) {
        let overFired: any;
        const event_types = ['drop', 'dragover', 'dragenter', 'dragleave'];
        for (const e of event_types) {
            this._event[e] = {};
            this._event[e].subject = new Subject();
            this._event[e].observer = this._event.drop.subject.asObservable();
        }
        // Define the event streams
        this.event.drop = (event: Event) => {
            const e = this._preventDefault(event);
            if (this._checkTarget(e)) {
                this._event.drop.subject.next(e);
            }
        };
        // Prevent default on all dragover events
        this.event.dragover = (event: Event) => {
            event.preventDefault();
            this._event.dragover.subject.next(event);
        };
        this.event.dragenter = (event: Event) => {
            const e = this._preventDefault(event);
            if (this._checkTarget(e)) {
                this._event.dragenter.subject.next(e);
            }
        };
        this.event.dragleave = (event: Event) => {
            const e = this._preventDefault(event);
            this._checkTarget(e);
            const dropTargets = this._dropTargets;
            const target = e.target;

            this._counter.delete(target);

            // Exit early if the current counter is 0
            // This means we've left the body
            if (this._counter.size <= 0) {
                this._counter = new Set();

                if (this._currentTarget) {
                    this._performCallback(this._currentTarget, false);
                    this._currentTarget = null;
                }
            } else {
                for (const drop_target of dropTargets) {
                    if (drop_target === target) {
                        return this._event.dragleave.subject.next(event);
                    }
                }
            }
        };

        // Start watching for the events
        this._event.dragover.observer.subscribe();
        this._event.dragenter.observer.subscribe((obj: any) => {
            overFired = obj.target;
            this._updateClasses(obj);
        });
        this._event.dragleave.observer.subscribe((obj: any) => {
            if (!overFired) {
                this._removeClass(obj);
            }
            overFired = null;
        });
        this._event.drop.observer.subscribe((obj: any) => {
            const stream = this._removeClass(obj);
            // Stream the files
            if (stream) {
                stream.next({
                    event: 'drop',
                    data: new DropFiles(obj.originalEvent),
                });
            }
        });
    }

    public ngOnDestroy() {
        // Remove Observers
        for (const e in this._event) {
            if (this._event[e].subject) {
                this._event[e].subject.complete();
            }
        }
        // Remove listeners
        for (const l in this._listeners) {
            if (this._listeners[l]) {
                this._listeners[l]();
                this._listeners[l] = null;
            }
        }
    }

    // Configures an element to become a drop target
    public register(name: string, element: HTMLScriptElement, callback: (state: boolean) => void) {
        // Register the drop-target
        this._ensureStream(name);
        DropService._streamMapping[name].push(element);
        DropService._callbacks[name].push(callback);
        this._dropTargets.push(element);

        // Return the unregister/cleanup callback
        return () => {
            let index: number = this._dropTargets.indexOf(element);
            if (index !== -1) {
                this._dropTargets.splice(index, 1);

                // If it is in the drop targets then it will be here
                index = DropService._streamMapping[name].indexOf(element);
                DropService._streamMapping[name].splice(index, 1);
                DropService._callbacks[name].splice(index, 1);
            }
        };
    }

    public pushFiles(stream: string, files: any) {
        const observer = DropService._observers[stream];
        if (observer) {
            observer.next({
                event: 'drop',
                data: new DropFiles({
                    dataTransfer: {
                        files,
                    },
                }),
            });
        }
    }

    // Hooks up a function to recieve a the files from a particular stream
    // 3 events: 'over', 'left', 'drop'
    public getStream(name: string) {
        this._ensureStream(name);
        return DropService._streams[name];
    }

    // Initialises a new file stream if it did not exist
    private _ensureStream(name: string) {
        if (!DropService._streams[name]) {
            DropService._observers[name] = null;
            DropService._streamMapping[name] = [];
            DropService._callbacks[name] = [];
            DropService._streams[name] = new Subject<{ event: string, data?: DropFiles }>();
            DropService._observers[name] = DropService._streams[name].asObservable();
        }
    }

    // The new stream object allows us to change the target (read only in the originalEvent)
    private _preventDefault(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        return {
            originalEvent: event,
            target: event.target,
            type: event.type,
        };
    }

    // Checks if we need to perform a class addition or removal
    private _checkTarget(obj: any) {
        const dropTargets = this._dropTargets;
        let target = obj.target;

        // We have to count the objects using a set as firefox
        // often fires events twice
        if (obj.type === 'dragenter') {
            this._counter.add(target);
        } else { // must be drop
            this._counter = new Set();
        }

        while (target) {
            if (dropTargets.indexOf(target) !== -1) {
                break;
            }

            target = target.parentNode;
        }

        obj.target = target;
        if (target || this._currentTarget) {
            return true;
        }
        return false;
    }

    // Returns the stream name for an element
    private _findStream(element: HTMLScriptElement) {
        const mapping = DropService._streamMapping;

        for (const prop in mapping) {
            if (mapping.hasOwnProperty(prop) && mapping[prop].indexOf(element) !== -1) {
                return prop;
            }
        }

        return null;
    }

    // Informs the element of its highlight state
    private _performCallback(target: HTMLScriptElement, state: boolean, stream: string = null) {
        stream = stream || this._findStream(target);

        DropService._callbacks[stream].forEach((cb: any) => {
            cb(state);
        });

        // We return stream so we don't ever have to look it up twice
        return stream;
    }

    // Based on the current target, determines if a class change needs to occur
    private _updateClasses(obj: any) {
        const target = obj.target;
        const currentTarget = this._currentTarget;
        let stream: string;

        // Have we moved off a target
        if (currentTarget && currentTarget !== target) {
            stream = this._performCallback(currentTarget, false);
            this._notifyObservers(stream, {event: 'left'});
        }

        // Have we moved over a new target
        if (target && currentTarget !== target) {
            stream = this._performCallback(target, true);

            // If this is a new hover - let our subscribers know
            if (target) {
                this._notifyObservers(stream, {
                    event: 'over',
                });
            }
        }

        this._currentTarget = target;
    }

    private _removeClass(obj: any) {
        const stream: string = this._performCallback(obj.target, false);
        this._currentTarget = null;
        return this._notifyObservers(stream, {event: 'left'});
    }

    private _notifyObservers(stream: string, object: {event: string, data?: DropFiles}) {
        const _stream = DropService._streams[stream];

        if (_stream) { _stream.next(object); }
        return _stream;
    }
}
