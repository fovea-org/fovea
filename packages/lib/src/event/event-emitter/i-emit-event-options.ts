import {IEmitBaseOptions, Json} from "@fovea/common";

export interface IEmitEventOptions extends IEmitBaseOptions {
	value: Json;
	target: EventTarget;
}