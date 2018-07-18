import {IFoveaDiagnostics} from "./i-fovea-diagnostics";
import {FoveaDiagnostic} from "./fovea-diagnostic";
import {FoveaDiagnosticCtor, IAmbiguousHostFoveaDiagnosticCtor, IInvalidCssFoveaDiagnosticCtor, IInvalidDependsOnDecoratorUsageFoveaDiagnosticCtor, IInvalidHostAttributesDecoratorUsageFoveaDiagnosticCtor, IInvalidHostListenerDecoratorUsageFoveaDiagnosticCtor, IInvalidChildListObserverDecoratorUsageFoveaDiagnosticCtor, IInvalidOnChangeDecoratorUsageFoveaDiagnosticCtor, IInvalidSelectorDecoratorUsageFoveaDiagnosticCtor, IInvalidSelectorHasWhitespaceFoveaDiagnosticCtor, IInvalidSelectorIsNotAllLowerCaseFoveaDiagnosticCtor, IInvalidSelectorNeedsHyphenFoveaDiagnosticCtor, IInvalidSrcDecoratorUsageFoveaDiagnosticCtor, IInvalidTemplateFoveaDiagnosticCtor, IInvalidVisibilityObserverDecoratorUsageFoveaDiagnosticCtor, IOnlyLiteralValuesSupportedHereFoveaDiagnosticCtor, IUnknownSelectorFoveaDiagnosticCtor, IUnresolvedSrcFoveaDiagnosticCtor, IInvalidAttributeObserverDecoratorUsageFoveaDiagnosticCtor} from "./fovea-diagnostic-ctor";
import {FoveaDiagnosticKind} from "./fovea-diagnostic-kind";
import {FoveaHostKind} from "../fovea-marker/fovea-host-kind";
import chalk from "chalk";
import {IConfiguration} from "../configuration/i-configuration";
import {FoveaDiagnosticDegree} from "./fovea-diagnostic-degree";

/**
 * A class that generates diagnostics during compilation
 */
export class FoveaDiagnostics implements IFoveaDiagnostics {

	/**
	 * A Map between file names and their individual diagnostics
	 * @type {Map<string, FoveaDiagnostic[]>}
	 */
	private readonly fileToDiagnosticsMap: Map<string, FoveaDiagnostic[]> = new Map();

	constructor (private readonly configuration: IConfiguration) {
	}

	/**
	 * Returns all diagnostics (across all files)
	 * @returns {FoveaDiagnostic[]}
	 */
	public get diagnostics (): FoveaDiagnostic[] {
		const all = Array.from(this.fileToDiagnosticsMap.values());
		if (all.length < 1) return this.finalizeDiagnostics([]);
		return this.finalizeDiagnostics(all.reduce((first, next) => first.concat(next)));
	}

	/**
	 * Gets the FoveaDiagnostics for the given file. If it doesn't exist, it will include it.
	 * @param {string} file
	 * @returns {IImmutableFoveaStats}
	 */
	public getDiagnosticsForFile (file: string): FoveaDiagnostic[] {
		if (!this.fileToDiagnosticsMap.has(file)) this.addFile(file);
		return this.finalizeDiagnostics(this.fileToDiagnosticsMap.get(file)!, file);
	}

	/**
	 * Removes the FoveaDiagnostics for the given file (if they exist)
	 * @param {string} file
	 */
	public clearDiagnosticsForFile (file: string): void {
		this.fileToDiagnosticsMap.delete(file);
	}

