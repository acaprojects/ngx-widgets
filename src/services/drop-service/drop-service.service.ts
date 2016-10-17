// Require what we need from rxjs
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { DropFiles } from './drop-files';

@Injectable()
export class DropService {
    // All the elements we are interested in highlighting when the mouse is over them
    private _dropTargets:  HTMLScriptElement[] = [];
    private _currentTarget:HTMLScriptElement;

    // These track the relationship between elements, callbacks and file streams
    private static _streams       = {}; // stream name => shared observable
    private static _observers     = {}; // stream name => observer
    private static _streamMapping = {}; // stream name => element array
    private static _callbacks     = {}; // stream name => callback array

    // This are our event observables
    private _drop:     any;
    private _dragenter:any;
    private _dragover: any;
    private _dragleave:any;

    // Tracks the number of dragenter events by tracking
    // the target elements (works around a firefox issue)
    private _counter = new Set();


    constructor() {
        let overFired: any;

        // Define the event streams
        this._drop = Observable.fromEvent(window, 'drop')
            .map(this._preventDefault)
            .filter(this._checkTarget.bind(this));

        // Prevent default on all dragover events
        this._dragover = Observable.fromEvent(window, 'dragover').subscribe((event: Event) => {
            event.preventDefault();
        });

        this._dragenter = Observable.fromEvent(window, 'dragenter')
            .map(this._preventDefault)
            .filter(this._checkTarget.bind(this));

        this._dragleave = Observable.fromEvent(window, 'dragleave')
            .map(this._preventDefault)
            .filter((event) => {
                let dropTargets = this._dropTargets,
                    target = event.target,
                    i:number;

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
                    for (i = 0; i < dropTargets.length; i += 1) {
                        if (dropTargets[i] === target) {
                            return true;
                        }
                    }
                }

                return false;
            });

        // Start watching for the events
        this._dragenter.subscribe((obj: any) => {
            overFired = obj.target;
            this._updateClasses(obj);
        });
        this._dragleave.subscribe((obj: any) => {
            if (!overFired) {
                this._removeClass(obj);
            }
            overFired = null;
        });
        this._drop.subscribe((obj: any) => {
            let observer = this._removeClass(obj);
            // Stream the files
            if (observer) {
                observer.next({
                    event:'drop',
                    data: new DropFiles(obj.originalEvent)
                });
            }
        });
    }

    ngOnDestroy() {

    }

    // Configures an element to become a drop target
    register(name: string, element: HTMLScriptElement, callback: (state: boolean) => void) {
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

    pushFiles(stream:string, files: any) {
        let observer = DropService._observers[stream];
        if (observer) {
            observer.next({
                event: 'drop',
                data: new DropFiles({
                    dataTransfer: {
                        files: files
                    }
                })
            });
        }
    }

    // Hooks up a function to recieve a the files from a particular stream
    // 3 events: 'over', 'left', 'drop'
    getStream(name: string) {
        this._ensureStream(name);
        return DropService._streams[name];
    }


    // Initialises a new file stream if it did not exist
    private _ensureStream(name: string) {
        if (!DropService._streams[name]) {
            DropService._observers[name] = null;
            DropService._streamMapping[name] = [];
            DropService._callbacks[name] = [];
            DropService._streams[name] = new Observable<{ event: string, data?: DropFiles }>((observer: any) => {
                DropService._observers[name] = observer;

                return () => {
                    DropService._observers[name] = null;
                };
            }).share();
        }
    }

    // The new stream object allows us to change the target (read only in the originalEvent)
    private _preventDefault(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        return {
            originalEvent: event,
            target: event.target,
            type: event.type
        };
    }

    // Checks if we need to perform a class addition or removal
    private _checkTarget(obj: any) {
        let dropTargets = this._dropTargets,
            target = obj.target;

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
        if (target || this._currentTarget)
            return true;

        return false;
    }

    // Returns the stream name for an element
    private _findStream(element: HTMLScriptElement) {
        let mapping = DropService._streamMapping,
            prop: any;

        for (prop in mapping) {
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
        let target = obj.target,
            currentTarget = this._currentTarget,
            stream:string;

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
                    event: 'over'
                });
            }
        }

        this._currentTarget = target;
    }

    private _removeClass(obj: any) {
        let stream:string = this._performCallback(obj.target, false);

        this._currentTarget = null;

        return this._notifyObservers(stream, {event: 'left'});
    }

    private _notifyObservers(stream:string, object: {event:string, data?:DropFiles}) {
        let observer = DropService._observers[stream];

        if (observer) {
            observer.next(object);
        }
        return observer;
    }
}