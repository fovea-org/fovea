import packageJSON from "../package.json";
export const FORMAT_NODE = "cjs";
export const FORMAT_MODULE = "esm";
export const FORMAT_IMMEDIATELY_INVOKED_FUNCTION = "iife";
export const FORMAT_FLAT_MODULE = "fesm";

export const formatOutputPath = (format, ext = ".js") =>  `./dist/${format}/index${ext}`;

/**
 * These fields are shared among all package.json files across the project
 */
export default {
	main: formatOutputPath(FORMAT_NODE),
	module: formatOutputPath(FORMAT_MODULE),
	browser: formatOutputPath(FORMAT_MODULE),
	types: formatOutputPath(FORMAT_MODULE, ".d.ts"),
	typings: formatOutputPath(FORMAT_MODULE, ".d.ts"),
	es2015: formatOutputPath(FORMAT_MODULE),
	files: [
		"dist/**/*.*",
		"bin/*"
	],
	repository: packageJSON.repository,
	bugs: packageJSON.bugs,
	contributors: packageJSON.contributors,
	engines: packageJSON.engines,
	license: packageJSON.license,
	scaffold: {
		patreonUserId: "11315442",
		contributorMeta: {
			"Frederik Wessberg": {
				imageUrl: "https://avatars2.githubusercontent.com/u/20454213?s=460&v=4",
				role: "Lead Developer",
				twitterHandle: "FredWessberg",
				isCocEnforcer: true
			}
		},
		backers: []
	}
};