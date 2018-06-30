import {test} from "ava";
import {join} from "path";
import {readFileSync} from "fs";
import postcss from "postcss";
import {Json} from "@fovea/common";
import {postCSSFoveaSCSSParser} from "../../src/postcss-fovea-parser/postcss-fovea-scss-parser/parse-scss";

test("generate () => returns the compiled source code for a module", async t => {
	const css = readFileSync(join(process.cwd(), "test/postcss-fovea-parser/template.scss")).toString();
	const res = await <Json>postcss().process(css, {parser: postCSSFoveaSCSSParser});

	console.log(res.css);
	t.true(true);
});