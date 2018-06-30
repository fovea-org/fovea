import {Json, IEmitBaseOptions} from "@fovea/common";

export interface IEmitEventOptions extends IEmitBaseOptions {
	value: Json;
	target: EventTarget;
}