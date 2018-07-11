import "../../src/services";

import {test} from "ava";
import {join} from "path";
import {readFileSync} from "fs";
import {DIContainer} from "@wessberg/di";
import {IFoveaDOMHost} from "../../src/fovea-dom/i-fovea-dom-host";

const foveaDOM = DIContainer.get<IFoveaDOMHost>();

test("generate () => returns the compiled source code for a module", async t => {
	const printInstructions = true;
	const printStats = false;
	const {instructions, ...rest} = foveaDOM.generate({
		// language=HTML
		template: readFileSync(join(process.cwd(), "test/fovea-dom/template.html")).toString(),
		skipTags: new Set(["style"]),
		dryRun: false
	});

	if (printInstructions) {
		console.log("\nINSTRUCTIONS:");
		console.log(instructions);
	}

	if (printStats) {
		console.log(rest);
	}
	t.true(true);
});

test("generate () => Will generate key-value pairs for expressions provided to custom attributes", async t => {
	const {instructions} = foveaDOM.generate({
		// language=HTML
		template: readFileSync(join(process.cwd(), "test/fovea-dom/template.html")).toString()
	});

	console.log(instructions);
	t.true(instructions != null);
});