import {ISessionHistory} from "./i-session-history";
import {IPopStateEvent} from "./i-pop-state-event";
import {IState, IStateCloneable, IStateInput, StateUid} from "../state/i-state";
import {StateSubscriber} from "./state-subscriber";
import {IStateObserver} from "./i-state-observer";
import {ensureLeadingSlash} from "../util/path-util";
import {ISessionHistoryOptions} from "./i-session-history-options";
import {paramsToURLSearchParams} from "../util/query-util";
import {IParams} from "../query/i-params";
import {marshall, demarshall} from "@wessberg/marshaller";
/**
 * A class that helps with altering the session history
 */
export class SessionHistory implements ISessionHistory {

	/**
	 * An incrementor for StateUids
	 * @type {StateUid}
	 */
	private stateUidIncrementor: StateUid = -1;

	/**
	 * The uid of the current state, if any
	 * @type {StateUid|null}
	 */
	private currentStateUid: StateUid|null = null;

	/**
	 * The history of previous routes
	 * @type {object}
	 */
	private readonly states: { [key: string]: IState } = {};

	/**
	 * The Set of all StateSubscribers to invoke when the initial state has been reached
	 * @type {Set<StateSubscriber>}
	 */
	private readonly initialStateSubscribers: Set<StateSubscriber> = new Set();

	/**
	 * The Set of all StateSubscribers to invoke when a past state has been reached
	 * @type {Set<StateSubscriber>}
	 */
	private readonly pastStateSubscribers: Set<StateSubscriber> = new Set();

	/**
	 * The Set of all StateSubscribers to invoke when a future state has been reached
	 * @type {Set<StateSubscriber>}
	 */
	private readonly futureStateSubscribers: Set<StateSubscriber> = new Set();
	/**
	 * A bound reference to the 'onPopState' method
	 * @type {Function}
	 */
	private readonly boundOnPopState = this.onPopState.bind(this);

	constructor (_options: ISessionHistoryOptions) {

		// Listen for popstate events
		window.addEventListener("popstate", this.boundOnPopState);
	}

	/**
	 * Gets the history of states
	 */
	public get stateHistory (): IState[] {
		return Object.values(this.states);
	}

	/**
	 * Gets the length of the state history
	 * @type {number}
	 */
	public get length (): number {
		return this.stateHistory.length;
	}

	/**
	 * Gets the current state, if any
	 * @type {IState?}
	 */
	public get current (): IState|undefined {
		if (this.currentStateUid == null) return undefined;
		return this.states[this.currentStateUid];
	}

	/**
	 * Disposes the SessionHistory
	 */
	public dispose (): void {
		window.removeEventListener("popstate", this.boundOnPopState);
	}

	/**
	 * Pops the current state
	 */
	public pop (): void {
		if (this.currentStateUid == null) throw new ReferenceError(`You cannot go back when there is no state to go back to!`);
		history.back(1);
		const previousState = this.states[this.currentStateUid - 1];
		dispatchEvent(new PopStateEvent("popstate", {state: previousState}));
	}

	/**
	 * Pushes the given state to the state history
	 * @param {IState} state
	 */
	public push (state: IStateInput): void {
		// Check that the new state isn't identical to the existing one before proceeding
		if (this.currentStateUid != null) {
			const existingState = this.states[this.currentStateUid];

			// If there is an existing state, and its' parameters are identical to the new ones, and their state identifiers are identical, treat this route as identical to the current one
			if (existingState != null && this.paramsAreEqual(existingState.params, state.params) && existingState.path === state.path) {
				return;
			}
		}

		// Push the state
		this.pushState(this.getStateCloneableFromStateInput(state));
	}

	/**
	 * Replaces the existing state with the given one
	 * @param {IState} state
	 */
	public replace (state: IStateInput): void {
		// Replace the current state
		this.replaceState(this.getStateCloneableFromStateInput(state));
	}

	/**
	 * Subscribes to future state changes
	 * @param callback
	 */
	public onFutureState (callback: StateSubscriber): IStateObserver {
		this.futureStateSubscribers.add(callback);
		return {unobserve: () => this.futureStateSubscribers.delete(callback)};
	}

	/**
	 * Subscribes to navigation to the initial state
	 * @param callback
	 */
	public onInitialState (callback: StateSubscriber): IStateObserver {
		this.initialStateSubscribers.add(callback);
		return {unobserve: () => this.initialStateSubscribers.delete(callback)};
	}

	/**
	 * Subscribes to navigation to a past state
	 * @param callback
	 */
	public onPastState (callback: StateSubscriber): IStateObserver {
		this.pastStateSubscribers.add(callback);
		return {unobserve: () => this.pastStateSubscribers.delete(callback)};
	}

