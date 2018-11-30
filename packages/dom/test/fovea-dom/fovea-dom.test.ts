import {container} from "../../src/services";

import {test} from "ava";
import {join} from "path";
import {readFileSync} from "fs";
import {IFoveaDOMHost} from "../../src/fovea-dom/i-fovea-dom-host";

const foveaDOM = container.get<IFoveaDOMHost>();

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

test("generate () => Will correctly generate template instructions for host attributes", async t => {
	const {instructions} = foveaDOM.generate({
		hostAttributes: {
			"*routerLink": "",
			foo: "${bar}",
			class: {
				something: ""
			},
			style: {
				background: "red"
			}
		}
	});

	console.log(instructions);

	t.true(instructions != null);
});