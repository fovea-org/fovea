import "../../src/services";
import {test} from "ava";
import {FoveaCompiler} from "../../src/fovea-compiler/fovea-compiler";
import {join} from "path";
import {readFileSync} from "fs";
import {FoveaCompilerCompileResult} from "../../src/fovea-compiler/i-fovea-compiler-compile-result";
import {allIndexesOf} from "@wessberg/stringutil";

interface IPrintOptions {
	printCode: boolean;
	printStats: boolean;
	printDiagnostics: boolean;
}

const defaultPrintOptions: IPrintOptions = {
	printCode: false,
	printStats: false,
	printDiagnostics: false
};

const compiler = new FoveaCompiler();

/**
 * Invoked with the result of compilation
 * @param {FoveaCompilerCompileResult} result
 * @param {boolean} printCode
 * @param {boolean} printStats
 * @param {boolean} printDiagnostics
 * @param {string} fileName
 * @returns {Promise<FoveaCompilerCompileResult>}
 */
async function handleResult (result: FoveaCompilerCompileResult, {printCode = defaultPrintOptions.printCode, printStats = defaultPrintOptions.printStats, printDiagnostics = defaultPrintOptions.printDiagnostics}: Partial<IPrintOptions> = defaultPrintOptions, fileName: string): Promise<FoveaCompilerCompileResult> {
	const silent = !printCode;
	if (!silent) {
		const amount = 90;
		console.log("=".repeat(amount));
		console.log(`${fileName}:`);
		console.log("=".repeat(amount));
	}

	if (result.hasChanged && printCode) {
		console.log(result.code);
	}
	if (printStats) console.log(result.statsForFile);
	if (printDiagnostics) console.log(result.diagnostics.toString());
	if (!silent) console.log("");
	return result;
}

/**
 * Calls 'handleResult' with the result of calling 'compile' with the given file
 * @param {string} file
 * @param {Partial<IPrintOptions>} options
 * @returns {Promise<FoveaCompilerCompileResult>}
 */
async function work (file: string, options?: Partial<IPrintOptions>): Promise<FoveaCompilerCompileResult> {
	return await handleResult(await compiler.compile({file, code: readFileSync(file).toString()}), options, file);
}

/**
 * Performs a dry run
 * @param {string[]} files
 * @returns {Promise<void>}
 */
async function dryRun (files: string[]) {
	await Promise.all(files.map(async file => await compiler.compile({options: {dryRun: true}, file, code: readFileSync(file).toString()})));
}

test.only("playground", async t => {
	const demoComponent1 = join(process.cwd(), "test/demo/demo-component/demo-component-1.ts");
	const demoComponent2 = join(process.cwd(), "test/demo/demo-component/demo-component-2.ts");
	const demoComponent1Scss = join(process.cwd(), "test/demo/demo-component/demo-component-1.scss");
	const demoComponent1Html = join(process.cwd(), "test/demo/demo-component/demo-component-1.html");
	const demoComponent2Scss = join(process.cwd(), "test/demo/demo-component/demo-component-2.scss");

	console.log(compiler.transformCompilerHints(`
	/*# IF hasStaticCSS */
	console.log(true);
	/*# END IF hasStaticCSS */
	console.log(true);
	`, "foo").code);

	await dryRun([demoComponent2, demoComponent1, demoComponent2Scss, demoComponent1Scss, demoComponent1Html]);

	await work(demoComponent2Scss, {printCode: true, printStats: true});
	await work(demoComponent1Scss, {printCode: true, printStats: true});
	await work(demoComponent1Html, {printCode: true, printDiagnostics: false, printStats: false});
	await work(demoComponent2, {printCode: true});
	await work(demoComponent1, {printCode: true, printDiagnostics: true, printStats: true});

	t.true(true);
});

test("Will ignore Custom Elements that looks to be defined by the user already", async t => {
	const path = join(process.cwd(), "test/demo/demo-component/demo-component-3.ts");
	const result = await work(path);

	// Assert that no components were matched within the file
	t.true(result.statsForFile.componentNames.length < 1);
});