	/**
	 * Takes the given amount of steps forward or backward in the history stack
	 * @param {number} n
	 */
	public go (n: number): void {
		history.go(n);
	}

	/**
	 * Returns true if the given sets of parameters are equal
	 * @param {IParams} a
	 * @param {IParams} b
	 * @returns {boolean}
	 */
	private paramsAreEqual (a: IParams, b: IParams): boolean {
		return Object.keys(a).length === Object.keys(b).length && Object.entries(a).every(([key, value]) => key in b && marshall(value) === marshall(b[key]));
	}

	/**
	 * Gets a cloneable state from the given input state
	 * @param {IStateInput} state
	 */
	private getStateCloneableFromStateInput (state: IStateInput): IStateCloneable {
		// Normalize the state
		return {
			...state,
			query: marshall(state.query),
			params: marshall(state.params),
			queryUrlFriendly: paramsToURLSearchParams(state.query).toString(),
			paramsUrlFriendly: paramsToURLSearchParams(state.params).toString(),
			path: ensureLeadingSlash(state.path),
			id: ++this.stateUidIncrementor
		};
	}

	/**
	 * Pushes the given state to the History API
	 * @param {IStateCloneable} state
	 */
	private pushState (state: IStateCloneable): void {
		history.pushState(state, state.title, `${state.path}${state.queryUrlFriendly.length > 0 ? "?" : ""}${state.queryUrlFriendly}`);
		dispatchEvent(new PopStateEvent("popstate", {state}));
	}

	/**
	 * Pushes the given state to the History API
	 * @param {IStateCloneable} state
	 */
	private replaceState (state: IStateCloneable): void {
		history.replaceState(state, state.title, `${state.path}${state.queryUrlFriendly.length > 0 ? "?" : ""}${state.queryUrlFriendly}`);
		dispatchEvent(new PopStateEvent("popstate", {state}));
	}

	/**
	 * Invoked when a PopStateEvent is fired on the window
	 * @param {IPopStateEvent} event
	 */
	private async onPopState ({state: stateCloneable}: IPopStateEvent): Promise<void> {
		// Normalize the state
		const query = stateCloneable == null || stateCloneable.query == null ? {} : demarshall<IParams>(stateCloneable.query);
		const params = stateCloneable == null || stateCloneable.params == null ? {} : demarshall<IParams>(stateCloneable.params);

		const state: IState|null = stateCloneable == null ? null : {
			path: stateCloneable.path,
			query: query == null ? {} : query,
			params: params == null ? {} : params,
			id: stateCloneable.id,
			title: stateCloneable.title
		};

		// If no state is given, assume this will be the initial state (e.g. the one with the uid 0)
		if (state == null) {
			const initialState = this.states[0];
			if (initialState == null) throw new ReferenceError(`Received an empty state and had no initial state to go back to!`);
			this.currentStateUid = initialState.id;

			// It will be a past state if it is null
			return await this.didSwitchToPastState(initialState);
		}

		// Otherwise, find the state that matches the given one
		else {
			const stateMatch = this.states[state.id];

			// If no state was matched, forward navigation has happened, maybe to a completely new route
			if (stateMatch == null || this.currentStateUid == null) {
				this.states[state.id] = state;

				// Take the current StateUid
				const oldCurrentStateUid = this.currentStateUid;

				// Update the current StateUid
				this.currentStateUid = state.id;

				return oldCurrentStateUid == null
					// If there is no old state, this will be the initial state
					? await this.didSwitchToInitialState(state)
					// Otherwise, this represents navigation to a future state, possibly a new one
					: await this.didSwitchToFutureState(state);
			}

			// Otherwise, this is an existing state. Check if it is from the past or future
			else {
				const isPast = stateMatch.id < this.currentStateUid;
				const isFuture = stateMatch.id > this.currentStateUid;

				// Update the current StateUid
				this.currentStateUid = stateMatch.id;

				if (isPast) {
					return await this.didSwitchToPastState(stateMatch);
				}

				else if (isFuture) {
					return await this.didSwitchToFutureState(stateMatch);
				}
			}
		}
	}

	/**
	 * Invoked when the initial state has been reached
	 * @param {IState} state
	 */
	private async didSwitchToInitialState (state: IState): Promise<void> {
		this.initialStateSubscribers.forEach(subscriber => subscriber(state));
	}

	/**
	 * Invoked when a previous state has been reached
	 * @param {IState} state
	 */
	private async didSwitchToPastState (state: IState): Promise<void> {
		this.pastStateSubscribers.forEach(subscriber => subscriber(state));
	}

	/**
	 * Invoked when a future state has been reached
	 * @param {IState} state
	 */
	private async didSwitchToFutureState (state: IState): Promise<void> {
		this.futureStateSubscribers.forEach(subscriber => subscriber(state));
	}
}