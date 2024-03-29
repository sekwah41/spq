import EventEmitter from "events";
import { QueuedPromiseFactory, QueuedTaskProps } from "./TaskTypes";
import { QueuedTask } from "./QueuedTask";

function remove(array: any[], element: any) {
  const index = array.indexOf(element);
  array.splice(index, 1);
}

export class PromiseQueue extends EventEmitter {
  private processing: any[];
  private _currentlyRunning: number;
  private readonly maxConcurrent: number;
  private _shouldProcessQueue: boolean;
  private promiseQueue: QueuedTask[] = [];
  public QueuedPromise: QueuedPromiseFactory;

  constructor(maxConcurrent = 1, autoAdd = true) {
    super();

    this.processing = [];

    /**
     * Will always be auto added as there isn't access to the task to queue.
     * @param task
     */
    this.QueuedPromise = (task: QueuedTaskProps) => {
      const newTask = new QueuedTask(task);
      if (autoAdd) {
        this.add(newTask);
      }
      return newTask.returnPromise();
    };

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
      this.emit("paused");
      this._shouldProcessQueue = false;
    }
  }

  resume() {
    if (!this._shouldProcessQueue) {
      this.emit("resumed");
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
        this.emit("finished");
      }
    }
  }

  _runPromise(promise: QueuedTask) {
    this.processing.push(promise);
    promise.finally(() => {
      this._currentlyRunning--;
      this._checkQueue();
      remove(this.processing, promise);
    });
    this._currentlyRunning++;
    promise.run();
  }
}