	/**
	 * Adds a diagnostic for the given file of the given kind
	 * @param {string} file
	 * @param {FoveaDiagnosticCtor} diagnostic
	 */
	public addDiagnostic (file: string, diagnostic: FoveaDiagnosticCtor): void {
		switch (diagnostic.kind) {
			case FoveaDiagnosticKind.UNKNOWN_SELECTOR:
				return this.addUnknownSelectorDiagnostic(file, diagnostic);

			case FoveaDiagnosticKind.AMBIGUOUS_HOST:
				return this.addAmbiguousHostDiagnostic(file, diagnostic);

			case FoveaDiagnosticKind.INVALID_SRC_DECORATOR_USAGE:
				return this.addInvalidSrcDecoratorUsageDiagnostic(file, diagnostic);

			case FoveaDiagnosticKind.INVALID_DEPENDS_ON_DECORATOR_USAGE:
				return this.addInvalidDependsOnDecoratorUsageDiagnostic(file, diagnostic);

			case FoveaDiagnosticKind.INVALID_SELECTOR_DECORATOR_USAGE:
				return this.addInvalidSelectorDecoratorUsageDiagnostic(file, diagnostic);

			case FoveaDiagnosticKind.INVALID_ON_CHANGE_DECORATOR_USAGE:
				return this.addInvalidOnChangeDecoratorUsageDiagnostic(file, diagnostic);

			case FoveaDiagnosticKind.INVALID_HOST_LISTENER_DECORATOR_USAGE:
				return this.addInvalidHostListenerDecoratorUsageDiagnostic(file, diagnostic);

			case FoveaDiagnosticKind.INVALID_VISIBILITY_OBSERVER_DECORATOR_USAGE:
				return this.addInvalidVisibilityObserverDecoratorUsageDiagnostic(file, diagnostic);

			case FoveaDiagnosticKind.INVALID_CHILD_LIST_OBSERVER_DECORATOR_USAGE:
				return this.addInvalidChildListObserverDecoratorUsageDiagnostic(file, diagnostic);

			case FoveaDiagnosticKind.INVALID_ATTRIBUTE_OBSERVER_DECORATOR_USAGE:
				return this.addInvalidAttributeObserverDecoratorUsageDiagnostic(file, diagnostic);

			case FoveaDiagnosticKind.UNRESOLVED_SRC:
				return this.addUnresolvedSrcDiagnostic(file, diagnostic);

			case FoveaDiagnosticKind.INVALID_SELECTOR_NEEDS_HYPHEN:
				return this.addInvalidSelectorNeedsHyphenDiagnostic(file, diagnostic);

			case FoveaDiagnosticKind.INVALID_SELECTOR_HAS_WHITESPACE:
				return this.addInvalidSelectorHasWhitespaceDiagnostic(file, diagnostic);

			case FoveaDiagnosticKind.INVALID_SELECTOR_IS_NOT_ALL_LOWER_CASE:
				return this.addInvalidSelectorIsNotAllLowerCaseDiagnostic(file, diagnostic);

			case FoveaDiagnosticKind.INVALID_CSS:
				return this.addInvalidCssDiagnostic(file, diagnostic);

			case FoveaDiagnosticKind.INVALID_TEMPLATE:
				return this.addInvalidTemplateDiagnostic(file, diagnostic);

			case FoveaDiagnosticKind.INVALID_HOST_ATTRIBUTES_DECORATOR_USAGE:
				return this.addInvalidHostAttributesDecoratorUsageDiagnostic(file, diagnostic);

			case FoveaDiagnosticKind.ONLY_LITERAL_VALUES_SUPPORTED_HERE:
				return this.addOnlyLiteralValuesSupportedHereDiagnostic(file, diagnostic);
		}
	}

	/**
	 * Adds a diagnostic for a reference to an unknown selector within a template for a component.
	 * This is usually due to the wrong selector being used or the file containing the selector not
	 * being imported prior to using it
	 * @param {string} file
	 * @param {IUnknownSelectorFoveaDiagnosticCtor} diagnostic
	 */
	private addUnknownSelectorDiagnostic (file: string, {kind, hostName, selector, hostKind}: IUnknownSelectorFoveaDiagnosticCtor): void {
		this.getDiagnosticsForFile(file).push(
			this.finalizeDiagnostic({
				kind, file, degree: FoveaDiagnosticDegree.WARNING, selector,
				description: `You depend on the ${this.stringifyHostKind(hostKind)} with selector: '${this.paintSelector(selector)}' within the template for the component '${this.paintHost(hostName)}', but no ${this.stringifyHostKind(hostKind)} with that selector could be resolved`
			}));
	}

