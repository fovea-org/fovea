import {IIndexHtmlGenerator} from "./i-index-html-generator";
import {TemplateFile, TemplateFileKind} from "../template-generator/template-file";
import {Generator} from "../generator";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {IFormatter} from "../../../formatter/i-formatter";

/**
 * A class that helps with generating a index.html.ts file
 */
export class IndexHtmlGenerator extends Generator implements IIndexHtmlGenerator {

	constructor (private readonly config: IBuildConfig,
							 private readonly formatter: IFormatter) {
		super();
	}

	/**
	 * Generates the index.html.ts file
	 * @returns {Promise<TemplateFile[]>}
	 */
	public async onGenerate (): Promise<TemplateFile[]> {
		// noinspection CheckTagEmptyBody
		return [
			{
				kind: TemplateFileKind.FILE,
				name: `${this.config.srcFolderName}/${this.config.indexName}.${this.config.defaultXMLScriptExtension}`,
				extension: this.config.defaultScriptExtension,
				content: this.formatter.format(`
// tslint:disable:no-default-export

import {IIndexHtmlOptions} from "@fovea/cli";
import {config} from "./config/config";
import {toHex} from "@wessberg/color";

/**
 * This will generate a index.html file for your app
 */
export default ({resource, globalStyles, polyfillContent}: IIndexHtmlOptions) => \`
<!DOCTYPE HTML>
<html lang="en">
	<head>
		<title>\${config.NPM_PACKAGE_NAME} v\${config.NPM_PACKAGE_VERSION}</title>

		<!-- Meta tags -->

		<!-- SEO -->
		<meta name="description" content="\${config.NPM_PACKAGE_DESCRIPTION}">

		<!-- Charset -->
		<meta charset="UTF-8">
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge"/>

		<!-- The theme color for the app -->
		<meta name="theme-color" content="\${toHex(resource.style.themeVariables["--color-primary"])}">

		<!-- The viewport meta tag -->
		<meta name="viewport" content="initial-scale=1, minimum-scale = 1, maximum-scale=5, user-scalable=yes, width=device-width"/>

		<!-- Mobile-friendly iOS meta tags -->
		<meta name="apple-mobile-web-app-capable" content="yes"/>
		<meta name="mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="white">
		<meta name="mobile-web-app-status-bar-style" content="white">

		<!-- Preload contents -->
		\${config.isESM()
			? \`
		<link rel="modulepreload" href="\${resource.output.chunk.main}">
		<link rel="modulepreload" href="\${resource.output.chunk.serviceWorker}">
		\`
			: \`
		<link rel="preload" href="\${resource.output.chunk.main}" as="script">
		<link rel="preload" href="\${resource.output.chunk.serviceWorker}" as="script">
		\`
		}

		<!-- This is your Web Manifest -->
		<link rel="manifest" href="\${resource.output.manifestJson}">

		<!-- This is where your App Icons will be loaded -->
		\${Object.entries(resource.output.asset.appIcon).map(([size, path]) => \`
		<link rel="icon" sizes="\${size}x\${size}" href="\${path}">
		<link rel="apple-touch-icon" sizes="\${size}x\${size}" href="\${path}">\`).join("\\n")}

		<!-- Global styles -->
		<style>
			\${globalStyles}
		</style>
	</head>
	<body>
		<!-- This is where your content to users with Javascript disabled is loaded -->
		<noscript>To use \${config.NPM_PACKAGE_NAME}, please activate Javascript</noscript>
		<!-- This is where automatic polyfills will be applied. These will cover only what the current device needs -->
		\${polyfillContent}

		<!-- This is where your main bundle is loaded -->
		\${config.isESM()
			? \`<script type="module" src="\${resource.output.chunk.main}"></script>\`
			: \`<script>SystemJS.import("\${resource.output.chunk.main}")</script>\`
		}
	</body>
</html>
\`;
				`,
					{...this.config.formatOptions, printWidth: 200, parser: "typescript"})
			}
		];
	}
}