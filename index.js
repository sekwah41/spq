'use strict';

var EventEmitter = require('events').EventEmitter;

function remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
}

class PromiseQueue extends EventEmitter {
    constructor(maxConcurrent = 1, autoAdd = true) {
        super();

        this.processing = [];

        let reference = this;

        this.QueuedPromise = class QueuedPromise {
            then(thenResolve, thenReject) {
                if(thenReject) {
                    this.catch(thenReject);
                }
                this.resolveFunctions.push(thenResolve);
                return this;
            }

            finally(funcFinally) {
                this.finallyFunctions.push(funcFinally);
                return this;
            }

            catch(funcCatch) {
                this.catchFunctions.push(funcCatch);
                return this;
            }
            constructor(promiseFunc) {
                this.promiseFunc = promiseFunc;
                this.resolveFunctions = [];
                this.catchFunctions = [];
                this.finallyFunctions = [];
                this.promise = new Promise(function(resolve, reject) {
                    this.resolve = resolve;
                    this.reject = reject;
                }.bind(this)).then((res) => {
                    for(let resolveFunc of this.resolveFunctions) {
                        resolveFunc(res);
                    }
                }).catch((rej) => {
                    for(let catchFunc of this.catchFunctions) {
                        catchFunc(rej);
                    }
                }).finally(() => {
                    for(let finallyFunc of this.finallyFunctions) {
                        finallyFunc();
                    }
                });

                if(autoAdd) {
                    reference.add(this);
                }
            }
        };

        this._currentlyRunning = 0;
        this.maxConcurrent = maxConcurrent;

        this._processQueue = true;

        this.promiseQueue = [];
    }

    add(customPromise) {
        this.promiseQueue.push(customPromise);
        this._checkQueue();
    }

    pause() {
        if(this._processQueue) {
            this.emit('paused');
            this._processQueue = false;
        }
    }

    resume() {
        if(!this._processQueue) {
            this.emit('resumed');
            this._processQueue = true;
            this._checkQueue();
        }
    }

    _checkQueue() {
        if(this._currentlyRunning < this.maxConcurrent && this._processQueue) {
            if(this.promiseQueue.length > 0) {
                this._runPromise(this.promiseQueue.shift());
                this._checkQueue();
            }
        }
    }

    _runPromise(promise) {
        this.processing.push(promise);
        promise.finally(function () {
            this._currentlyRunning--;
            this._checkQueue();
            remove(this.processing, promise);
        }.bind(this));
        this._currentlyRunning++;
        promise.promiseFunc(promise.resolve, promise.reject);
    }


}

module.exports = PromiseQueue;