	/**
	 * Adds a diagnostic for a invalid CSS contents. This will be the case if PostCSS of node-sass determines
	 * a semantic or syntactical error.
	 * @param {string} file
	 * @param {IInvalidCssFoveaDiagnosticCtor} diagnostic
	 */
	private addInvalidCssDiagnostic (file: string, {kind, formattedErrorMessage}: IInvalidCssFoveaDiagnosticCtor): void {
		this.getDiagnosticsForFile(file).push(
			this.finalizeDiagnostic({
				kind, file, degree: FoveaDiagnosticDegree.ERROR,
				description: `The styles provided in file: '${file}' is invalid. Here's the full error message:\n. ${this.paintError(formattedErrorMessage)}`
			}));
	}

	/**
	 * Adds a diagnostic for a invalid Template contents. This will be the case if @fovea/dom discovers a semantic or syntactical error.
	 * @param {string} file
	 * @param {IInvalidTemplateFoveaDiagnosticCtor} diagnostic
	 */
	private addInvalidTemplateDiagnostic (file: string, {kind, formattedErrorMessage}: IInvalidTemplateFoveaDiagnosticCtor): void {
		this.getDiagnosticsForFile(file).push(
			this.finalizeDiagnostic({
				kind, file, degree: FoveaDiagnosticDegree.ERROR,
				description: `The template provided in file: '${file}' is invalid. Here's the full error message:\n. ${this.paintError(formattedErrorMessage)}`
			}));
	}

	/**
	 * Adds a diagnostic for a class that both extends HTMLElement (directly or by inheritance) *AND* is decorated with the @customAttribute decorator (and thus is a custom attribute).
	 * In this case, Fovea doesn't know whether to treat it as a component or a custom attribute and should fail for that file.
	 * @param {string} file
	 * @param {IAmbiguousHostFoveaDiagnosticCtor} diagnostic
	 */
	private addAmbiguousHostDiagnostic (file: string, {kind, hostName, extendsName}: IAmbiguousHostFoveaDiagnosticCtor): void {
		this.getDiagnosticsForFile(file).push(
			this.finalizeDiagnostic({
				kind, file, degree: FoveaDiagnosticDegree.ERROR,
				description: `You provided a class, '${this.paintHost(hostName)}', that both extends '${this.paintHost(extendsName)}' AND is annotated with the '${this.paintDecorator(this.configuration.preCompile.customAttributeDecoratorName)} decorator'. You must either extend an element or define a Custom Attribute, but you cannot do both at the same time. Please remove one of them`
			}));
	}

	/**
	 * Adds a diagnostic for a @styleSrc or @templateSrc decorator that is not properly invoked.
	 * This will be the case if it doesn't follow the form: '@[styleSrc|templateSrc](<FILE_PATH>.[css|scss])'
	 * @param {string} file
	 * @param {FoveaDiagnosticKind.INVALID_SRC_DECORATOR_USAGE} kind
	 * @param {string} hostName
	 * @param {FoveaHostKind | string} hostKind
	 * @param {string} decoratorContent
	 */
	private addInvalidSrcDecoratorUsageDiagnostic (file: string, {kind, hostName, hostKind, decoratorContent}: IInvalidSrcDecoratorUsageFoveaDiagnosticCtor): void {
		this.getDiagnosticsForFile(file).push(
			this.finalizeDiagnostic({
				kind, file, degree: FoveaDiagnosticDegree.ERROR,
				description: `The ${this.stringifyHostKind(hostKind)}: '${this.paintHost(hostName)}' is annotated with the decorator: '${this.paintDecorator(`@${decoratorContent}`)}', but the argument it receives must follow this syntax: ${this.paintFunction(`<PATH_TO_FILE>.[css|scss]`)}`
			}));
	}

	/**
	 * Adds a diagnostic for a @hostAttributes decorator that is not properly invoked.
	 * This will be the case if it doesn't follow the form: '@hostAttributes({foo: 1, bar: {baz: 2}})'
	 * @param {string} file
	 * @param {FoveaDiagnosticKind.INVALID_HOST_ATTRIBUTES_DECORATOR_USAGE} kind
	 * @param {string} hostName
	 * @param {FoveaHostKind | string} hostKind
	 * @param {string} decoratorContent
	 */
	private addInvalidHostAttributesDecoratorUsageDiagnostic (file: string, {kind, hostName, hostKind, decoratorContent}: IInvalidHostAttributesDecoratorUsageFoveaDiagnosticCtor): void {
		this.getDiagnosticsForFile(file).push(
			this.finalizeDiagnostic({
				kind, file, degree: FoveaDiagnosticDegree.ERROR,
				description: `The ${this.stringifyHostKind(hostKind)}: '${this.paintHost(hostName)}' is annotated with the decorator: '${this.paintDecorator(`@${decoratorContent}`)}', but it must receive an object literal! For example: ${this.paintFunction(`{something: "value", style: {background: "red"}}`)}`
			}));
	}

