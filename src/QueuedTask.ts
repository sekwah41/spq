import { OptionalFunc, QueuedTaskProps } from "./TaskTypes";

export type QueuedTaskFactory = (props: QueuedTaskProps) => QueuedTask;

export class QueuedTask {
  // In case for some reason it's not been set
  // tslint:disable-next-line:no-empty
  private resolve: OptionalFunc = () => {};
  // tslint:disable-next-line:no-empty
  private reject: OptionalFunc = () => {};

  private resolveFunctions: any;
  private finallyFunctions: any;
  private catchFunctions: any;
  private promise: any;
  public promiseFunc: QueuedTaskProps;

  public run(): void {
    let result: any;
    try {
      result = this.promiseFunc(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
      return;
    }
    if (result?.then && typeof result.then === "function") {
      result.then(this.resolve).catch(this.reject);
    }
  }

  public then(thenResolve: any) {
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
