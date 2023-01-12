# spq (Simple Promise Queue) [![Build](https://github.com/sekwah41/spq/actions/workflows/test.yml/badge.svg)](https://github.com/sekwah41/spq/actions/workflows/ci.yml) [![CodeQL](https://github.com/sekwah41/spq/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/sekwah41/spq/actions/workflows/codeql-analysis.yml) [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/5476/badge)](https://bestpractices.coreinfrastructure.org/projects/5476)

This project exists because of an ongoing problem in projects with too many promises resolving at once.
Rather than rewriting the workflow to work with scheduling library's this is designed to be a drop in replacement.

After a few lines of configuring you should be able to just replace `new Promise` with `QueuedPromise`.
You can also provide custom names which will allow you to add the promises to different queues.

# Example

Using promises

```javascript
const firstPromise = new Promise((resolve: () => void) => {
  setTimeout(() => {
    resolve(2);
  }, 10);
});

// Imagine if there was an issue with this running at the same time or too many at once. e.g. too many open connections
const secondPromise = new Promise((resolve: () => void) => {
  resolve(3);
});

Promise.all([firstPromise, secondPromise]);
```

Converted to using the PromiseQueue

```javascript
const { PromiseQueue } = require("spq");

const customQueue = new spq.PromiseQueue(1);
const QueuedPromise = customQueue.QueuedPromise;

const firstPromise = QueuedPromise((resolve: () => void) => {
  setTimeout(() => {
    resolve(2);
  }, 10);
});

// This won't run until the first one is fully resolved as the queue has a size of 1
const secondPromise = QueuedPromise((resolve: () => void) => {
  resolve(3);
});

Promise.all([firstPromise, secondPromise]);
```

You can also add async functions to the queue with the following syntax.

```javascript
const firstPromise = QueuedPromise(async () => {
  await someWork();
});
```

# PromiseQueue

## Methods

`pause()` paused the queue but doesnt stop already running promises

`resume()` starts the queue and starts firing tasks.

## Events

Do not change \_ values directly. The event will not fire and changing to true wont trigger
queueing of new tasks.

#### `paused`

Fired when the queue is paused.

#### `resumed`

Fired when the queue is resumed.

#### `finished`

Fired when the last task is finished and no more are queued.

# Contributing

Please ensure that your commits are in the following style for PR's

https://www.conventionalcommits.org/en/v1.0.0/

All new methods or fixes must be covered with unit tests.

# Future of this project

This was meant to be a quick projects to help queue code which otherwise overloads systems, if there are any features
please feel free to open an issue and suggest possible features or ways to interact with this library.