	/**
	 * Adds a diagnostic for something that expects only to receive literal values (e.g. no references)
	 * @param {string} file
	 * @param {FoveaDiagnosticKind.ONLY_LITERAL_VALUES_SUPPORTED_HERE} kind
	 * @param {string} hostName
	 * @param {FoveaHostKind | string} hostKind
	 * @param {string} decoratorContent
	 */
	private addOnlyLiteralValuesSupportedHereDiagnostic (file: string, {kind, hostName, hostKind, decoratorContent}: IOnlyLiteralValuesSupportedHereFoveaDiagnosticCtor): void {
		this.getDiagnosticsForFile(file).push(
			this.finalizeDiagnostic({
				kind, file, degree: FoveaDiagnosticDegree.ERROR,
				description: `The ${this.stringifyHostKind(hostKind)}: '${this.paintHost(hostName)}' is annotated with the decorator: '${this.paintDecorator(`@${decoratorContent}`)}', but it must receive only literal values! References to other identifiers, shorthand property assignments, spread assignments, accessors, or method declarations were found, which is currently not supported for this type of decorator. Please following a form that matches the following example: ${this.paintFunction(`{something: "value", style: {background: "red"}}`)}`
			}));
	}

	/**
	 * Adds a diagnostic for a @dependsOn decorator that is not properly invoked.
	 * This will be the case if it doesn't follow the form: '@dependsOn(...componentConstructors)'
	 * @param {string} file
	 * @param {FoveaDiagnosticKind.INVALID_DEPENDS_ON_DECORATOR_USAGE} kind
	 * @param {string} hostName
	 * @param {FoveaHostKind | string} hostKind
	 * @param {string} decoratorContent
	 */
	private addInvalidDependsOnDecoratorUsageDiagnostic (file: string, {kind, hostName, hostKind, decoratorContent}: IInvalidDependsOnDecoratorUsageFoveaDiagnosticCtor): void {
		this.getDiagnosticsForFile(file).push(
			this.finalizeDiagnostic({
				kind, file, degree: FoveaDiagnosticDegree.ERROR,
				description: `The ${this.stringifyHostKind(hostKind)}: '${this.paintHost(hostName)}' is annotated with the decorator: '${this.paintDecorator(`@${decoratorContent}`)}', but the argument it receives must follow this syntax: ${this.paintFunction(`Component1, Component2, ..., ComponentN`)}`
			}));
	}

	/**
	 * Adds a diagnostic for a @selector decorator that is not properly invoked.
	 * This will be the case if it doesn't follow the form: '@selector("<SELECTOR_NAME>")'
	 * @param {string} file
	 * @param {FoveaDiagnosticKind.INVALID_SELECTOR_DECORATOR_USAGE} kind
	 * @param {string} hostName
	 * @param {FoveaHostKind | string} hostKind
	 * @param {string} decoratorContent
	 */
	private addInvalidSelectorDecoratorUsageDiagnostic (file: string, {kind, hostName, hostKind, decoratorContent}: IInvalidSelectorDecoratorUsageFoveaDiagnosticCtor): void {
		this.getDiagnosticsForFile(file).push(
			this.finalizeDiagnostic({
				kind, file, degree: FoveaDiagnosticDegree.ERROR,
				description: `The ${this.stringifyHostKind(hostKind)}: '${this.paintHost(hostName)}' is annotated with the decorator: '${this.paintDecorator(`@${decoratorContent}`)}', but it must follow this syntax: ${this.paintDecorator(`@${this.configuration.preCompile.selectorDecoratorName}("<SELECTOR_NAME>")`)}`
			}));
	}

