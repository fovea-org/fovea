import {IFoveaHostDefinerDefineOptions} from "./i-fovea-host-definer-define-options";
import {IFoveaHostDefinerDefineResult} from "./i-fovea-host-definer-define-result";
import {ClassDeclaration, ClassExpression, SourceFile} from "typescript";
import {FoveaHostDefinerExportStatus} from "./i-fovea-host-definer-export-status";

export interface IFoveaHostDefiner {
	define (options: IFoveaHostDefinerDefineOptions): IFoveaHostDefinerDefineResult|undefined;
	checkHostExportStatus (classDeclaration: ClassDeclaration|ClassExpression, className: string, sourceFile: SourceFile): FoveaHostDefinerExportStatus;
}