// tslint:disable:no-any

export interface IObserver {
	unobserve (): void;
}

/**
 * Invoked when the next event is received
 * @param {Function} listener
 * @param {IObserver} observer
 * @param {Event} e
 */
function nextEvent (listener: EventListenerOrEventListenerObject, observer: IObserver, e: Event): void {
	"handleEvent" in listener ? (<any>listener).handleEvent(e, observer) : (<any>listener)(e, observer);
}

/**
 * Adds an event listener that can be unobserved imperatively
 * @param {EventTarget} eventTarget
 * @param {string} type
 * @param {EventListenerOrEventListenerObject} listener
 * @param {boolean | AddEventListenerOptions} options
 * @returns {IObserver}
 */
export function addObservableEventListener (eventTarget: EventTarget, type: string, listener: EventListenerOrEventListenerObject, options?: boolean|AddEventListenerOptions): IObserver {
	// Initialize to a noop
	const unobserver: IObserver = {unobserve: () => {}};

	// Prepare an observable listener
	const observableListener = nextEvent.bind(null, listener, unobserver);

	// Overwrite the unobserve method
	unobserver.unobserve = () => eventTarget.removeEventListener(type, observableListener, options);

	// Attach an event listener
	eventTarget.addEventListener(type, observableListener, options);
	return unobserver;
}