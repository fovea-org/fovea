import baseConfigs from "../../shared/rollup.browser.config";
import foveaRollupPlugin from "@fovea/rollup-plugin-fovea";
import {dirname, join} from "path";
import {writeFileSync} from "fs";
import {sync} from "mkdirp";
import {Bundler} from "scss-bundle";
import packageJSON from "./package.json";

export default [
	...baseConfigs("FoveaMaterial")
		.map(({config, isFlat}) => ({
			...config,
			external: isFlat ? [] : [
				...config.external,
				...(packageJSON.dependencies == null ? [] : Object.keys(packageJSON.dependencies)),
				...(packageJSON.devDependencies == null ? [] : Object.keys(packageJSON.devDependencies))
			],
			plugins: [
				foveaRollupPlugin(),
				// Flatten and export the base .scss files to allow others to reuse the scss variables
				{
					name: "flattenBaseSass",
					async ongenerate (opts) {
						const styleDir = join(process.cwd(), "src/style");

						const bundler = new Bundler(undefined, styleDir);
						// Relative file path to project directory path.
						const result = await bundler.Bundle("./base.scss");
						const outputDir = dirname(opts.file);
						sync(outputDir);
						writeFileSync(join(outputDir, "index.scss"), result.bundledContent);
					}
				},
				...config.plugins
			]
		}))
];