	/**
	 * Adds a diagnostic for a @onChange decorator that is not properly invoked.
	 * @param {string} file
	 * @param {FoveaDiagnosticKind.INVALID_ON_CHANGE_DECORATOR_USAGE} kind
	 * @param {string} hostName
	 * @param {FoveaHostKind | string} hostKind
	 * @param {string} decoratorContent
	 * @param {string} methodName
	 */
	private addInvalidOnChangeDecoratorUsageDiagnostic (file: string, {kind, hostName, hostKind, decoratorContent, methodName}: IInvalidOnChangeDecoratorUsageFoveaDiagnosticCtor): void {
		this.getDiagnosticsForFile(file).push(
			this.finalizeDiagnostic({
				kind, file, degree: FoveaDiagnosticDegree.ERROR,
				description: `You have annotated the method '${this.paintFunction(methodName)}' on the ${this.stringifyHostKind(hostKind)} '${this.paintHost(hostName)}' with the decorator: '${this.paintDecorator(`@${decoratorContent}`)}', but you haven't provided it with any arguments. The first argument must be one or more props to observe!`
			}));
	}

	/**
	 * Adds a diagnostic for a @hostListener decorator that is not properly invoked.
	 * @param {string} file
	 * @param {FoveaDiagnosticKind.INVALID_HOST_LISTENER_DECORATOR_USAGE} kind
	 * @param {string} hostName
	 * @param {FoveaHostKind | string} hostKind
	 * @param {string} decoratorContent
	 * @param {string} methodName
	 */
	private addInvalidHostListenerDecoratorUsageDiagnostic (file: string, {kind, hostName, hostKind, decoratorContent, methodName}: IInvalidHostListenerDecoratorUsageFoveaDiagnosticCtor): void {
		this.getDiagnosticsForFile(file).push(
			this.finalizeDiagnostic({
				kind, file, degree: FoveaDiagnosticDegree.ERROR,
				description: `You have annotated the method '${this.paintFunction(methodName)}' on the ${this.stringifyHostKind(hostKind)} '${this.paintHost(hostName)}' with the decorator: '${this.paintDecorator(`@${decoratorContent}`)}', but you haven't provided it with any arguments. The first argument must be one or more events to listen for!`
			}));
	}

	/**
	 * Adds a diagnostic for a @[onBecameVisible|onBecameInvisible] decorator that is not properly invoked.
	 * @param {string} file
	 * @param {FoveaDiagnosticKind.INVALID_VISIBILITY_OBSERVER_DECORATOR_USAGE} kind
	 * @param {string} hostName
	 * @param {FoveaHostKind | string} hostKind
	 * @param {string} decoratorContent
	 * @param {string} methodName
	 */
	private addInvalidVisibilityObserverDecoratorUsageDiagnostic (file: string, {kind, hostName, hostKind, decoratorContent, methodName}: IInvalidVisibilityObserverDecoratorUsageFoveaDiagnosticCtor): void {
		this.getDiagnosticsForFile(file).push(
			this.finalizeDiagnostic({
				kind, file, degree: FoveaDiagnosticDegree.ERROR,
				description: `You have annotated the method '${this.paintFunction(methodName)}' on the ${this.stringifyHostKind(hostKind)} '${this.paintHost(hostName)}' with the decorator: '${this.paintDecorator(`@${decoratorContent}`)}', but you haven't invoked it. You must invoke it, optionally passing an object of arguments!`
			}));
	}

	/**
	 * Adds a diagnostic for a @[onChildrenAdded|onChildrenRemoved] decorator that is not properly invoked.
	 * @param {string} file
	 * @param {FoveaDiagnosticKind.INVALID_CHILD_LIST_OBSERVER_DECORATOR_USAGE} kind
	 * @param {string} hostName
	 * @param {FoveaHostKind | string} hostKind
	 * @param {string} decoratorContent
	 * @param {string} methodName
	 */
	private addInvalidChildListObserverDecoratorUsageDiagnostic (file: string, {kind, hostName, hostKind, decoratorContent, methodName}: IInvalidChildListObserverDecoratorUsageFoveaDiagnosticCtor): void {
		this.getDiagnosticsForFile(file).push(
			this.finalizeDiagnostic({
				kind, file, degree: FoveaDiagnosticDegree.ERROR,
				description: `You have annotated the method '${this.paintFunction(methodName)}' on the ${this.stringifyHostKind(hostKind)} '${this.paintHost(hostName)}' with the decorator: '${this.paintDecorator(`@${decoratorContent}`)}', but you haven't invoked it. You must invoke it, optionally passing an object of arguments!`
			}));
	}


