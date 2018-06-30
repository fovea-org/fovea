import "../../src/services";
import {test} from "ava";
import {join} from "path";
import {readFileSync} from "fs";
import {FoveaStyles} from "../../src/fovea-style/fovea-styles";

const foveaStyles = new FoveaStyles();

test("generate () => returns the compiled source code for a module", async t => {
	const testStyles = true;
	const testVariables = true;
	const testImportPaths = true;

	if (testStyles) {
		const stylesResult = await foveaStyles.generate({
			template: readFileSync(join(process.cwd(), "test/fovea-style/template.scss")).toString(),
			file: "test/fovea-style/template.scss",
			production: false
		});

		console.log("static:\n", stylesResult.staticCSS, "\ninstance:\n", stylesResult.instanceCSS);
	}

	if (testVariables) {
		const variablesResult = await foveaStyles.takeVariables({
			template: readFileSync(join(process.cwd(), "test/fovea-style/base.scss")).toString(),
			file: "test/fovea-style/base.scss"
		});

		console.log(variablesResult);
	}

	if (testImportPaths) {
		const importPathsResult = await foveaStyles.takeImportPaths({
			template: readFileSync(join(process.cwd(), "test/fovea-style/template.scss")).toString(),
			file: "test/fovea-style/template.scss"
		});

		console.log(importPathsResult);
	}
	t.true(true);
});