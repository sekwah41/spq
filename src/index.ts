import EventEmitter from 'events';

function remove(array: any[], element: any) {
  const index = array.indexOf(element);
  array.splice(index, 1);
}

export type OptionalFunc = (value?: any) => void;
export type QueuedTaskProps = (res: OptionalFunc, rej: OptionalFunc) => void;
export type QueuedTaskFactory = (props: QueuedTaskProps) => QueuedTask;
export type QueuedPromiseFactory = (props: QueuedTaskProps) => Promise<any>;

class QueuedTask {

  // In case for some reason its not been set
  public resolve: OptionalFunc = (value) => {};
  public reject: OptionalFunc = (value) => {};

  private resolveFunctions: any;
  private finallyFunctions: any;
  private catchFunctions: any;
  private promise: any;
  public promiseFunc: QueuedTaskProps;

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
        },
    )
        .then((res) => {
          for (let resolveFunc of this.resolveFunctions) {
            resolveFunc(res);
          }
        })
        .catch((rej) => {
          for (let catchFunc of this.catchFunctions) {
            catchFunc(rej);
          }
        })
        .finally(() => {
          for (let finallyFunc of this.finallyFunctions) {
            finallyFunc();
          }
        });
  }
}

class PromiseQueue extends EventEmitter {
  private processing: any[];
  private _currentlyRunning: number;
  private readonly maxConcurrent: number;
  private _shouldProcessQueue: boolean;
  private promiseQueue: QueuedTask[] = [];
  public QueuedTask: QueuedTaskFactory;
  public QueuedPromise: QueuedPromiseFactory;

  constructor(maxConcurrent = 1, autoAdd = true) {
    super();

    this.processing = [];

    // There may be a better way to implement this using <T>
    this.QueuedTask = (props: QueuedTaskProps) => {
      const newTask = new QueuedTask(props);
      if(autoAdd) {
        this.add(newTask);
      }
      return newTask;
    }

    /**
     * Will always be auto added as there isn't access to the task to queue.
     * @param props
     */
    this.QueuedPromise = (task: QueuedTaskProps) => {
      const newTask = new QueuedTask(task);
      this.add(newTask);
      return new Promise((res,rej) => {
        newTask.then(res).catch(rej)
      });
    }

    this._currentlyRunning = 0;
    this.maxConcurrent = maxConcurrent;

    this._shouldProcessQueue = true;
  }

  add(customTask: QueuedTask) {
    this.promiseQueue.push(customTask);
    this._checkQueue();
  }

  pause() {
    if (this._shouldProcessQueue) {
      this.emit('paused');
      this._shouldProcessQueue = false;
    }
  }

  resume() {
    if (!this._shouldProcessQueue) {
      this.emit('resumed');
      this._shouldProcessQueue = true;
      this._checkQueue();
    }
  }

  _checkQueue() {
    if (this._currentlyRunning < this.maxConcurrent && this._shouldProcessQueue) {
      const nextPromise = this.promiseQueue.shift();
      if (nextPromise) {
        this._runPromise(nextPromise);
        this._checkQueue();
      } else if (this._currentlyRunning === 0 && this.promiseQueue.length === 0) {
        this.emit('finished');
      }
    }
  }

  _runPromise(promise: QueuedTask) {
    this.processing.push(promise);
    promise.finally(
      () => {
        this._currentlyRunning--;
        this._checkQueue();
        remove(this.processing, promise);
      },
    );
    this._currentlyRunning++;
    promise.promiseFunc(promise.resolve, promise.reject);
  }
}

export default PromiseQueue;
