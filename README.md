spq (Simple Promise Queue) [![Build](https://github.com/sekwah41/spq/actions/workflows/ci.yml/badge.svg)](https://github.com/sekwah41/spq/actions/workflows/ci.yml) [![CodeQL](https://github.com/sekwah41/spq/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/sekwah41/spq/actions/workflows/codeql-analysis.yml)
================

This project was made because of an issue I had with too many Promises triggering 
at once due to file detection and not wanting to rewrite the code to fix it.
This allows you to create queues and just replace the normal `new Promise` with
whatever you choose to split processes into queues.

Any custom promises also have the `then`, `catch` and `finally` methods.

## PromiseQueue
### Use
**Note:** QueuedPromise can be set to anything and whatever it is it will always autoAdd to the queue the object was created from.
This means you can have multiple queues and just set a different name for `QueuedPromise` on each.
```javascript
let PromiseQueue = require('spq');

let promiseQueue = new PromiseQueue(maxConcurrent);

let QueuedPromise = promiseQueue.QueuedPromise;

// Will auto add to promiseQueue
let promise = new QueuedPromise((resolve, reject) => {
    
});

// Example of if you want two different queues
let secondPromiseQueue = new PromiseQueue(maxConcurrent, autoAdd);

let DataProcessPromise = secondPromiseQueue.QueuedPromise;

// Will auto add to secondPromiseQueue
let promise = new DataProcessPromise((resolve, reject) => {
    
});
```

If you dont want promises to automatically be added to the queue you can set autoAdd to false.
They can then be added manually.

```javascript
let PromiseQueue = require('spq');

let promiseQueue = new PromiseQueue(maxConcurrent, autoAdd);

let QueuedPromise = promiseQueue.QueuedPromise;

let promise = new QueuedPromise((resolve, reject) => {
    
});

promiseQueue.add(promise);

```

### Methods
`pause()` paused the queue but doesnt stop already running promises

`resume()` starts the queue and starts firing tasks.

### Events
Do not change _ values directly. The event will not fire and changing to true wont trigger
queueing of new tasks.
#### `paused`
Fired when `_processQueue` state changed to false

#### `resumed`
Fired when `_processQueue` state changed to true

##Incomplete Documentation
The the main functions and use are there but details may be missing.
