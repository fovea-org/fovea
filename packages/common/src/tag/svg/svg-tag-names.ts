export declare type SvgTagName =
	"a"|
	"audio"|
	"canvas"|
	"iframe"|
	"script"|
	"video"|
	"unknown"|
	"altGlyph"|
	"altGlyphDef"|
	"altGlyphItem"|
	"animate"|
	"animateColor"|
	"animateMotion"|
	"animateTransform"|
	"animation"|
	"circle"|
	"clipPath"|
	"color-profile"|
	"cursor"|
	"defs"|
	"desc"|
	"discard"|
	"ellipse"|
	"feBlend"|
	"feColorMatrix"|
	"feComponentTransfer"|
	"feComposite"|
	"feConvolveMatrix"|
	"feDiffuseLighting"|
	"feDisplacementMap"|
	"feDistantLight"|
	"feDropShadow"|
	"feFlood"|
	"feFuncA"|
	"feFuncB"|
	"feFuncG"|
	"feFuncR"|
	"feGaussianBlur"|
	"feImage"|
	"feMerge"|
	"feMergeNode"|
	"feMorphology"|
	"feOffset"|
	"fePointLight"|
	"feSpecularLighting"|
	"feSpotLight"|
	"feTile"|
	"feTurbulence"|
	"filter"|
	"font"|
	"font-face"|
	"font-face-format"|
	"font-face-name"|
	"font-face-src"|
	"font-face-uri"|
	"foreignObject"|
	"g"|
	"glyph"|
	"glyphRef"|
	"handler"|
	"hatch"|
	"hatchpath"|
	"hkern"|
	"image"|
	"line"|
	"linearGradient"|
	"listener"|
	"marker"|
	"mask"|
	"mesh"|
	"meshgradient"|
	"meshpatch"|
	"meshrow"|
	"metadata"|
	"missing-glyph"|
	"mpath"|
	"path"|
	"pattern"|
	"polygon"|
	"polyline"|
	"prefetch"|
	"radialGradient"|
	"rect"|
	"set"|
	"solidColor"|
	"solidcolor"|
	"stop"|
	"svg"|
	"style"|
	"switch"|
	"symbol"|
	"tbreak"|
	"text"|
	"textArea"|
	"textPath"|
	"title"|
	"tref"|
	"tspan"|
	"use"|
	"view"|
	"vkern";

/**
 * An array of all known SvgTagNames
 * @type {SvgTagName[]}
 */
const svgTagNames: SvgTagName[] = [
	"a",
	"audio",
	"canvas",
	"iframe",
	"altGlyph",
	"altGlyphDef",
	"altGlyphItem",
	"animate",
	"animateColor",
	"animateMotion",
	"animateTransform",
	"animation",
	"circle",
	"clipPath",
	"color-profile",
	"cursor",
	"defs",
	"desc",
	"discard",
	"ellipse",
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence",
	"filter",
	"font",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignObject",
	"g",
	"glyph",
	"glyphRef",
	"handler",
	"hatch",
	"hatchpath",
	"hkern",
	"image",
	"line",
	"linearGradient",
	"listener",
	"marker",
	"mask",
	"mesh",
	"meshgradient",
	"meshpatch",
	"meshrow",
	"metadata",
	"missing-glyph",
	"mpath",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"prefetch",
	"radialGradient",
	"rect",
	"set",
	"solidColor",
	"solidcolor",
	"script",
	"style",
	"stop",
	"svg",
	"switch",
	"symbol",
	"tbreak",
	"text",
	"textArea",
	"textPath",
	"title",
	"tref",
	"tspan",
	"use",
	"view",
	"vkern",
	"unknown",
	"video"
];

/**
 * The Set of all known SVG tag names
 * @type {Set<SvgTagName>}
 */
export const SVG_TAG_NAMES = new Set<SvgTagName>(svgTagNames);