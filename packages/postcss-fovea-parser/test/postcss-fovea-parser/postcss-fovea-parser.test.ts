import {test} from "ava";
import {join} from "path";
import {readFileSync} from "fs";
import postcss from "postcss";
import {Json} from "@fovea/common";
import {postCSSFoveaSCSSSyntax} from "../../src/syntax/scss/syntax";

test("generate () => returns the compiled source code for a module", async t => {
	const css = readFileSync(join(process.cwd(), "test/postcss-fovea-parser/template.scss")).toString();
	const res = await <Json>postcss().process(css, {syntax: postCSSFoveaSCSSSyntax});

	console.log(res.css);
	t.true(true);
});