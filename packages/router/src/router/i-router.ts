import {RouteInput} from "../route/route";
import {RouterPushOptions} from "./router-push-options";

export interface IRouter {
	readonly length: number;
	addRoutes (routes: RouteInput[]): void;
	dispose (): void;
	push (options: RouterPushOptions): Promise<boolean>;
	replace (options: RouterPushOptions): Promise<boolean>;
	go (n: number): void;
	pop (): void;
}