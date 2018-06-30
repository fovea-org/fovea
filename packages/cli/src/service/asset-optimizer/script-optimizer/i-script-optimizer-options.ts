import {IOptimizerOptions} from "../i-optimizer-options";
import {ScriptFormatKind} from "../../../format/script-format-kind";

export interface IScriptOptimizerOptions extends IOptimizerOptions {
	outputFormat: ScriptFormatKind;
}