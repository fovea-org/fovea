export interface IPolyfillService {
	isWorkerCompatible (polyfillName: string): boolean;
}