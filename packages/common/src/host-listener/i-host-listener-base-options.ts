export interface IHostListenerBaseOptions {
	passive: boolean;
	condition: boolean;
	once: boolean;
	on: EventTarget|string;
}