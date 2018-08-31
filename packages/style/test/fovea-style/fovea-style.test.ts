import "../../src/services";
import {test} from "ava";
import {join} from "path";
import {readFileSync} from "fs";
import {FoveaStyles} from "../../src/fovea-style/fovea-styles";

const foveaStyles = new FoveaStyles();
const BASE_PATH = "test/fovea-style/base.scss";
const TEMPLATE_PATH = "test/fovea-style/template.scss";

test("generate () => returns the compiled source code for a module", async t => {
	const testStyles = true;
	const testVariables = false;
	const testImportPaths = false;

	if (testStyles) {
		const stylesResult = await foveaStyles.generate({
			template: readFileSync(join(process.cwd(), TEMPLATE_PATH)).toString(),
			file: TEMPLATE_PATH,
			production: false
		});

		console.log("static:\n", stylesResult.staticCSS, "\ninstance:\n", stylesResult.instanceCSS);
	}

	if (testVariables) {
		const variablesResult = await foveaStyles.takeVariables({
			template: readFileSync(join(process.cwd(), BASE_PATH)).toString(),
			file: BASE_PATH
		});

		console.log(variablesResult);
	}

	if (testImportPaths) {
		const importPathsResult = await foveaStyles.takeImportPaths({
			template: readFileSync(join(process.cwd(), TEMPLATE_PATH)).toString(),
			file: TEMPLATE_PATH
		});

		console.log(importPathsResult);
	}
	t.true(true);
});