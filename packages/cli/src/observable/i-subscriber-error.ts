export interface ISubscriberError<T> {
	data: T;
	fatal: boolean;
	tag?: string;
}