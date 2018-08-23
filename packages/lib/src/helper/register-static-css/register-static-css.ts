import {addStaticCSS} from "../../css/static-css/add-static-css";

/**
 * Registers some static CSS
 * @param {string} css
 * @param {string} hash
 * @private
 */
export function ___registerStaticCSS (css: string, hash: string): void {
	addStaticCSS(css, hash);
}