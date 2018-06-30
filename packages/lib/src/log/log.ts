const bgColor = "#3498db";
const color = "white";
const styling = `background: ${bgColor}; color: ${color}; font-weight: bold; padding: 2px 0.5em; border-radius: 0.5em;`;
const prefix = "Fovea";
const operator = "%c";

// tslint:disable:no-any

/**
 * Logs the given messages
 * @param messages
 */
export function log (...messages: any[]): void {
	console.log(`${operator}${prefix}`, styling, "", ...messages);
}