/**
* @Author: Alex Sorafumo
* @Date:   13/09/2016 2:55 PM
* @Email:  alex@yuion.net
* @Filename: animate.service.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 15/12/2016 11:37 AM
*/

import { Injectable, Inject } from '@angular/core';

@Injectable()
export class ACA_NextFrame {
    animating: any = null;

    constructor() {
        this.setupPolyfill(self);
    }

    setupPolyfill(self: any) {

        let lastTime: any = 0;
        let vendors = ['moz', 'webkit', 'o', 'ms'];
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
                self.requestAnimationFrame = function (callback: any) {
                    let now = new Date().getTime(),
                        // +16 ~ 60fps, +32 ~ 31fps
                        // Went with 30fps for older slower browsers / devcie support
                        nextTime = Math.max(lastTime + 32, now);

                    return setTimeout(() => { callback(lastTime = nextTime); }, nextTime - now);
                };

                self.cancelAnimationFrame = self.clearTimeout;
            } else {
                // Emulate cancel for browsers that don't support it
                console.log(self.requestAnimationFrame);
                let vendor = self.requestAnimationFrame;
                lastTime = {};

                self.requestAnimationFrame = (callback: any) => {
                    let id = x; // Generate the id (x is initialized in the for loop above)
                    x += 1;
                    lastTime[id] = callback;

                    // Call the vendors requestAnimationFrame implementation
                    vendor((timestamp:number) => {
                        if (lastTime.hasOwnProperty(id)) {
                            let error: any;
                            try {
                                lastTime[id](timestamp);
                            } catch (e) {
                                error = e;
                            } finally {
                                delete lastTime[id];
                                if (error) { throw error; }         // re-throw the error if an error occurred
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

    nextFrame(){
        if (this.animating === null) {
            this.animating = new Promise((resolve, reject) => {
                self.requestAnimationFrame(() => {
                    resolve(true);
                    this.animating = null;
                });
            })
        }
        return this.animating;
    };

}

@Injectable()
export class ACA_Animate {
    nf: ACA_NextFrame = null;
    constructor() {
        this.nf = new ACA_NextFrame();
    }

    animation(apply: any, compute: any): any {
        class Animate {
            scratch = {};
            idle = true;
            nf: ACA_NextFrame = null;
            compute: Function = null;
            constructor(apply: Function, cp: Function, next: ACA_NextFrame) {
                this.nf = next;
                this.compute = cp;
            }

            callback() {
                if (this.idle === false) {
                    this.idle = true;
                    this.compute();
                }
            }

            animate() {
                let result = apply.apply(this.scratch, arguments);

                // Don't animate if the apply function returns false
                if (this.idle === true && result !== false) {
                    this.idle = false;
                    this.nextFrame.then(() => { this.callback() });
                }
            }

            get nextFrame() {
                return this.nf.nextFrame();
            }

            is_idle() {
                return this.idle;
            }

            refresh() {
                if (this.idle === true) {
                    this.idle = false;
                    this.nextFrame.then(() => { this.callback() });
                }
            };
        }

        return new Animate(apply, compute, this.nf);
    }
}
