// tslint:disable:no-any

/**
 * Requests the execution of a microtask and invokes the given callback within the next microtask
 * @param {() => any} callback
 */
export function requestMicroTaskCallback (callback: (time: number) => void): void {
	Promise.resolve(performance.now()).then(callback);
}