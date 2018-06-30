import {IDevServerServiceServeOptions} from "./i-dev-server-service-serve-options";
import {ResponseReadySubscriber} from "./response-ready-subscriber";
import {RequestIndexSubscriber} from "./request-index-subscriber";
import {IDevServerServeResult} from "./i-dev-server-serve-result";

export interface IDevServerService {
	getActiveOptions (): Set<IDevServerServiceServeOptions>;
	serve (options: IDevServerServiceServeOptions): Promise<IDevServerServeResult>;
	stop (): Promise<void>;
	onRequestIndex (index: number, callback: RequestIndexSubscriber): void;
	onResponseReady (callback: ResponseReadySubscriber): void;
}