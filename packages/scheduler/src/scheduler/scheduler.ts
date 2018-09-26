import {ITaskOptions} from "./i-task-options";
import {ISchedulerOptions} from "./i-scheduler-options";

// tslint:disable:no-any

// tslint:disable:interface-name

declare function requestIdleCallback (callback: (deadline: IdleDeadline) => any): number;

interface IdleDeadline {
	readonly didTimeout: boolean;
	timeRemaining (): number;
}

type ScheduledCallback = (...args: any[]) => any;
type ScheduledCallbackId = any;
type SchedulerQueue = "reads"|"writes";
type PromiseResolver = (value: any) => any;
const MICRO_TASK_IDENTIFIER = "promise.resolve";

/**
 * A WeakMap between callback functions and their timeout ids.
 * @type {Map<Function|string, number>}
 */
const DEBOUNCED_CALLBACKS: Map<Function|string, number> = new Map();

/**
 * Debounces the execution of the given callback for the given amount of ms
 * @param {T} callback
 * @param {number} ms
 * @param {string} [id]
 * @returns {number}
 */
export function debounce<T extends Function> (callback: T, ms: number = 16, id?: string): number {
	const key = id != null ? id : callback;
	const existingTimeoutId = DEBOUNCED_CALLBACKS.get(key);

	if (existingTimeoutId != null) {
		clearTimeout(existingTimeoutId);
	}

	const timeout = <number><any> setTimeout(() => {
		callback();
		DEBOUNCED_CALLBACKS.delete(key);
	}, ms);

	DEBOUNCED_CALLBACKS.set(key, timeout);
	return timeout;
}

class Scheduler {
	/**
	 * An estimation of the duration of each frame. Used to attempt avoiding exceeding frame budgets
	 * @type {number}
	 */
	private static readonly FRAME_DURATION_EXPECTATION = 6;

	/**
	 * Whether or not the queues are currently being flushed
	 * @type {boolean}
	 */
	public flushing: boolean = false;

	/**
	 * A Set of all forced callbacks
	 * @type {WeakSet<ScheduledCallback>}
	 */
	private forcedCallbacks: WeakSet<ScheduledCallback> = new WeakSet();

	/**
	 * A Map between Scheduled Callback ids and ScheduledCallbacks
	 * @type {Map<ScheduledCallbackId, ScheduledCallback>}
	 */
	private scheduledCallbackIds: Map<ScheduledCallbackId, ScheduledCallback> = new Map();

	/**
	 * The read-queue of the scheduler
	 * @type {Map<ScheduledCallback, Function>}
	 */
	private reads: Map<ScheduledCallbackId, PromiseResolver> = new Map();
	/**
	 * The write-queue of the scheduler
	 * @type {Map<Function, Function>}
	 */
	private writes: Map<ScheduledCallbackId, PromiseResolver> = new Map();

	/**
	 * The reads that are currently being flushed
	 * @type {Map<ScheduledCallback, PromiseResolver>?}
	 */
	private currentFlushingReads?: Map<ScheduledCallbackId, PromiseResolver>;

	/**
	 * The writes that are currently being flushed
	 * @type {Map<ScheduledCallback, PromiseResolver>?}
	 */
	private currentFlushingWrites?: Map<ScheduledCallbackId, PromiseResolver>;

	/**
	 * The scheduled callback ids that are currently being flushed
	 * @type {Map<ScheduledCallback, ScheduledCallback>?}
	 */
	private currentFlushingScheduledCallbackIds?: Map<ScheduledCallbackId, ScheduledCallback>;
	/**
	 * Whether or not the running the assigned tasks has been scheduled
	 * @type {boolean}
	 */
	private scheduled: boolean = false;
	/**
	 * A this-bound reference to the 'flush' method
	 * @type {() => void}
	 */
	private boundFlush = this.flush.bind(this);

	/**
	 * The current time deadline before requiring forking the scheduler callback
	 * @type {number}
	 */
	private deadline: number = -1;

	constructor (private schedulerCallback: Function|typeof MICRO_TASK_IDENTIFIER, private options: ISchedulerOptions) {
	}

