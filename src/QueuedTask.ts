import { OptionalFunc, QueuedTaskProps } from "./TaskTypes";

export type QueuedTaskFactory = (props: QueuedTaskProps) => QueuedTask;

export class QueuedTask {
  // In case for some reason its not been set
  // tslint:disable-next-line:no-empty
  private resolve: OptionalFunc = () => {};
  // tslint:disable-next-line:no-empty
  private reject: OptionalFunc = () => {};

  private resolveFunctions: any;
  private finallyFunctions: any;
  private catchFunctions: any;
  private promise: any;
  public promiseFunc: QueuedTaskProps;

  public run() {
    // Not perfect detection, but it works well in this case, especially as if it's not async it NEEDS at least to look at resolve() to ot hang.
    // As we are using typescript and not JS it depends on the compiler target as to if this works. If its wrong it'll use _awaiter
    if (this.promiseFunc.constructor.name == "AsyncFunction") {
      // Shuts typescript up for now, need to check at a later date what's going on.
      (this.promiseFunc as any)().then(this.resolve).catch(this.reject);
    } else {
      this.promiseFunc(this.resolve, this.reject);
    }
  }

  public then(thenResolve: any, thenReject?: any) {
    if (thenReject) {
      this.catch(thenReject);
    }
    this.resolveFunctions.push(thenResolve);
    return this;
  }

  public finally(funcFinally: any) {
    this.finallyFunctions.push(funcFinally);
    return this;
  }

  public returnPromise(): Promise<any> {
    return new Promise((res, rej) => {
      this.then(res).catch(rej);
    });
  }

  public catch(funcCatch: any) {
    this.catchFunctions.push(funcCatch);
    return this;
  }
  constructor(promiseFunc: QueuedTaskProps) {
    this.promiseFunc = promiseFunc;
    this.resolveFunctions = [];
    this.catchFunctions = [];
    this.finallyFunctions = [];
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    })
      .then((res) => {
        for (const resolveFunc of this.resolveFunctions) {
          resolveFunc(res);
        }
      })
      .catch((rej) => {
        for (const catchFunc of this.catchFunctions) {
          catchFunc(rej);
        }
      })
      .finally(() => {
        for (const finallyFunc of this.finallyFunctions) {
          finallyFunc();
        }
      });
  }
}
