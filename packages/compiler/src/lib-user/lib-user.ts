import {ILibUser} from "./i-lib-user";
import {LibHelperName, libHelperName} from "@fovea/common";
import {IConfiguration} from "../configuration/i-configuration";
import {IFoveaCompilerOptions} from "../options/i-fovea-compiler-options";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";

/**
 * A class that can help with interacting with FoveaLib helper files within source code.
 * It will generate the identifier for the function within the source code but also generates
 * an import for it.
 */
export class LibUser implements ILibUser {
	constructor (private readonly configuration: IConfiguration) {
	}

	/**
	 * Marks a FoveaLib helper as used by generating an import for it and returns its identifier
	 * @param {LibHelperName} helperName
	 * @param {IFoveaCompilerOptions} compilerOptions
	 * @param {ICompilationContext} context
	 * @returns {string}
	 */
	public use (helperName: LibHelperName, compilerOptions: IFoveaCompilerOptions, context: ICompilationContext): string {
		this.markAsUsed(helperName, compilerOptions, context);
		return libHelperName[helperName];
	}

	/**
	 * Marks a FoveaLib helper as used by generating an import for it
	 * @param {LibHelperName|Iterable<LibHelperName>} helperName
	 * @param {IFoveaCompilerOptions} compilerOptions
	 * @param {ICompilationContext} context
	 */
	public markAsUsed (helperName: LibHelperName|Iterable<LibHelperName>, compilerOptions: IFoveaCompilerOptions, context: ICompilationContext): void {
		// Return if we're on a dry run
		if (compilerOptions.dryRun) return;

		// Normalize the helper names
		const helpers = typeof helperName === "string" ? [libHelperName[helperName]] : [...helperName].map(helper => libHelperName[helper]);
		helpers.forEach(helper => context.usedLibHelperNames.add(helper));
	}

	/**
	 * Takes all helpers used by the given compilation context and appends an import to the head of the file that references the helpers inside of @fovea/lib
	 * @param {ICompilationContext} context
	 */
	public consumeHelpers (context: ICompilationContext): void {
		// Don't add the import if no helpers were used at all
		if (context.usedLibHelperNames.size < 1) return;

		context.container.prepend(`import {${Array.from(context.usedLibHelperNames).join(", ")}} from "${this.configuration.foveaLibModuleName}";\n`);
	}
}