	/**
	 * Provides an estimation of whether or not executing the next task will exceed the deadline
	 * @returns {boolean}
	 */
	private get willExceedDeadline (): boolean {
		return this.options.trackDeadlines && this.deadline >= 0 && (performance.now() + Scheduler.FRAME_DURATION_EXPECTATION) > this.deadline;
	}

	/**
	 * Adds a job to the read batch and schedules a new frame if need be
	 * @param {T} task
	 * @param {Partial<ITaskOptions>} [options={}]
	 * @returns {Promise<ReturnType<T>>}
	 */
	public async measure<T extends ScheduledCallback> (task: T, {instantIfFlushing = false, id, force}: Partial<ITaskOptions> = {}): Promise<ReturnType<T>> {
		return new Promise<ReturnType<T>>(resolve => {
			const shouldScheduleFlush = !(instantIfFlushing && this.flushing);

			const key = id != null ? id : task;
			this.getScheduledCallbackIds(instantIfFlushing).set(key, task);
			this.getReads(instantIfFlushing).set(key, resolve);
			if (force) this.forcedCallbacks.add(task);
			if (shouldScheduleFlush) this.scheduleFlush();
		});
	}

	/**
	 * Adds a job to the write batch and schedules a new frame if need be
	 * @param {T} task
	 * @param {Partial<ITaskOptions>} [options={}]
	 * @returns {Promise<ReturnType<T>>}
	 */
	public async mutate<T extends ScheduledCallback> (task: T, {instantIfFlushing = false, id, force}: Partial<ITaskOptions> = {}): Promise<ReturnType<T>> {
		return new Promise<ReturnType<T>>(resolve => {
			const shouldScheduleFlush = !(instantIfFlushing && this.flushing);

			const key = id != null ? id : task;
			this.getScheduledCallbackIds(instantIfFlushing).set(key, task);
			this.getWrites(instantIfFlushing).set(key, resolve);
			if (force) this.forcedCallbacks.add(task);
			if (shouldScheduleFlush) this.scheduleFlush();
		});
	}

	/**
	 * Clears a scheduled 'read' or 'write' task.
	 * @param {ScheduledCallbackId} key
	 * @returns {boolean}
	 */
	public clear (key: ScheduledCallbackId): boolean {
		const task = this.scheduledCallbackIds.get(key);
		if (task == null) return false;
		return this.scheduledCallbackIds.delete(key) && this.forcedCallbacks.delete(task) && (this.reads.delete(task) || this.writes.delete(task));
	}

	/**
	 * Gets the proper reads queue depending on the value of "instantIfFlushing"
	 * @param {boolean} instantIfFlushing
	 * @returns {Map<ScheduledCallbackId, PromiseResolver>}
	 */
	private getReads (instantIfFlushing: boolean): Map<ScheduledCallbackId, PromiseResolver> {
		return instantIfFlushing && this.flushing && this.currentFlushingReads != null ? this.currentFlushingReads : this.reads;
	}

	/**
	 * Gets the proper writes queue depending on the value of "instantIfFlushing"
	 * @param {boolean} instantIfFlushing
	 * @returns {Map<ScheduledCallbackId, PromiseResolver>}
	 */
	private getWrites (instantIfFlushing: boolean): Map<ScheduledCallbackId, PromiseResolver> {
		return instantIfFlushing && this.flushing && this.currentFlushingWrites != null ? this.currentFlushingWrites : this.writes;
	}

	/**
	 * Gets the proper scheduledCallbackIds queue depending on the value of "instantIfFlushing"
	 * @param {boolean} instantIfFlushing
	 * @returns {Map<ScheduledCallbackId, PromiseResolver>}
	 */
	private getScheduledCallbackIds (instantIfFlushing: boolean): Map<ScheduledCallbackId, PromiseResolver> {
		return instantIfFlushing && this.flushing && this.currentFlushingScheduledCallbackIds != null ? this.currentFlushingScheduledCallbackIds : this.scheduledCallbackIds;
	}

