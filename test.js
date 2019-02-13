let {expect, assert} = require("chai");

describe('Promise then check', () => {
    let PromiseQueue = require('./index');
    let customQueue = new PromiseQueue(1);
    let QueuedPromise = customQueue.QueuedPromise;

    it('Checking when rejected that only catch is fired', (done) => {

        let returnedValues = [];
        let promise = new QueuedPromise((resolve, reject) => {
            reject(6);
        });

        let hasRunThen = false;
        let hasRunCatch = false;
        promise.then((value) => {
            hasRunThen = true;
        }).catch((e) => {
            hasRunCatch = true;
        }).finally(() => {
            expect(hasRunThen).to.equal(false);
            expect(hasRunCatch).to.equal(true);
            done();
        });
    });

    it('catch() works', (done) => {

        let returnedValues = [];
        let promise = new Promise((resolve, reject) => {
            reject(5);
        });
        
        promise.catch((e) => {
            returnedValues.push(e);
            returnedValues.push(2);
        }).finally(() => {
            expect(returnedValues).to.deep.equal([5,2]);
            done();
        });
    });
});

describe('Promise order check', () => {
    let PromiseQueue = require('./index');

    it('Single queue (Forces set order)', (done) => {
        let customQueue = new PromiseQueue(1);
        let QueuedPromise = customQueue.QueuedPromise;

        let returnedValues = [];

        new QueuedPromise((resolve, reject) => {
            returnedValues.push(1);
            resolve();
        });
        new QueuedPromise((resolve, reject) => {
            setTimeout(() => {
                returnedValues.push(2);
                resolve();
            }, 10);
        });
        new QueuedPromise((resolve, reject) => {
            returnedValues.push(3);
            resolve();
        });

        setTimeout(() => {
            expect(returnedValues).to.deep.equal([1,2,3]);
            done();
        }, 20);

    });

    it('Double queue', (done) => {

        let customQueue = new PromiseQueue(2);
        let QueuedPromise = customQueue.QueuedPromise;

        let returnedValues = [];

        new QueuedPromise((resolve, reject) => {
            returnedValues.push(1);
            resolve();
        });
        new QueuedPromise((resolve, reject) => {
            setTimeout(() => {
                returnedValues.push(2);
                resolve();
            }, 10);
        });
        new QueuedPromise((resolve, reject) => {
            returnedValues.push(3);
            resolve();
        });

        setTimeout(() => {
            expect(returnedValues).to.deep.equal([1,3,2]);
            done();
        }, 20);

    });

    it('Pause Queue', (done) => {

        let customQueue = new PromiseQueue(2);
        let QueuedPromise = customQueue.QueuedPromise;

        customQueue.pause();

        let returnedValues = [];

        new QueuedPromise((resolve, reject) => {
            returnedValues.push(1);
            resolve();
        });
        new QueuedPromise((resolve, reject) => {
            setTimeout(() => {
                returnedValues.push(2);
                resolve();
            }, 5);
        });
        new QueuedPromise((resolve, reject) => {
            returnedValues.push(3);
            resolve();
        });

        setTimeout(() => {
            expect(returnedValues).to.deep.equal([]);
            customQueue.resume();
        }, 10);

        setTimeout(() => {
            expect(returnedValues).to.deep.equal([1,3,2]);
            done();
        }, 30);

    });

});
process.on('unhandledRejection', r => console.log("ERROR", r));