test("Will include Custom Elements that import stuff from Fovea, even if they manually call 'customElement.define'", async t => {
	const path = join(process.cwd(), "test/demo/demo-component/demo-component-4.ts");
	const result = await work(path, {printCode: false});

	t.true(result.statsForFile.componentNames.length > 0);
});

test("Will not generate a call to '__registerElement' if 'customElements.define' is manually called from within the SourceFile", async t => {
	const path = join(process.cwd(), "test/demo/demo-component/demo-component-4.ts");
	const result = await work(path, {printCode: false});

	t.true(result.hasChanged && !result.code.includes("__registerElement"));
});

test("Will dash-case selector names for custom attributes", async t => {
	const path = join(process.cwd(), "test/demo/demo-component/custom-attribute-2.ts");
	const result = await work(path, {printCode: false});

	t.true(result.hasChanged && result.code.includes(`__registerCustomAttribute("my-custom-attribute"`));
});

test("Will use the provided name given in the 'selector' decorator rather than automatically generate a selector for custom attributes", async t => {
	const path = join(process.cwd(), "test/demo/demo-component/custom-attribute-3.ts");
	const result = await work(path, {printCode: false});

	t.true(result.hasChanged && result.code.includes(`__registerCustomAttribute("my-selector"`));
});

test("Will discover Custom Attributes for classes that has a '@customAttribute' decorator", async t => {
	const path = join(process.cwd(), "test/demo/demo-component/custom-attribute-1.ts");
	const result = await work(path, {printCode: false});

	t.true(result.hasChanged && result.code.includes(`__registerCustomAttribute`));
});

test("Will extend constructors of Custom Attributes with calls to '__construct'", async t => {
	const path = join(process.cwd(), "test/demo/demo-component/custom-attribute-4.ts");
	const result = await work(path, {printCode: false});

	t.true(result.hasChanged && result.code.includes(`__construct`));
});

test("Will automatically add dependencies for a component when a @dependsOn decorator doesn't already refer to them", async t => {
	const path = join(process.cwd(), "test/demo/demo-component/demo-component-6.ts");
	const result = await work(path, {printCode: false});

	t.true(result.hasChanged && result.code.includes(`__dependsOn(<any>FooComponent)`));
});

test("Will remove a @dependsOn decorator and convert it into a call to the __dependsOn helper from @fovea/lib", async t => {
	const path = join(process.cwd(), "test/demo/demo-component/demo-component-7.ts");
	const result = await work(path, {printCode: false});

	t.true(result.hasChanged && result.code.includes(`__dependsOn(<any>BarComponent`) && !result.code.includes(`@dependsOn(BarComponent)`));
});

test("Will detect precompiled components correctly when they are compiled to Javascript", async t => {
	const path = join(process.cwd(), "test/demo/demo-component/demo-component-8.ts");
	const result = await work(path, {printCode: false});

	t.true(!result.hasChanged);
});

test("Will detect precompiled components correctly when they are compiled to Typescript", async t => {
	const path = join(process.cwd(), "test/demo/demo-component/demo-component-9.ts");
	const result = await work(path, {printCode: false});

	t.true(!result.hasChanged);
});

test("Will correctly determine the type information for a prop of type: boolean", async t => {
	const path = join(process.cwd(), "test/demo/demo-component/demo-component-10.ts");
	const result = await work(path, {printCode: false});

	t.true(result.hasChanged);
});

test("Will correctly register host attributes", async t => {
	const path = join(process.cwd(), "test/demo/demo-component/demo-component-11.ts");
	// @ts-ignore
	const result = await work(path, {printCode: true, printDiagnostics: false});

	t.true(result.hasChanged && result.code.includes("__registerHostAttributes"));
});

test("Can handle multiple @listener() annotations for the same methods", async t => {
	const path = join(process.cwd(), "test/demo/demo-component/demo-component-12.ts");
	// @ts-ignore
	const result = await work(path, {printCode: true});

	t.true(result.hasChanged && allIndexesOf(result.code, /__registerHostListener/).length > 1);
});