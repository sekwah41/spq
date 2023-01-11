import { PromiseQueue } from "../PromiseQueue";
import { QueuedPromiseFactory } from "../TaskTypes";

describe("Basic checks on QueuedPromise", () => {
  let customQueue: PromiseQueue;
  let QueuedPromise: QueuedPromiseFactory;

  beforeEach(() => {
    customQueue = new PromiseQueue(1);
    QueuedPromise = customQueue.QueuedPromise;
  });

  it("Checking when rejected that only catch is fired", () => {
    const promise = QueuedPromise((resolve, reject) => {
      reject(6);
    });

    return expect(promise).rejects.toEqual(6);
  });

  it("catch() works", () => {
    const promise = QueuedPromise((resolve, reject) => {
      reject(5);
    });

    return expect(promise).rejects.toEqual(5);
  });
});

describe("Basic checks on QueuedPromise", () => {
  let customQueue: PromiseQueue;
  let QueuedPromise: QueuedPromiseFactory;

  beforeEach(() => {
    customQueue = new PromiseQueue(1);
    QueuedPromise = customQueue.QueuedPromise;
  });

  it("Checking when rejected that only catch is fired", (done) => {
    const promise = QueuedPromise((resolve, reject) => {
      reject(6);
    });

    let hasRunThen = false;
    let hasRunCatch = false;
    promise
      .then(() => {
        hasRunThen = true;
      })
      .catch(() => {
        hasRunCatch = true;
      })
      .finally(() => {
        expect(hasRunThen).toBe(false);
        expect(hasRunCatch).toBe(true);
        done();
      });
  });

  it("Checking when rejected and reject is provided in then that only catch is fired", (done) => {
    const promise = QueuedPromise((resolve, reject) => {
      reject(6);
    });

    let hasRunThen = false;
    let hasRunCatch = false;
    promise
      .then(
        () => {
          hasRunThen = true;
        },
        () => {
          hasRunCatch = true;
        },
      )
      .finally(() => {
        expect(hasRunThen).toBe(false);
        expect(hasRunCatch).toBe(true);
        done();
      });
  });

  it("catch() works", (done) => {
    const returnedValues: any[] = [];
    const promise = QueuedPromise((resolve, reject) => {
      reject(5);
    });

    promise
      .catch((e: any) => {
        returnedValues.push(e);
        returnedValues.push(2);
      })
      .finally(() => {
        expect(returnedValues).toMatchObject([5, 2]);
        done();
      });
  });
});

describe("Promise order check", () => {
  it("Single queue (Forces set order)", (done) => {
    const customQueue = new PromiseQueue(1);
    const QueuedPromise = customQueue.QueuedPromise;

    const returnedValues: any[] = [];

    QueuedPromise((resolve: () => void) => {
      returnedValues.push(1);
      resolve();
    });

    QueuedPromise((resolve: () => void) => {
      setTimeout(() => {
        returnedValues.push(2);
        resolve();
      }, 10);
    });

    QueuedPromise((resolve: () => void) => {
      returnedValues.push(3);
      resolve();
    });

    customQueue.on("finished", () => {
      expect(returnedValues).toMatchObject([1, 2, 3]);
      done();
    });
  });

  it("Double queue", (done) => {
    const customQueue = new PromiseQueue(2);
    const QueuedPromise = customQueue.QueuedPromise;

    const returnedValues: any[] = [];

    QueuedPromise((resolve: () => void) => {
      returnedValues.push(1);
      resolve();
    });
    QueuedPromise((resolve: () => void) => {
      setTimeout(() => {
        returnedValues.push(2);
        resolve();
      }, 10);
    });
    QueuedPromise((resolve: () => void) => {
      returnedValues.push(3);
      resolve();
    });

    customQueue.on("finished", () => {
      expect(returnedValues).toMatchObject([1, 3, 2]);
      done();
    });
  });

  it("Emit finished event", (done) => {
    const customQueue = new PromiseQueue(2);
    const QueuedPromise = customQueue.QueuedPromise;

    const returnedValues: any[] = [];

    customQueue.on("finished", () => {
      expect(returnedValues).toMatchObject([1, 2, 3]);
      done();
    });

    QueuedPromise((resolve: () => void) => {
      returnedValues.push(1);
      resolve();
    });
    QueuedPromise((resolve: () => void) => {
      returnedValues.push(2);
      resolve();
    });
    QueuedPromise((resolve: () => void) => {
      returnedValues.push(3);
      resolve();
    });
  });

  it("Pause Queue", (done) => {
    const customQueue = new PromiseQueue(2);
    const QueuedPromise = customQueue.QueuedPromise;

    customQueue.pause();

    const returnedValues: any[] = [];

    QueuedPromise((resolve: () => void) => {
      returnedValues.push(1);
      resolve();
    });
    QueuedPromise((resolve: () => void) => {
      setTimeout(() => {
        returnedValues.push(2);
        resolve();
      }, 5);
    });
    QueuedPromise((resolve: () => void) => {
      returnedValues.push(3);
      resolve();
    });

    setTimeout(() => {
      expect(returnedValues).toMatchObject([]);
    }, 10);

    setTimeout(() => {
      expect(returnedValues).toMatchObject([]);
      customQueue.resume();
    }, 20);

    customQueue.on("finished", () => {
      expect(returnedValues).toMatchObject([1, 3, 2]);
      done();
    });
  });
});

describe("Works with promise functions", () => {
  it("Resolves", async () => {
    const customQueue = new PromiseQueue(1);
    const QueuedPromise = customQueue.QueuedPromise;

    const testPromise = QueuedPromise((resolve: (text: string) => void) => {
      resolve("Value has returned");
    });

    const testPromise2 = QueuedPromise((resolve: (text: string) => void) => {
      resolve("Here is another");
    });

    const testPromise3 = QueuedPromise((resolve: (text: string) => void) => {
      resolve("My name is steve");
    });

    await expect(testPromise).resolves.toEqual("Value has returned");
    await expect(testPromise2).resolves.toEqual("Here is another");
    await expect(testPromise3).resolves.toEqual("My name is steve");
  });

  it("Works with promise all", async () => {
    const customQueue = new PromiseQueue(1);
    const QueuedPromise = customQueue.QueuedPromise;

    const testPromise = QueuedPromise((resolve: (text: string) => void) => {
      resolve("test1");
    });

    const testPromise2 = QueuedPromise((resolve: (text: string) => void) => {
      resolve("test2");
    });

    const testPromise3 = QueuedPromise((resolve: (text: string) => void) => {
      resolve("test3");
    });

    await expect(Promise.all([testPromise, testPromise2, testPromise3])).resolves.toEqual(["test1", "test2", "test3"]);
  });

  it("Works with await", async () => {
    const customQueue = new PromiseQueue(1);
    const QueuedPromise = customQueue.QueuedPromise;

    const result = await QueuedPromise((resolve: (text: string) => void) => {
      resolve("Await test");
    });

    expect(result).toEqual("Await test");
  });
});
