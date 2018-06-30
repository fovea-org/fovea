export interface IDOMAstNodeRaw {
	tag: keyof (HTMLElementTagNameMap|SVGElementTagNameMap);
	svgOrChildOfSvg: boolean;
	content?: DOMAstRaw;
	attrs?: { [key: string]: string };
}

export declare type DOMAstNodeRaw = string|IDOMAstNodeRaw;
export declare type DOMAstRaw = DOMAstNodeRaw[];