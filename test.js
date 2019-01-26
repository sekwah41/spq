let {expect, assert} = require("chai");

describe('Promise then check', () => {
    let PromiseQueue = require('./index');
    let customQueue = new PromiseQueue(1);
    let QueuedPromise = customQueue.QueuedPromise;

    it('Correct then() execution order', (done) => {
        let returnedValues = [];
        let promise = new QueuedPromise((resolve, reject) => {
            resolve();
        });
        
        promise.then(() => returnedValues.push(2));
        promise.then(() => returnedValues.push(3)).then(() => returnedValues.push(4))
            .then(() => {
                expect(returnedValues).to.deep.equal([2,3,12,4]);
                done();
            }).catch((e) => {
                done(e);
            });
        
        promise.then(() => returnedValues.push(12));
    });

    it('catch() works', (done) => {
        let returnedValues = [];
        let promise = new QueuedPromise((resolve, reject) => {
            reject(5);
        });

        promise.then(() => {}, (e) => {
            returnedValues.push(e);
            returnedValues.push(2);
        });

        promise.catch((e) => {
            returnedValues.push(e);
            returnedValues.push(4);
        });
        
        setTimeout(() => {
            expect(returnedValues).to.deep.equal([5,2,5,4]);
            done();
        },100)
    });
});

describe('Promise order check (Uses timeouts its not slow)', () => {
    let PromiseQueue = require('./index');

    it('Single queue (Forces set order)', (done) => {
        let customQueue = new PromiseQueue(1);
        let QueuedPromise = customQueue.QueuedPromise;

        let returnedValues = [];

        new QueuedPromise((resolve, reject) => {
            returnedValues.push(1)
            resolve();
        });
        new QueuedPromise((resolve, reject) => {
            setTimeout(() => {
                returnedValues.push(2);
                resolve();
            }, 20);
        });
        new QueuedPromise((resolve, reject) => {
            returnedValues.push(3);
            resolve();
        });

        setTimeout(() => {
            expect(returnedValues).to.deep.equal([1,2,3]);
            done();
        }, 100);

    });

    it('Double queue', (done) => {

        let customQueue = new PromiseQueue(2);
        let QueuedPromise = customQueue.QueuedPromise;

        let returnedValues = [];

        new QueuedPromise((resolve, reject) => {
            returnedValues.push(1)
            resolve();
        });
        new QueuedPromise((resolve, reject) => {
            setTimeout(() => {
                returnedValues.push(2);
                resolve();
            }, 20);
        });
        new QueuedPromise((resolve, reject) => {
            returnedValues.push(3);
            resolve();
        });

        setTimeout(() => {
            expect(returnedValues).to.deep.equal([1,3,2]);
            done();
        }, 100);

    });

    it('Pause Queue', (done) => {

        let customQueue = new PromiseQueue(2);
        let QueuedPromise = customQueue.QueuedPromise;

        customQueue.pause();

        let returnedValues = [];

        new QueuedPromise((resolve, reject) => {
            returnedValues.push(1)
            resolve();
        });
        new QueuedPromise((resolve, reject) => {
            setTimeout(() => {
                returnedValues.push(2);
                resolve();
            }, 20);
        });
        new QueuedPromise((resolve, reject) => {
            returnedValues.push(3);
            resolve();
        });

        setTimeout(() => {
            expect(returnedValues).to.deep.equal([]);
            customQueue.resume();
        }, 100);

        setTimeout(() => {
            expect(returnedValues).to.deep.equal([1,3,2]);
            done();
        }, 200);

    });

});
