/**
 * @Author: Alex Sorafumo
 * @Date:   13/09/2016 2:55 PM
 * @Email:  alex@yuion.net
 * @Filename: animate.service.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 15/12/2016 11:37 AM
 */

import { Inject, Injectable } from '@angular/core';

@Injectable()
export class NextFrame {
    private animating: any = null;

    constructor() {
        this.setupPolyfill(self);
    }

    public setupPolyfill(self: any) {

        let lastTime: any = 0;
        const vendors = ['moz', 'webkit', 'o', 'ms'];
        let x: number;

        // Remove vendor prefixing if prefixed and break early if not
        for (x = 0; x < vendors.length && !self.requestAnimationFrame; x += 1) {
            self.requestAnimationFrame = self[vendors[x] + 'RequestAnimationFrame'];
            self.cancelAnimationFrame = self[vendors[x] + 'CancelAnimationFrame']
                || self[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        // Check if full standard supported
        if (self.cancelAnimationFrame === undefined) {
            // Check if standard partially supported
            if (self.requestAnimationFrame === undefined) {
                // No support, emulate standard
                self.requestAnimationFrame = (callback: any) => {
                    const now = (new Date()).getTime(),
                    // +16 ~ 60fps, +32 ~ 31fps
                    // Went with 30fps for older slower browsers / devcie support
                    nextTime = Math.max(lastTime + 32, now);

                    return setTimeout(() => { callback(lastTime = nextTime); }, nextTime - now);
                };

                self.cancelAnimationFrame = self.clearTimeout;
            } else {
                // Emulate cancel for browsers that don't support it
                const vendor = self.requestAnimationFrame;
                lastTime = {};

                self.requestAnimationFrame = (callback: any) => {
                    const id = x; // Generate the id (x is initialized in the for loop above)
                    x += 1;
                    lastTime[id] = callback;

                    // Call the vendors requestAnimationFrame implementation
                    vendor((timestamp: number) => {
                        if (lastTime.hasOwnProperty(id)) {
                            let error: any;
                            try {
                                lastTime[id](timestamp);
                            } catch (e) {
                                error = e;
                            } finally {
                                delete lastTime[id];
                                if (error) {
                                    // throw error;
                                    return;
                                }         // re-throw the error if an error occurred
                            }
                        }
                    });

                    // return the id for cancellation capabilities
                    return id;
                };

                self.cancelAnimationFrame = (id: any) => {
                    delete lastTime[id];
                };
            }
        }
    }

    public nextFrame() {
        if (this.animating === null) {
            this.animating = new Promise((resolve, reject) => {
                self.requestAnimationFrame(() => {
                    resolve(true);
                    this.animating = null;
                });
            });
        }
        return this.animating;
    }

}

@Injectable()
export class Animate {
    private nf: NextFrame = null;
    constructor() {
        this.nf = new NextFrame();
    }

    public animation(apply: any, compute: any): any {
        class Animation {
            private scratch = {};
            private idle = true;
            private nf: NextFrame = null;
            private compute: () => void = null;
            constructor(private apply_fn: () => void, private cp: () => void, private next: NextFrame) {
                this.nf = next;
                this.compute = cp;
            }

            public callback() {
                if (this.idle === false) {
                    this.idle = true;
                    this.compute();
                }
            }

            public animate() {
                const result = this.apply_fn.apply(this.scratch, arguments);

                // Don't animate if the apply function returns false
                if (this.idle === true && result !== false) {
                    this.idle = false;
                    this.nextFrame.then(() => { this.callback(); });
                }
            }

            get nextFrame() {
                return this.nf.nextFrame();
            }

            public is_idle() {
                return this.idle;
            }

            public refresh() {
                if (this.idle === true) {
                    this.idle = false;
                    this.nextFrame.then(() => { this.callback(); });
                }
            }
        }

        return new Animation(apply, compute, this.nf);
    }
}
