import {LibHelperName} from "@fovea/common";
import {IFoveaCompilerOptions} from "../options/i-fovea-compiler-options";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";

export interface ILibUser {
	markAsUsed (functionName: LibHelperName|Iterable<LibHelperName>, compilerOptions: IFoveaCompilerOptions, context: ICompilationContext): void;
	use (helperName: LibHelperName, compilerOptions: IFoveaCompilerOptions, context: ICompilationContext): string;
	consumeHelpers (context: ICompilationContext): void;
}