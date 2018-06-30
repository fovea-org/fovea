import {IPrototypeExtender} from "./i-prototype-extender";
import {IConfiguration} from "../configuration/i-configuration";
import {IPrototypeExtenderExtendOptions} from "./i-prototype-extender-extend-options";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {IFoveaHostUtil} from "../util/fovea-host-util/i-fovea-host-util";
import {CallExpression, ClassDeclaration, ClassExpression, ConstructorDeclaration, ExpressionStatement, isCallExpression, isExpressionStatement, isPropertyAccessExpression, MethodDeclaration, PropertyAccessExpression, SuperExpression, SyntaxKind} from "typescript";
import {ILibUser} from "../lib-user/i-lib-user";
import {FoveaHostKind} from "../fovea-marker/fovea-host-kind";
import {IFoveaHostMarkerMarkIncludeResult} from "../fovea-marker/fovea-host-marker-mark-result";
import {IFoveaCompilerOptions} from "../options/i-fovea-compiler-options";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";
import {isSuperExpression, ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {kebabCase} from "@wessberg/stringutil";

/**
 * A class that can extend the prototype of an IFoveaHost
 */
export class PrototypeExtender implements IPrototypeExtender {
	constructor (private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly astUtil: ITypescriptASTUtil,
							 private readonly foveaHostUtil: IFoveaHostUtil,
							 private readonly libUser: ILibUser) {
	}

	/**
	 * Extends the lifecycle hooks of an IFoveaHost
	 * @param {IPrototypeExtenderExtendOptions} options
	 */
	public extend (options: IPrototypeExtenderExtendOptions): void {
		const {mark, compilerOptions, context} = options;

		// Take all props that has a "@prop" decorator (which will be those that should be observed)
		const observedProps = this.codeAnalyzer.classService.getPropertiesWithDecorator(this.configuration.preCompile.propDecoratorName, mark.classDeclaration);

		// Take the names of the props
		const observedPropNames = observedProps.map(observedProp => this.codeAnalyzer.propertyNameService.getName(observedProp.name));

		// Take the name of the parent class
		const parentClassName = this.codeAnalyzer.classService.getNameOfExtendedClass(mark.classDeclaration);

		// Check if the parent itself is a Fovea Component
		const parentIsComponent = parentClassName != null && this.stats.componentNames.includes(parentClassName);

		// Extend the constructor
		this.extendConstructor(mark, compilerOptions, context, parentIsComponent);

		// Extend the connectedCallback lifecycle hook
		this.extendConnectedCallback(mark, compilerOptions, context, parentIsComponent);

		// Extend the disconnectedCallback lifecycle hook
		this.extendDisconnectedCallback(mark.classDeclaration, compilerOptions, context, parentIsComponent);

		// If the host is an IFoveaHost
		if (mark.kind === FoveaHostKind.HOST) {
			// Extend the attributeChangedCallback lifecycle hook
			this.extendAttributeChangedCallback(mark.classDeclaration, compilerOptions, context, parentIsComponent);

			// Extend the observedAttributes static getter
			this.extendObservedAttributes(mark.classDeclaration, observedPropNames, compilerOptions, context);
		}

		// Otherwise, if it is a Custom Attribute, add a 'hostElement' property to the class
		else {
			this.extendWithHostElementProp(mark.classDeclaration, compilerOptions, context);
		}
	}

	/**
	 * Extends a class with a map between named selectors and their HTMLElements
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @param {IFoveaCompilerOptions} compilerOptions
	 * @param {ICompilationContext} context
	 */
	private extendWithHostElementProp (classDeclaration: ClassDeclaration|ClassExpression, compilerOptions: IFoveaCompilerOptions, context: ICompilationContext): void {
		// Don't proceed if this class is not a base class. Otherwise, it will be inherited from the parent
		if (!this.codeAnalyzer.classService.isBaseClass(classDeclaration)) return;

		if (!compilerOptions.dryRun) {
			context.container.appendLeft(
				classDeclaration.members.end,
				`public readonly ${this.configuration.postCompile.hostElementPropName}: Element;`
			);
		}
	}

	/**
	 * Extends the 'observedAttributes' callback of an IFoveaHost
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @param {string[]} observedPropNames
	 * @param {IFoveaCompilerOptions} compilerOptions
	 * @param {ICompilationContext} context
	 */
	private extendObservedAttributes (classDeclaration: ClassDeclaration|ClassExpression, observedPropNames: string[], compilerOptions: IFoveaCompilerOptions, context: ICompilationContext): void {
		if (!compilerOptions.dryRun) {
			// For now, remove the existing callback all-together, if it exists.
			const existingObservedAttributesMethod = this.codeAnalyzer.classService.getStaticMethodWithName(this.configuration.observedAttributesName, classDeclaration);
			if (existingObservedAttributesMethod != null) {
				context.container.remove(existingObservedAttributesMethod.pos, existingObservedAttributesMethod.end);
			}
		}

		// Map the props into quoted names
		const quotedAttributeNames = observedPropNames.map(prop => `"${kebabCase(prop)}"`);

		// Add a (static) getter for observed attributes
		if (!compilerOptions.dryRun) {
			const body = this.foveaHostUtil.isBaseComponent(classDeclaration)
				// If the class is a base component, just use the classes own props
				? ` return [${quotedAttributeNames.join(",")}];`
				// Otherwise, also call the super class's getter to add-in its props
				: ` return [${quotedAttributeNames.join(",")}, ...<string[]>(<any>Object.getPrototypeOf(this)).${this.configuration.observedAttributesName}];`;

			context.container.appendLeft(
				classDeclaration.members.end,
				`\n	protected static get ${this.configuration.observedAttributesName} (): string[] { ${body} }`
			);
		}
	}

	/**
	 * Extends an attributeChangedCallback lifecycle hook by delegating its handling to fovea-lib
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @param {IFoveaCompilerOptions} compilerOptions
	 * @param {ICompilationContext} context
	 * @param {boolean} parentIsComponent
	 */
	private extendAttributeChangedCallback (classDeclaration: ClassDeclaration|ClassExpression, compilerOptions: IFoveaCompilerOptions, context: ICompilationContext, parentIsComponent: boolean): void {

		// Find an existing 'attributeChangedCallback' hook
		const attributeChangedCallback = this.codeAnalyzer.classService.getMethodWithName(this.configuration.attributeChangedCallbackName, classDeclaration);

		// The extension to add to the connectedCallback.
		const extension = (name: string, oldValue: string, newValue: string) => ` ${this.libUser.use("attributeChanged", compilerOptions, context)}(<any>this, ${name}, ${oldValue}, ${newValue});`;

		// Define the names of the arguments
		let nameArg = "name";
		let oldValueArg = "oldValue";
		let newValueArg = "newValue";
		const nameArgWithType = () => `${nameArg}: string`;
		const oldValueArgWithType = () => `${oldValueArg}: string|null`;
		const newValueArgWithType = () => `${newValueArg}: string|null`;

		// If the class doesn't implement a attributeChangedCallback
		if (attributeChangedCallback == null) {
			// Don't proceed if the parent is a component since the method will be inherited if that is the case
			if (!parentIsComponent) {

				if (!compilerOptions.dryRun) {
					context.container.appendLeft(
						classDeclaration.members.end,
						`\n	public ${this.configuration.attributeChangedCallbackName} (${nameArgWithType()}, ${oldValueArgWithType()}, ${newValueArgWithType()}): void { ${extension(nameArg, oldValueArg, newValueArg)} }`
					);
				}
			}
		}

		// The class implements connectedCallback as one of its own members. Extend it!
		else {
			const superExpression = <null|(ExpressionStatement&{ expression: CallExpression&{ expression: PropertyAccessExpression } })> this.getSuperExpression(attributeChangedCallback, this.configuration.attributeChangedCallbackName);

			// If it has a 'super.attributeChangedCallback' call, make sure that it passes arguments to its' parent
			if (superExpression != null) {

				// If it doesn't pass on any arguments rewrite it such that it does.
				if (superExpression.expression.arguments.length < 1) {
					if (!compilerOptions.dryRun) {
						context.container.overwrite(
							superExpression.pos, superExpression.end,
							`super.${this.configuration.attributeChangedCallbackName}(...arguments);`
						);
					}
				}
			}

			// If there is a super.attributeChangedCallback() expression and the parent is a component, we don't have to do anything else since the logic will be inherited from the parent
			if (parentIsComponent && superExpression != null) return;

			const [firstParameter, secondParameter, thirdParameter] = attributeChangedCallback.parameters;

			// if it takes the first argument, take its name
			if (firstParameter != null) {
				nameArg = this.codeAnalyzer.parameterService.getName(firstParameter);
			}

			// if it takes the second argument, take its name
			if (secondParameter != null) {
				oldValueArg = this.codeAnalyzer.parameterService.getName(secondParameter);
			}

			// if it takes the third argument, take its name
			if (thirdParameter != null) {
				newValueArg = this.codeAnalyzer.parameterService.getName(thirdParameter);
			}

			if (!compilerOptions.dryRun) {
				context.container.appendRight(
					attributeChangedCallback.parameters.pos,
					`${nameArgWithType()}, ${oldValueArgWithType()}, ${newValueArgWithType()}`
				);

				// Add the instructions (if it has a body)
				if (attributeChangedCallback.body != null) {
					context.container.appendRight(
						superExpression != null ? superExpression.end : attributeChangedCallback.body.statements.pos,
						extension(nameArg, oldValueArg, newValueArg)
					);
				}
			}
		}
	}

	/**
	 * Extends the constructor of an IFoveaHost
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @param {FoveaHostKind} kind
	 * @param {IFoveaCompilerOptions} compilerOptions
	 * @param {ICompilationContext} context
	 * @param {boolean} parentIsComponent
	 */
	private extendConstructor ({classDeclaration, kind}: IFoveaHostMarkerMarkIncludeResult, compilerOptions: IFoveaCompilerOptions, context: ICompilationContext, parentIsComponent: boolean): void {

		// Find an existing constructor
		const constructor = this.codeAnalyzer.classService.getConstructor(classDeclaration);

		// The extension to add to the constructor.
		const extension = (hostElementIdentifier: string) => ` ${this.libUser.use("construct", compilerOptions, context)}(<any>this, ${hostElementIdentifier});`;

		// Define the name of the first argument of Custom Attributes
		let customAttributeNameArg = "hostElement";

		// If the class doesn't implement a constructor
		if (constructor == null) {

			// Only proceed if the parent is not a component - otherwise it will just inherit its' constructor
			if (!parentIsComponent) {

				if (!compilerOptions.dryRun) {
					context.container.appendLeft(
						classDeclaration.members.end,
						`\n	constructor (${kind === FoveaHostKind.HOST ? "" : customAttributeNameArg}) { ${(this.codeAnalyzer.classService.isBaseClass(classDeclaration) ? "" : "\n	// @ts-ignore\n	super(...arguments);\n	") + extension(kind === FoveaHostKind.HOST ? "<any>this" : customAttributeNameArg)} }`
					);
				}
			}
		}

		// The class implements the constructor as one of its own members. Extend it!
		else {
			// If it is an IFoveaHost, simple use 'this' as the argument name. Otherwise, use the name of the host argument
			const extensionName = () => kind === FoveaHostKind.HOST ? "<any>this" : customAttributeNameArg;

			if (kind === FoveaHostKind.CUSTOM_ATTRIBUTE) {
				// We have to detect the identifier for the first argument and pass that on to __construct.
				// If none is provided, we must add it to the constructor first

				// First, if the constructor doesn't take any parameters, manually add one to it
				if (constructor.parameters.length < 1) {
					if (!compilerOptions.dryRun) {
						context.container.appendRight(
							constructor.parameters.pos,
							customAttributeNameArg
						);
					}
				}

				// Otherwise, identify the name of the first argument and pass it on to __construct
				else {
					customAttributeNameArg = this.codeAnalyzer.parameterService.getName(constructor.parameters[0]);
				}
			}

			const superExpression = <(ExpressionStatement&{ expression: CallExpression&{ expression: SuperExpression } })|null> this.getSuperExpression(constructor);

			// If it has a 'super()' call, make sure that it passes arguments to its' parent
			if (superExpression != null) {

				// If it doesn't pass on any arguments rewrite it such that it does.
				if (superExpression.expression.arguments.length < 1) {
					if (!compilerOptions.dryRun) {
						context.container.overwrite(
							superExpression.pos, superExpression.end,
							`\n	// @ts-ignore\n	super(...arguments);`
						);
					}
				}
			}

			// If there is a super() expression and the parent is a component, we don't have to do anything else since the logic will be inherited from the parent
			if (parentIsComponent && superExpression != null) return;

			// Make sure that it adds the extension unless the parent is a component (in which case it will be inherited from it)
			if (constructor.body != null) {
				if (!compilerOptions.dryRun) {
					context.container.appendRight(
						superExpression != null ? superExpression.end : constructor.body.statements.pos,
						extension(extensionName())
					);
				}
			}
		}
	}

	/**
	 * Extends the 'connectedCallback' of an IFoveaHost
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @param {FoveaHostKind} kind
	 * @param {IFoveaCompilerOptions} compilerOptions
	 * @param {ICompilationContext} context
	 * @param {boolean} parentIsComponent
	 */
	private extendConnectedCallback ({classDeclaration, kind}: IFoveaHostMarkerMarkIncludeResult, compilerOptions: IFoveaCompilerOptions, context: ICompilationContext, parentIsComponent: boolean): void {

		// Find an existing 'connectedCallback' hook
		const connectedCallback = this.codeAnalyzer.classService.getMethodWithName(this.configuration.connectedCallbackName, classDeclaration);

		// The extension to add to the connectedCallback.
		const extension = `${this.libUser.use(kind === FoveaHostKind.HOST ? "renderIFoveaHost" : "renderICustomAttribute", compilerOptions, context)}(<any>this);`;

		// If the class doesn't implement a connectedCallback
		if (connectedCallback == null) {

			// Don't proceed if the parent is a component since it will simply be inherited from it
			if (!parentIsComponent) {
				if (!compilerOptions.dryRun) {
					context.container.appendLeft(
						classDeclaration.members.end,
						`\n	public ${this.configuration.connectedCallbackName} (): void { ${extension} }`
					);
				}
			}
		}

		// The class implements connectedCallback as one of its own members. Extend it!
		else {
			if (!compilerOptions.dryRun) {
				const superExpression = <null|(ExpressionStatement&{ expression: CallExpression&{ expression: PropertyAccessExpression } })> this.getSuperExpression(connectedCallback, this.configuration.connectedCallbackName);

				// If there is a super.connectedCallback() expression and the parent is a component, we don't have to do anything else since the logic will be inherited from the parent
				if (parentIsComponent && superExpression != null) return;

				if (connectedCallback.body != null) {
					context.container.appendRight(
						superExpression != null ? superExpression.end : connectedCallback.body.statements.pos,
						extension
					);
				}
			}
		}
	}

	/**
	 * Returns true if the given Method or Constructor contains a super expression
	 * @param {MethodDeclaration | ConstructorDeclaration} method
	 * @param {string} [propertyName]
	 * @returns {ExpressionStatement|null}
	 */
	private getSuperExpression (method: MethodDeclaration|ConstructorDeclaration, propertyName?: string): ExpressionStatement|null {
		let expressionStatement: ExpressionStatement|null = null;
		if (method.body != null) {
			this.astUtil.filterStatements(node => {

				// If this is a CallExpression, check to see what the contents are
				if (isExpressionStatement(node) && isCallExpression(node.expression)) {

					// If a property name is *not* given, simply check that it is a SuperExpression (such as 'super()')
					if (propertyName == null) {
						if (isSuperExpression(node.expression.expression)) {
							expressionStatement = node;
						}
					}

					// Otherwise, if a property name *is* given, check that it is a PropertyAccessExpression and that it refers to the right property name
					else {
						if (isPropertyAccessExpression(node.expression.expression) && this.codeAnalyzer.identifierService.getText(node.expression.expression.name) === propertyName) {
							expressionStatement = node;
						}
					}
				}
			}, method.body.statements, SyntaxKind.ExpressionStatement, true);
		}
		return expressionStatement;
	}

	/**
	 * Extends a disconnectedCallback and delegates it to the fovea-lib function 'dispose'
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @param {IFoveaCompilerOptions} compilerOptions
	 * @param {ICompilationContext} context
	 * @param {boolean} parentIsComponent
	 */
	private extendDisconnectedCallback (classDeclaration: ClassDeclaration|ClassExpression, compilerOptions: IFoveaCompilerOptions, context: ICompilationContext, parentIsComponent: boolean): void {

		// Find an existing 'disconnectedCallback' hook
		const disconnectedCallback = this.codeAnalyzer.classService.getMethodWithName(this.configuration.disconnectedCallbackName, classDeclaration);

		// The extension to add to the connectedCallback.
		const extension = `${this.libUser.use("dispose", compilerOptions, context)}(<any>this);`;

		// If the class doesn't implement a disconnectedCallback
		if (disconnectedCallback == null) {

			// Don't proceed if the parent is a component since it will be inherited if that is the case
			if (!parentIsComponent) {

				if (!compilerOptions.dryRun) {
					context.container.appendLeft(
						classDeclaration.members.end,
						`\n	public ${this.configuration.disconnectedCallbackName} (): void { ${extension} }`
					);
				}
			}
		}

		// The class implements disconnectedCallback as one of its own members. Extend it!
		else {
			if (!compilerOptions.dryRun) {

				const superExpression = <null|(ExpressionStatement&{ expression: CallExpression&{ expression: PropertyAccessExpression } })> this.getSuperExpression(disconnectedCallback, this.configuration.disconnectedCallbackName);

				// If there is a super.disconnectedCallback() expression and the parent is a component, we don't have to do anything else since the logic will be inherited from the parent
				if (parentIsComponent && superExpression != null) return;

				// If the node already contains a super expression, we don't have to extend it.
				if (disconnectedCallback.body != null) {
					context.container.appendRight(
						superExpression != null ? superExpression.end : disconnectedCallback.body.statements.pos,
						extension
					);
				}
			}
		}
	}
}