'use strict';

class PromiseQueue extends Event{
    constructor(maxConcurrent = 1, shouldAutoAdd = true) {

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

                if(shouldAutoAdd) {
                    reference.add(this);
                }
            }
        }

        this.currentlyRunning = 0;
        this.maxConcurrent = maxConcurrent;
        
        this.promiseQueue = [];
    }

    add(customPromise) {
        this.promiseQueue.push(customPromise);
        this._checkQueue();
    }

    _checkQueue() {
        if(this.currentlyRunning < this.maxConcurrent) {
            if(this.promiseQueue.length > 0) {
                this._runPromise(this.promiseQueue.shift());
            }
        }
    }

    _runPromise(promise) {
        promise.finally(function () {
            this.currentlyRunning--;
            this._checkQueue();
        }.bind(this));
        this.currentlyRunning++;
        promise.promiseFunc(promise.resolve, promise.reject);
    }


}

module.exports = PromiseQueue;