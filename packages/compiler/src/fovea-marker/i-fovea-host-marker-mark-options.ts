import {ClassDeclaration, ClassExpression} from "typescript";

export interface IFoveaHostMarkerMarkOptions {
	classDeclaration: ClassDeclaration|ClassExpression;
	file: string;
}