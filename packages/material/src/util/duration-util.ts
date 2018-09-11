/**
 * Retrieves a proper millisecond value from the given string representing a duration
 * @param {string} durationString
 * @returns {number}
 */
export function getMsFromCSSDuration (durationString: string): number {
	const trimmed = durationString.trim();
	if (trimmed.endsWith("ms")) return parseInt(durationString);
	if (trimmed.endsWith("s")) return parseInt(durationString) * 1000;
	return parseInt(durationString);
}