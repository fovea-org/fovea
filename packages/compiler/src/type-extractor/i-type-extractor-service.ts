import {IType} from "@fovea/common";

export interface ITypeExtractorService {
	getType (raw: string): IType;
}