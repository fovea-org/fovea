import {IFoveaDOMOptions} from "./i-fovea-dom-options";
import {IFoveaDOMResult} from "./i-fovea-dom-result";

export interface IFoveaDOMHost {
	generate (options: IFoveaDOMOptions): IFoveaDOMResult;
}