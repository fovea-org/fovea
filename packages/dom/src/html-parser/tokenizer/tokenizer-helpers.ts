import {DECODE_MAP} from "./decode-map";

/**
 * A function that can decode the given codePoint
 * @param {number} codePoint
 * @returns {string}
 */
export function decodeCodePoint (codePoint: number): string {
	const _0xD800 = 0xD800;
	const _0xDFFF = 0xDFFF;
	const _0x10FFFF = 0x10FFFF;
	const _0xFFFF = 0xFFFF;
	const _0x10000 = 0x10000;
	const _0x3FF = 0x3FF;
	const _0xDC00 = 0xDC00;

	if ((codePoint >= _0xD800 && codePoint <= _0xDFFF) || codePoint > _0x10FFFF) {
		return "\uFFFD";
	}

	if (codePoint in DECODE_MAP) {
		codePoint = DECODE_MAP[codePoint];
	}

	let output = "";

	if (codePoint > _0xFFFF) {
		codePoint -= _0x10000;
		output += String.fromCharCode(codePoint >>> 10 & _0x3FF | _0xD800);
		codePoint = _0xDC00 | codePoint & _0x3FF;
	}

	output += String.fromCharCode(codePoint);
	return output;
}

/**
 * Returns true if the provided character is whitespace
 * @param {string} char
 * @returns {boolean}
 */
export function isWhitespace (char: string) {
	return char === " " || char === "\n" || char === "\t" || char === "\f" || char === "\r";
}