import {OptionalFunc, QueuedTaskProps} from "./TaskTypes";

export type QueuedTaskFactory = (props: QueuedTaskProps) => QueuedTask;

export class QueuedTask {

    // In case for some reason its not been set
    // tslint:disable-next-line:no-empty
    public resolve: OptionalFunc = (value) => {};
    // tslint:disable-next-line:no-empty
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
