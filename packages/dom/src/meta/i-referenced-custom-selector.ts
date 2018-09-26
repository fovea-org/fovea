import {FoveaHostKind} from "@fovea/common";

export interface IReferencedCustomSelector {
	kind: FoveaHostKind;
	selector: string;
}