import {FoveaHostKind} from "./fovea-host-kind";
import {ClassDeclaration, ClassExpression, SourceFile} from "typescript";

export interface IFoveaHostMarkerMarkResult {
	classDeclaration: ClassDeclaration|ClassExpression;
	sourceFile: SourceFile;
}

export interface IFoveaHostMarkerMarkIncludeResult extends IFoveaHostMarkerMarkResult {
	include: true;
	kind: FoveaHostKind;
	file: string;
	className: string;
	classDeclaration: ClassDeclaration|ClassExpression;
	isManuallyRegistered: boolean;
}

export interface IFoveaHostMarkerMarkExcludeResult extends IFoveaHostMarkerMarkResult {
	include: false;
	isPrecompiled: boolean;
	className?: string;
}

export declare type FoveaHostMarkerMarkResult = IFoveaHostMarkerMarkIncludeResult|IFoveaHostMarkerMarkExcludeResult;