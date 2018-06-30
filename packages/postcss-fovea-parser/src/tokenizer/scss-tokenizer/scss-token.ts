export type SCSSTokenKind = "[" | "]" | "(" | ")" | "{" | "}" | ";" | ":" | "space" | "brackets" | "string" | "at-word" | "word" | "comment" | "expression"|"interpolation";
export type SCSSStringToken = ["string", string, number, number, number, number];
export type SCSSWordToken = ["word", string, number, number, number, number];
export type SCSSSpaceToken = ["space", string];
export type SCSSAtWordToken = ["at-word", string, number, number, number, number];
export type SCSSCommentToken = ["comment", string, number, number, number, number];
export type SCSSInlineCommentToken = ["comment", string, number, number, number, number, "inline"];
export type SCSSExpressionToken = ["expression", string, number, number, number, number];
export type SCSSBracketsToken = ["brackets", string, number, number, number, number];
export type SCSSSyntaxToken = [ "[" | "]" | "{" | "}" | ":" | ";" | "(" | ")", string, number, number];
export type SCSSToken = SCSSStringToken|SCSSWordToken|SCSSSpaceToken|SCSSBracketsToken|SCSSAtWordToken|SCSSCommentToken|SCSSSyntaxToken|SCSSExpressionToken|SCSSInlineCommentToken;