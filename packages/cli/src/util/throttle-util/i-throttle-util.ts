export interface IThrottleUtil {
	debounce<T> (context: T, ms: number, callback: Function): void;
	throttle<T> (context: T, ms: number, callback: Function): void;
}