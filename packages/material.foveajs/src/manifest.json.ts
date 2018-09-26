// tslint:disable:no-default-export

import {IResource} from "@fovea/cli";
import {environment} from "./environment/environment";
import {toHex} from "@wessberg/color";

/**
 * Truncates the given text by the given max length
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
function truncate (text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return `${text.slice(0, (maxLength -3))}...`;
}

/**
 * This will generate a manifest.json file for your app
 */
export default (resource: IResource) => ({
	name: environment.NPM_PACKAGE_NAME,
	short_name: truncate(environment.NPM_PACKAGE_NAME, 12),
	start_url: "/",
	display: "standalone",
	orientation: "portrait",
	background_color: toHex(resource.style.themeVariables["$color-background"]),
	theme_color: toHex(resource.style.themeVariables["$color-primary"]),
	icons: Object.entries(resource.output.asset.appIcon).map(([size, path]) => ({
		src: path,
		type: "image/png",
		sizes: `${size}x${size}`
	}))
});