	/**
	 * Adds a diagnostic for a @onAttributeChange decorator that is not properly invoked.
	 * @param {string} file
	 * @param {FoveaDiagnosticKind.INVALID_ATTRIBUTE_OBSERVER_DECORATOR_USAGE} kind
	 * @param {string} hostName
	 * @param {FoveaHostKind | string} hostKind
	 * @param {string} decoratorContent
	 * @param {string} methodName
	 */
	private addInvalidAttributeObserverDecoratorUsageDiagnostic (file: string, {kind, hostName, hostKind, decoratorContent, methodName}: IInvalidAttributeObserverDecoratorUsageFoveaDiagnosticCtor): void {
		this.getDiagnosticsForFile(file).push(
			this.finalizeDiagnostic({
				kind, file, degree: FoveaDiagnosticDegree.ERROR,
				description: `You have annotated the method '${this.paintFunction(methodName)}' on the ${this.stringifyHostKind(hostKind)} '${this.paintHost(hostName)}' with the decorator: '${this.paintDecorator(`@${decoratorContent}`)}', but you haven't provided it with any arguments. The first argument must be one or more attributes to observe changes for!`
			}));
	}

	/**
	 * Adds a diagnostic for a @[styleSrc|templateSrc] decorator that references a file that could not be resolved.
	 * This usually happens because the user provided the wrong filename
	 * @param {string} file
	 * @param {FoveaDiagnosticKind.UNRESOLVED_SRC} kind
	 * @param {string} hostName
	 * @param {FoveaHostKind | string} hostKind
	 * @param {string} decoratorContent
	 * @param {string} path
	 */
	private addUnresolvedSrcDiagnostic (file: string, {kind, hostName, hostKind, decoratorContent, path}: IUnresolvedSrcFoveaDiagnosticCtor): void {
		this.getDiagnosticsForFile(file).push(
			this.finalizeDiagnostic({
				kind, file, degree: FoveaDiagnosticDegree.ERROR,
				description: `The ${this.stringifyHostKind(hostKind)}: '${this.paintHost(hostName)}' is annotated with the decorator: ${this.paintDecorator(`@${decoratorContent}`)}, but the path: '${this.paintMetadata(path)}' could not be resolved. Are you sure you provided the correct filename?`
			}));
	}

	/**
	 * Adds a diagnostic for a @selector decorator that defines a selector that doesn't comply with the
	 * requirements of the Custom Elements v1 spec because it doesn't include at least one hyphen.
	 * @param {string} file
	 * @param {FoveaDiagnosticKind.INVALID_SELECTOR_NEEDS_HYPHEN} kind
	 * @param {string} hostName
	 * @param {FoveaHostKind | string} hostKind
	 * @param {string} decoratorContent
	 * @param {string} selector
	 */
	private addInvalidSelectorNeedsHyphenDiagnostic (file: string, {kind, hostName, hostKind, decoratorContent, selector}: IInvalidSelectorNeedsHyphenFoveaDiagnosticCtor): void {
		this.getDiagnosticsForFile(file).push(
			this.finalizeDiagnostic({
				kind, file, degree: FoveaDiagnosticDegree.ERROR,
				description: `The ${this.stringifyHostKind(hostKind)}: '${this.paintHost(hostName)}' is annotated with the decorator: '${this.paintDecorator(`@${decoratorContent}`)}', but the provided selector: '${this.paintMetadata(selector)}' is not valid! Custom Element selectors must contain a "-".`
			}));
	}

	/**
	 * Adds a diagnostic for a @selector decorator that defines a selector that doesn't comply with the
	 * requirements of the Custom Elements v1 spec because it includes whitespace
	 * @param {string} file
	 * @param {FoveaDiagnosticKind.INVALID_SELECTOR_HAS_WHITESPACE} kind
	 * @param {string} hostName
	 * @param {FoveaHostKind | string} hostKind
	 * @param {string} decoratorContent
	 * @param {string} selector
	 */
	private addInvalidSelectorHasWhitespaceDiagnostic (file: string, {kind, hostName, hostKind, decoratorContent, selector}: IInvalidSelectorHasWhitespaceFoveaDiagnosticCtor): void {
		this.getDiagnosticsForFile(file).push(
			this.finalizeDiagnostic({
				kind, file, degree: FoveaDiagnosticDegree.ERROR,
				description: `The ${this.stringifyHostKind(hostKind)}: '${this.paintHost(hostName)}' is annotated with the decorator: '${this.paintDecorator(`@${decoratorContent}`)}', but the provided selector: '${this.paintMetadata(selector)}' is not valid! Custom Element selectors must not include whitespace.`
			}));
	}