	/**
	 * Schedules a new read/write
	 * batch if one isn't pending.
	 */
	private scheduleFlush (): void {
		if (!this.scheduled) {
			this.scheduled = true;
			if (this.schedulerCallback === MICRO_TASK_IDENTIFIER) Promise.resolve().then(this.boundFlush);
			else this.schedulerCallback.call(null, this.boundFlush);
		}
	}

	/**
	 * Normalizes the given deadline across all schedule callbacks
	 * @param {number | IdleDeadline} arg
	 * @returns {IdleDeadline}
	 */
	private normalizeDeadline (arg: number|IdleDeadline): number {
		// If the arg is null, we're most likely inside a microtask
		if (arg == null) {
			return performance.now() + this.options.frameLength;
		}

		// If the argument is a number, we're using requestAnimationFrame
		else if (typeof arg === "number") {
			return arg + this.options.frameLength;
		}

		// Otherwise, we're using requestIdleCallback
		else {
			return performance.now() + arg.timeRemaining();
		}
	}

	/**
	 * Runs queued `read` and `write` tasks.
	 * @param {number|{}} arg
	 */
	private flush (arg: number|IdleDeadline) {
		if (this.options.trackDeadlines) this.deadline = this.normalizeDeadline(arg);
		this.flushing = true;

		this.currentFlushingReads = this.reads;
		this.currentFlushingWrites = this.writes;
		this.currentFlushingScheduledCallbackIds = this.scheduledCallbackIds;

		this.reads = new Map();
		this.writes = new Map();
		this.scheduledCallbackIds = new Map();

		this.runTasks(this.currentFlushingReads, this.currentFlushingScheduledCallbackIds, "reads");
		this.runTasks(this.currentFlushingWrites, this.currentFlushingScheduledCallbackIds, "writes");

		this.scheduled = false;
		this.flushing = false;
		this.currentFlushingReads = undefined;
		this.currentFlushingWrites = undefined;
		this.currentFlushingScheduledCallbackIds = undefined;

		if (this.options.trackDeadlines) this.deadline = -1;

		// If the batch errored we may still have tasks queued
		if (this.reads.size > 0 || this.writes.size > 0) return this.scheduleFlush();
	}

	/**
	 * We run this inside a try catch so that if any jobs error, we are able to recover and continue to flush the batch until it's empty.
	 * @param {Map<ScheduledCallback, Function>} tasks
	 * @param {Map<ScheduledCallbackId, ScheduledCallback>} scheduledCallbackIds
	 * @param {SchedulerQueue} queue
	 */
	private runTasks (tasks: Map<ScheduledCallbackId, PromiseResolver>, scheduledCallbackIds: Map<ScheduledCallbackId, ScheduledCallback>, queue: SchedulerQueue): void {
		for (const [key, promise] of tasks) {
			this.runTask(promise, key, scheduledCallbackIds, queue).then();
		}
	}

	/**
	 * Runs the task associated with the given key
	 * @param {Function} promise
	 * @param {ScheduledCallbackId} key
	 * @param {Map<ScheduledCallbackId, ScheduledCallback>} scheduledCallbackIds
	 * @param {SchedulerQueue} queue
	 */
	private async runTask (promise: PromiseResolver, key: ScheduledCallbackId, scheduledCallbackIds: Map<ScheduledCallbackId, ScheduledCallback>, queue: SchedulerQueue): Promise<void> {
		const task = scheduledCallbackIds.get(key);
		if (task == null) return;

		// Check if the frame deadline has been exceeded
		// If it has, return immediately.
		const forced = this.forcedCallbacks.delete(task);
		if (this.willExceedDeadline && !forced) {
			this.scheduledCallbackIds.set(key, task);
			this[queue].set(key, promise);
			return;
		}

		promise(await task());
	}
}

export const ricScheduler = new Scheduler(requestIdleCallback, {trackDeadlines: true, frameLength: 40});
export const rafScheduler = new Scheduler(requestAnimationFrame, {trackDeadlines: false, frameLength: 40});
export const microTaskScheduler = new Scheduler(MICRO_TASK_IDENTIFIER, {trackDeadlines: false, frameLength: 40});