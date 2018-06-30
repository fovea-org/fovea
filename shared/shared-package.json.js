export const FORMAT_NODE = "cjs";
export const FORMAT_MODULE = "esm";
import packageJSON from "../package.json";

/**
 * These fields are shared among all package.json files across the project
 */
export default {
	main: `./dist/${FORMAT_NODE}/index.js`,
	module: `./dist/${FORMAT_MODULE}/index.js`,
	browser: `./dist/${FORMAT_MODULE}/index.js`,
	types: `./dist/${FORMAT_MODULE}/index.d.ts`,
	typings: `./dist/${FORMAT_MODULE}/index.d.ts`,
	es2015: `./dist/${FORMAT_MODULE}/index.js`,
	files: [
		"dist/**/*.*",
		"bin/*"
	],
	repository: packageJSON.repository,
	bugs: packageJSON.bugs,
	contributors: packageJSON.contributors,
	engines: packageJSON.engines,
	license: packageJSON.license,
};