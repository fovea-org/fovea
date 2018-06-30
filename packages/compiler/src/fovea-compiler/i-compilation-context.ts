import {IContainer} from "../container/i-container";
import {PropertyDeclaration} from "typescript";

export interface ICompilationContext {
	container: IContainer;
	usedLibHelperNames: Set<string>;
	propertiesWithAddedPropDecorators: Set<PropertyDeclaration>;
}