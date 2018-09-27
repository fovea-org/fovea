import {ScheduledCallback, ScheduledCallbackId} from "./i-scheduler-options";
import {ITaskOptions} from "./i-task-options";

export interface IScheduler {
	readonly flushing: boolean;

	mutate<T extends ScheduledCallback> (task: T, options?: Partial<ITaskOptions>): Promise<ReturnType<T>>;
	measure<T extends ScheduledCallback> (task: T, options?: Partial<ITaskOptions>): Promise<ReturnType<T>>;
	clear (key: ScheduledCallbackId): boolean;
}