import {ClassDeclaration, ClassExpression} from "typescript";

export interface IFoveaHostUtil {
	isBaseComponent (classDeclaration: ClassDeclaration|ClassExpression): boolean;
	isBaseClass (classDeclaration: ClassDeclaration|ClassExpression): boolean;
	resolveBaseClassName (classDeclaration: ClassDeclaration|ClassExpression): string|undefined;
	isCustomizedBuiltInElement (classDeclaration: ClassDeclaration|ClassExpression): string|false;
}