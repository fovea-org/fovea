export interface IObserver {
	unobserved: boolean;
	unobserve (): void;
}