	/**
	 * Adds a diagnostic for a @selector decorator that defines a selector that doesn't comply with the
	 * requirements of the Custom Elements v1 spec because it is in mix-case (e.g. isn't in all-lower-case)
	 * @param {string} file
	 * @param {FoveaDiagnosticKind.INVALID_SELECTOR_IS_NOT_ALL_LOWER_CASE} kind
	 * @param {string} hostName
	 * @param {FoveaHostKind | string} hostKind
	 * @param {string} decoratorContent
	 * @param {string} selector
	 */
	private addInvalidSelectorIsNotAllLowerCaseDiagnostic (file: string, {kind, hostName, hostKind, decoratorContent, selector}: IInvalidSelectorIsNotAllLowerCaseFoveaDiagnosticCtor): void {
		this.getDiagnosticsForFile(file).push(
			this.finalizeDiagnostic({
				kind, file, degree: FoveaDiagnosticDegree.ERROR,
				description: `The ${this.stringifyHostKind(hostKind)}: '${this.paintHost(hostName)}' is annotated with the decorator: '${this.paintDecorator(`@${decoratorContent}`)}', but the provided selector: '${this.paintMetadata(selector)}' is not valid! Custom Element selectors must be in lower-case.`
			}));
	}

	/**
	 * Finalizes a diagnostic
	 * @param {FoveaDiagnostic} diagnostic
	 */
	private finalizeDiagnostic (diagnostic: FoveaDiagnostic): FoveaDiagnostic {
		diagnostic.toString = () => this.stringifyDiagnostic(diagnostic);
		return diagnostic;
	}

	/**
	 * Finalizes an array of diagnostics
	 * @param {FoveaDiagnostic[]} diagnostics
	 * @param {string} [file]
	 * @returns {FoveaDiagnostic[]}
	 */
	private finalizeDiagnostics (diagnostics: FoveaDiagnostic[], file?: string): FoveaDiagnostic[] {
		diagnostics.toString = () => this.stringifyDiagnostics(diagnostics, file);
		return diagnostics;
	}

	/**
	 * Adds the provided file to the map between file names and their IFoveaStats
	 * @param {string} file
	 */
	private addFile (file: string): void {
		this.fileToDiagnosticsMap.set(file, []);
	}

	/**
	 * Stringifies a host kind so it is humanly readable
	 * @param {FoveaHostKind} hostKind
	 * @returns {string}
	 */
	private stringifyHostKind (hostKind: FoveaHostKind|string): string {
		return hostKind === FoveaHostKind.HOST ? "component" : hostKind === FoveaHostKind.CUSTOM_ATTRIBUTE ? "custom attribute" : hostKind;
	}

	/**
	 * Paints something that represents a selector
	 * @param {string} selector
	 * @returns {string}
	 */
	private paintSelector (selector: string): string {
		return chalk.blueBright(selector);
	}

	/**
	 * Paints something that represents a decorator
	 * @param {string} decorator
	 * @returns {string}
	 */
	private paintDecorator (decorator: string): string {
		return chalk.blueBright(decorator);
	}

	/**
	 * Paints something that represents a function
	 * @param {string} func
	 * @returns {string}
	 */
	private paintFunction (func: string): string {
		return chalk.yellowBright(func);
	}

	/**
	 * Paints something that represents a host such as a component or a custom attribute
	 * @param {string} host
	 * @returns {string}
	 */
	private paintHost (host: string): string {
		return chalk.magenta(host);
	}

	/**
	 * Paints something that represents some metadata, such as a file path
	 * @param {string} metadata
	 * @returns {string}
	 */
	private paintMetadata (metadata: string): string {
		return chalk.gray(metadata);
	}

