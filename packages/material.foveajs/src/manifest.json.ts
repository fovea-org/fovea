// tslint:disable:no-default-export

import {IResource} from "@fovea/cli";
import {environment} from "./environment/environment";
import {toHex} from "@wessberg/color";

/**
 * This will generate a manifest.json file for your app
 */
export default (resource: IResource) => ({
	name: environment.NPM_PACKAGE_NAME,
	short_name: environment.NPM_PACKAGE_NAME,
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
