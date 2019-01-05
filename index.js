'use strict';
var EventEmitter = require('events').EventEmitter;


class PromiseQueue extends EventEmitter {
    constructor(maxConcurrent = 1, autoAdd = true) {
        super();

        let reference = this;

        this.QueuedPromise = class QueuedPromise {
            then(thenResolve, thenReject) {
                return this.promise.then(thenResolve, thenReject);
            }

            finally(funcFinally) {
                return this.promise.finally(funcFinally);
            }

            catch(funcCatch) {
                return this.promise.catch(funcCatch);
            }
            constructor(promiseFunc) {
                this.promiseFunc = promiseFunc;
                this.promiseReturnValues = [];
                this.promise = new Promise(function(resolve, reject) {
                    this.resolve = resolve;
                    this.reject = reject;  
                }.bind(this));

                if(autoAdd) {
                    reference.add(this);
                }
            }
        }

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
            this.emit('paused')
            this._processQueue = false;
        }
    }

    resume() {
        if(!this._processQueue) {
            this.emit('resumed')
            this._processQueue = true;
            this._checkQueue();
        }
    }

    _checkQueue() {
        if(this._currentlyRunning < this.maxConcurrent) {
            if(this.promiseQueue.length > 0) {
                this._runPromise(this.promiseQueue.shift());
                this._checkQueue();
            }
        }
    }

    _runPromise(promise) {
        promise.finally(function () {
            this._currentlyRunning--;
            this._checkQueue();
        }.bind(this));
        this._currentlyRunning++;
        promise.promiseFunc(promise.resolve, promise.reject);
    }


}

module.exports = PromiseQueue;