import { QueuedTask } from "./QueuedTask";

export type OptionalFunc = (value?: any) => void;
export type QueuedTaskProps = (res: OptionalFunc, rej: OptionalFunc) => void;
export type QueuedPromiseFactory = (props: QueuedTaskProps) => Promise<any>;
