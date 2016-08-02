import { Injectable, Inject } from '@angular/core';

@Injectable() 
export class ACA_NextFrame {
	animating: any = null;

	constructor() {
		this.setupPolyfill(window);
	}

	setupPolyfill(window) {

	    let lastTime: any = 0;
	    let vendors = ['moz', 'webkit', 'o', 'ms'];
	    let x;

	    // Remove vendor prefixing if prefixed and break early if not
	    for (x = 0; x < vendors.length && !window.requestAnimationFrame; x += 1) {
	        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
	                                   || window[vendors[x] + 'CancelRequestAnimationFrame'];
	    }

	    // Check if full standard supported
	    if (window.cancelAnimationFrame === undefined) {
	        // Check if standard partially supported
	        if (window.requestAnimationFrame === undefined) {
	            // No support, emulate standard
	            window.requestAnimationFrame = function (callback) {
	                let now = new Date().getTime(),
	                    // +16 ~ 60fps, +32 ~ 31fps
	                    // Went with 30fps for older slower browsers / devcie support
	                    nextTime = Math.max(lastTime + 32, now);

	                return window.setTimeout(() => { callback(lastTime = nextTime); }, nextTime - now);
	            };

	            window.cancelAnimationFrame = window.clearTimeout;
	        } else {
	            // Emulate cancel for browsers that don't support it
	            console.log(window.requestAnimationFrame);
	            let vendor = window.requestAnimationFrame;
	            lastTime = {};

	            window.requestAnimationFrame = (callback) => {
	                let id = x; // Generate the id (x is initialized in the for loop above)
	                x += 1;
	                lastTime[id] = callback;

	                // Call the vendors requestAnimationFrame implementation
	                vendor((timestamp) => {
	                    if (lastTime.hasOwnProperty(id)) {
	                        let error;
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

	            window.cancelAnimationFrame = (id) => {
	                delete lastTime[id];
	            };
	        }
	    }
	}

    nextFrame(){
	    if (this.animating === null) {
	        this.animating = new Promise((resolve, reject) => {
	        	window.requestAnimationFrame(() => {
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

	animation(apply, compute) {
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