import {SvgInterfaceName} from "./svg-interface-names";
import {SvgTagName} from "./svg-tag-names";

/**
 * A Map between SVG interface names and the tags that inherits from it
 * @type {Map<SvgInterfaceName, SvgTagName[]>}
 */
export const SVG_INTERFACE_NAME_TO_TAG_NAME_MAP = new Map<SvgInterfaceName, SvgTagName[]>([
	["SVGCircleElement", ["circle"]],
	["SVGClipPathElement", ["clipPath"]],
	["SVGDefsElement", ["defs"]],
	["SVGDescElement", ["desc"]],
	["SVGEllipseElement", ["ellipse"]],
	["SVGFEBlendElement", ["feBlend"]],
	["SVGFEColorMatrixElement", ["feColorMatrix"]],
	["SVGFEComponentTransferElement", ["feComponentTransfer"]],
	["SVGFECompositeElement", ["feComposite"]],
	["SVGFEConvolveMatrixElement", ["feConvolveMatrix"]],
	["SVGFEDiffuseLightingElement", ["feDiffuseLighting"]],
	["SVGFEDisplacementMapElement", ["feDisplacementMap"]],
	["SVGFEDistantLightElement", ["feDistantLight"]],
	["SVGFEFloodElement", ["feFlood"]],
	["SVGFEFuncAElement", ["feFuncA"]],
	["SVGFEFuncBElement", ["feFuncB"]],
	["SVGFEFuncGElement", ["feFuncG"]],
	["SVGFEFuncRElement", ["feFuncR"]],
	["SVGFEGaussianBlurElement", ["feGaussianBlur"]],
	["SVGFEImageElement", ["feImage"]],
	["SVGFEMergeElement", ["feMerge"]],
	["SVGFEMergeNodeElement", ["feMergeNode"]],
	["SVGFEMorphologyElement", ["feMorphology"]],
	["SVGFEOffsetElement", ["feOffset"]],
	["SVGFEPointLightElement", ["fePointLight"]],
	["SVGFESpecularLightingElement", ["feSpecularLighting"]],
	["SVGFESpotLightElement", ["feSpotLight"]],
	["SVGFETileElement", ["feTile"]],
	["SVGFETurbulenceElement", ["feTurbulence"]],
	["SVGFilterElement", ["filter"]],
	["SVGForeignObjectElement", ["foreignObject"]],
	["SVGGElement", ["g"]],
	["SVGImageElement", ["image"]],
	["SVGLineElement", ["line"]],
	["SVGLinearGradientElement", ["linearGradient"]],
	["SVGMarkerElement", ["marker"]],
	["SVGMaskElement", ["mask"]],
	["SVGMetadataElement", ["metadata"]],
	["SVGPathElement", ["path"]],
	["SVGPatternElement", ["pattern"]],
	["SVGPolygonElement", ["polygon"]],
	["SVGPolylineElement", ["polyline"]],
	["SVGRadialGradientElement", ["radialGradient"]],
	["SVGRectElement", ["rect"]],
	["SVGStopElement", ["stop"]],
	["SVGSVGElement", ["svg"]],
	["SVGSwitchElement", ["switch"]],
	["SVGSymbolElement", ["symbol"]],
	["SVGTextElement", ["text"]],
	["SVGTextPathElement", ["textPath"]],
	["SVGTSpanElement", ["tspan"]],
	["SVGUseElement", ["use"]],
	["SVGViewElement", ["view"]]
]);