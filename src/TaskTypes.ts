export type OptionalFunc = (value?: any) => void;
export type QueuedTaskProps = ((res: OptionalFunc, rej: OptionalFunc) => void) | (() => Promise<any>);
export type QueuedPromiseFactory = (props: QueuedTaskProps) => Promise<any>;
