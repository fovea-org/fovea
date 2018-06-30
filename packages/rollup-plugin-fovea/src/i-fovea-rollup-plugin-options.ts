import {FoveaDiagnostic, IFoveaOptions} from "@fovea/compiler";

export interface IFoveaRollupPluginOptions extends IFoveaOptions {
	onDiagnostics (diagnostics: FoveaDiagnostic[]): void|Promise<void>;
}