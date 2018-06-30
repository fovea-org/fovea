import {ISubscriberError} from "./i-subscriber-error";

export interface ISubscriber<T> {
	onStart (): Promise<void>|void;
	onEnd (value: T): Promise<void>|void;
	onError<U> (error: ISubscriberError<U>): Promise<void>|void;
}