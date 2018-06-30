import {FoveaDiagnostic} from "./fovea-diagnostic";
import {FoveaDiagnosticCtor} from "./fovea-diagnostic-ctor";

export interface IFoveaDiagnostics {
	readonly diagnostics: FoveaDiagnostic[];
	getDiagnosticsForFile (file: string): FoveaDiagnostic[];
	clearDiagnosticsForFile (file: string): void;
	addDiagnostic (file: string, diagnostic: FoveaDiagnosticCtor): void;
}