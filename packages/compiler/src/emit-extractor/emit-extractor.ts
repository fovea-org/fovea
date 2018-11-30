import {IEmitExtractor} from "./i-emit-extractor";
import {IEmitExtractorExtractOptions} from "./i-emit-extractor-extract-options";
import {IConfiguration} from "../configuration/i-configuration";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ILibUser} from "../lib-user/i-lib-user";
import {isCallExpression, PropertyDeclaration} from "typescript";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";
import {IFoveaHostUtil} from "../util/fovea-host-util/i-fovea-host-util";

/**
 * A class that can extract properties annotated with a @emit decorator from a Component prototype and invoke the helpers in fovea-lib
 */
export class EmitExtractor implements IEmitExtractor {
	constructor (private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly libUser: ILibUser,
							 private readonly foveaHostUtil: IFoveaHostUtil) {
	}

	/**
	 * Gets a Regular Expression that matches the name of @emit decorators
	 * @returns {RegExp}
	 */
	private get decoratorNameRegex (): RegExp {
		return new RegExp(`^${this.configuration.preCompile.emitDecoratorName}`);
	}

	/**
	 * Extracts all properties decorated with a @emit decorator and delegates it to the fovea-lib helper '___registerEmitter'.
	 * @param {IEmitExtractorExtractOptions} options
	 */
	public extract (options: IEmitExtractorExtractOptions): void {
		const {mark, context, compilerOptions} = options;

		const {classDeclaration} = mark;

		// Take all props that has a "@emit" decorator
		const emitInstanceProperties = this.codeAnalyzer.classService.getPropertiesWithDecorator(this.decoratorNameRegex, mark.classDeclaration);
		const emitStaticProperties = this.codeAnalyzer.classService.getStaticPropertiesWithDecorator(this.decoratorNameRegex, mark.classDeclaration);

		// Take all props
		const allProps = [...emitInstanceProperties, ...emitStaticProperties];

		// Store all calls to 'registerEmitter' here
		const registerEmitterCalls: string[] = [];

		// For each prop, generate a call to '___registerEmitter' and remove the '@emit' decorator
		allProps.forEach(emitProperty => {
			// Take the decorator
			const decorators = this.codeAnalyzer.decoratorService.getDecoratorsWithExpression(this.decoratorNameRegex, emitProperty);
			decorators.forEach(decorator => {
				// If we're on a dry run, return true before performing the SourceFile mutations
				if (compilerOptions.dryRun) return;

				// The emit contents will either be empty if @emit() takes no arguments or isn't a CallExpression, or it will be the contents of the first provided argument to it
				const emitContents = !isCallExpression(decorator.expression) || decorator.expression.arguments.length === 0 ? "" : `, ${this.codeAnalyzer.printer.print(decorator.expression.arguments[0])}`;

				registerEmitterCalls.push(`${this.libUser.use("registerEmitter", compilerOptions, context)}(this, "${this.codeAnalyzer.propertyNameService.getName(emitProperty.name)}", ${this.codeAnalyzer.modifierService.isStatic(emitProperty)}${emitContents});`);

				// Remove the @emit decorator from it
				context.container.remove(decorator.pos, decorator.end);

				// Make sure that it has a @prop decorator
				this.assertHasPropDecorator(emitProperty, context);
			});
		});

		// If there is at least 1 event emitter, add the prototype method
		if (registerEmitterCalls.length > 0 && !compilerOptions.dryRun) {

			const registerBody = (
				this.foveaHostUtil.isBaseClass(classDeclaration) || this.foveaHostUtil.isBaseComponent(classDeclaration)
					? `\n		${registerEmitterCalls.join("\n		")}`
					: `\n		// ts-ignore` +
					`\n		if (super.${this.configuration.postCompile.registerEmittersMethodName} != null) super.${this.configuration.postCompile.registerEmittersMethodName}();` +
					`\n		${registerEmitterCalls.join("\n		")}`
			);

			// Create the static method
			context.container.appendLeft(
				classDeclaration.members.end,
				`\n	public static ${this.configuration.postCompile.registerEmittersMethodName} (): void {` +
				`${registerBody}` +
				`\n	}`
			);
		}

		// Set 'hasEventEmitters' to true if there were any results, or if another host within the file already has a truthy value for it
		const statsForFile = this.stats.getStatsForFile(context.container.file);
		this.stats.setHasEventEmitters(context.container.file, statsForFile.hasEventEmitters || registerEmitterCalls.length > 0);
	}

	/**
	 * Assert that a PropertyDeclaration annotated with "@setOnHost" also has a "@prop" decorator since we use the logic
	 * provided by that one to hook on to mutations of the value which ultimately leads to updating the attribute on the host
	 * @param {PropertyDeclaration} property
	 * @param {ICompilationContext} context
	 */
	private assertHasPropDecorator (property: PropertyDeclaration, context: ICompilationContext): void {

		// If it doesn't have a @prop decorator, add one to it
		if (!this.codeAnalyzer.propertyService.hasDecorator(this.configuration.preCompile.propDecoratorName, property)) {
			context.propertiesWithAddedPropDecorators.add(property);
		}
	}

}