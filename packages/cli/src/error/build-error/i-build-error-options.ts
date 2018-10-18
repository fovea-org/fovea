export interface IBuildErrorOptions<T> {
	message?: string;
	fatal: boolean;
	data?: T;
	tag?: string;
}