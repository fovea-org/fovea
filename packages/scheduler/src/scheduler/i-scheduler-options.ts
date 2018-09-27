// tslint:disable:no-any

export type ScheduledCallback = (...args: any[]) => any;
export type ScheduledCallbackId = any;
export type SchedulerQueue = "reads"|"writes";
export type PromiseResolver = (value: any) => any;

export interface ISchedulerOptions {
	trackDeadlines: boolean;
	frameLength: number;
}