import {IHostProp} from "./i-host-prop";
import {IType} from "../type/i-type";

export interface IProp extends IHostProp {
	type: IType;
}