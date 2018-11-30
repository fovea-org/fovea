import {IFoveaCompilerCompileOptions} from "./i-fovea-compiler-compile-options";
import {IFoveaCompilerBase} from "./i-fovea-compiler-base";
import {FoveaCompilerCompileResult} from "./i-fovea-compiler-compile-result";
import {IImmutableFoveaStats} from "../stats/i-fovea-stats";
import {FoveaDiagnostic} from "../diagnostics/fovea-diagnostic";
import {container} from "../services";

/**
 * A FoveaCompiler class meant for public consumption. This shadows the actual FoveaCompilerBase class to ensure
 * that it can be used without having to dependency inject it when clients consume it.
 */
export class FoveaCompiler implements IFoveaCompilerBase {

	constructor () {
		return container.get<IFoveaCompilerBase>();
	}

	/**
	 * This is a noop. The constructor returns the proper implementation of the compiler
	 * @returns {IImmutableFoveaStats}
	 */
	public get stats (): IImmutableFoveaStats {
		throw Error();
	}

	/**
	 * This is a noop. The constructor returns the proper implementation of the compiler
	 * @returns {FoveaDiagnostic[]}
	 */
	public get diagnostics (): FoveaDiagnostic[] {
		throw Error();
	}

	/**
	 * This is a noop. The constructor returns the proper implementation of the compiler
	 * @param {IFoveaCompilerCompileOptions} options
	 * @returns {Promise<FoveaCompilerCompileResult>}
	 */
	public async compile (options: IFoveaCompilerCompileOptions): Promise<FoveaCompilerCompileResult> {
		throw Error(options.toString());
	}
}