	/**
	 * Paints something that represents an error
	 * @param {string} error
	 * @returns {string}
	 */
	private paintError (error: string): string {
		return chalk.red(error);
	}

	/**
	 * Paints something that represents a warning
	 * @param {string} warning
	 * @returns {string}
	 */
	private paintWarning (warning: string): string {
		return chalk.yellow(warning);
	}

	/**
	 * Paints something that represents a border
	 * @param {string} border
	 * @returns {string}
	 */
	private paintBorder (border: string): string {
		return chalk.gray(border);
	}

	/**
	 * Paints something that represents a successful action
	 * @param {string} content
	 * @returns {string}
	 */
	private paintSuccess (content: string): string {
		return chalk.green(content);
	}

	/**
	 * Paints something that represents a number
	 * @param {string | number} num
	 * @returns {string}
	 */
	private paintNumber (num: string|number): string {
		return chalk.yellow.bold(`${num}`);
	}

	/**
	 * Stringifies an array of diagnostics
	 * @param {FoveaDiagnostic[]} diagnostics
	 * @param {string} [file]
	 * @returns {string}
	 */
	private stringifyDiagnostics (diagnostics: FoveaDiagnostic[], file?: string): string {
		// If there are no diagnostics, print a success message to the user.
		if (diagnostics.length < 1) {
			return this.paintSuccess(
				file == null
					? `Fovea detected no errors or warnings during compilation ✓`
					: `Fovea detected no errors or warnings for the file '${this.paintMetadata(file)}' during compilation ✓`
			);
		}

		// Otherwise, inform that there were diagnostics and print all of them
		else {
			const errorCount = diagnostics.filter(diagnostic => diagnostic.degree === FoveaDiagnosticDegree.ERROR).length;
			const warningCount = diagnostics.filter(diagnostic => diagnostic.degree === FoveaDiagnosticDegree.WARNING).length;
			return (
				this.paintError(
					file == null
						? `\nFovea detected ${this.paintNumber(errorCount)} ${errorCount === 1 ? "error" : "errors"} and ${this.paintNumber(warningCount)} ${warningCount === 1 ? "warning" : "warnings"} during compilation:`
						: `\nFovea detected ${this.paintNumber(errorCount)} ${errorCount === 1 ? "error" : "errors"} and ${this.paintNumber(warningCount)} ${warningCount === 1 ? "warning" : "warnings"} for the file '${this.paintMetadata(file)}' during compilation:`
				) + "\n\n" +
				diagnostics.map(diagnostic => diagnostic.toString()).join("")
			);
		}
	}

	/**
	 * Stringifies a FoveaDiagnostic
	 * @param {FoveaDiagnostic} diagnostic
	 * @returns {string}
	 */
	private stringifyDiagnostic (diagnostic: FoveaDiagnostic): string {
		const borderWidth = 20;
		return (
			(diagnostic.degree === FoveaDiagnosticDegree.ERROR ? this.paintError("Error:") : this.paintWarning("Warning:")) + "\n" + diagnostic.description + "\n" +
			this.formatTableRows([
				["File", this.paintMetadata(diagnostic.file)],
				["Code", this.paintMetadata(diagnostic.kind)]
			]) +
			this.paintBorder("-".repeat(borderWidth)) + "\n");
	}

	/**
	 * Formats the given key-value pairs as table rows with identical indentation
	 * @param {[string, string][]} pairs
	 * @returns {string}
	 */
	private formatTableRows (pairs: [string, string][]): string {
		const padSize = 6;
		const padWith = " ";
		let str = "";
		pairs.forEach(([key, value]) => str += `${key}:`.padEnd(padSize, padWith) + value + "\n");
		return str;
	}

	/**
	 * Filters all diagnostics for all files
	 * @param {(diagnostic: FoveaDiagnostic) => boolean} callback
	 */
	public filterAndUpdate (callback: (diagnostic: FoveaDiagnostic) => boolean): void {
		for (const diagnostics of this.fileToDiagnosticsMap.values()) {
			for (let i = 0; i < diagnostics.length; i++) {
				const diagnostic = diagnostics[i];
				if (!callback(diagnostic)) {
					// Remove the diagnostic
					diagnostics.splice(i, 1);
				}
			}
		}
	}
}