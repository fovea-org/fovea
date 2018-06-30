export interface IServeConfig {
	cacheControl: {
		default: string;
		watch: string;
	};
	websocket: {
		liveReloadPath: string;
	};
}