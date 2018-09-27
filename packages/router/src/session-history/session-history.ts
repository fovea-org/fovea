import {ISessionHistory} from "./i-session-history";
import {IPopStateEvent} from "./i-pop-state-event";
import {IState, IStateInput, StateUid} from "../state/i-state";
import {StateSubscriber} from "./state-subscriber";
import {IStateObserver} from "./i-state-observer";
import {ensureLeadingSlash} from "../util/path-util";
import {ISessionHistoryOptions} from "./i-session-history-options";
import {paramsToURLSearchParams} from "../util/query-util";
import {IParams} from "../query/i-params";

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

	constructor (private options: ISessionHistoryOptions) {

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
		this.pushState(this.setStateFromStateInput(state));
	}

	/**
	 * Replaces the existing state with the given one
	 * @param {IState} state
	 */
	public replace (state: IStateInput): void {
		// Replace the current state
		this.replaceState(this.setStateFromStateInput(state));
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
		return JSON.stringify(a) === JSON.stringify(b);
	}

	/**
	 * Sets a state from the given input state
	 * @param {IStateInput} stateInput
	 * @returns {IState}
	 */
	private setStateFromStateInput (stateInput: IStateInput): IState {
		const id = ++this.stateUidIncrementor;
		const state = {
			...stateInput,
			path: ensureLeadingSlash(stateInput.path),
			id
		};
		this.states[id] = state;
		return state;
	}

	/**
	 * Pushes the given state to the History API
	 * @param {IState} state
	 */
	private pushState (state: IState): void {
		const urlFriendlyQueryParams = this.getURLFriendlyQueryParams(state.query);
		history.pushState(state.id, state.title, `${state.path}${urlFriendlyQueryParams.length > 0 ? "?" : ""}${urlFriendlyQueryParams}`);
		dispatchEvent(new PopStateEvent("popstate", {state: state.id}));
	}

	/**
	 * Pushes the given state to the History API
	 * @param {IState} state
	 */
	private replaceState (state: IState): void {
		const urlFriendlyQueryParams = this.getURLFriendlyQueryParams(state.query);
		history.replaceState(state.id, state.title, `${state.path}${urlFriendlyQueryParams.length > 0 ? "?" : ""}${urlFriendlyQueryParams}`);
		dispatchEvent(new PopStateEvent("popstate", {state: state.id}));
	}

	/**
	 * Gets URL friendly query parameters
	 * @param {IParams} query
	 * @returns {string}
	 */
	private getURLFriendlyQueryParams (query: IParams): string {
		return paramsToURLSearchParams(query).toString();
	}

	/**
	 * Invoked when a PopStateEvent is fired on the window
	 * @param {IPopStateEvent} event
	 */
	private async onPopState ({state: stateUid}: IPopStateEvent): Promise<void> {
		// Take the state for the given StateUid, if any
		const state: IState|null = stateUid == null ? null : this.states[stateUid];

		// If no state is given, replace the current history state with the result of parsing the URL
		if (state == null) {
			await this.options.router.replace(this.options.router.parseInitialRouteFromURL());
			return;
		}

		// Otherwise, find the state that matches the given one
		else {

			// Forward navigation has happened, maybe to a completely new route
			if (this.currentStateUid == null) {

				// Update the current StateUid
				this.currentStateUid = state.id;

				// This represents navigation to a future state, possibly a new one
				await this.didSwitchToFutureState(state);
			}

			// Otherwise, this is an existing state. Check if it is from the past or future
			else {
				const isPast = state.id < this.currentStateUid;
				const isFuture = state.id > this.currentStateUid;

				// Update the current StateUid
				this.currentStateUid = state.id;

				if (isPast) {
					return await this.didSwitchToPastState(state);
				} else if (isFuture) {
					return await this.didSwitchToFutureState(state);
				}
			}
		}
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