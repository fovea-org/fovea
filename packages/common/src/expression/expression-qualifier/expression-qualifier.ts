// All evaluations starts with this
export const EXPRESSION_QUALIFIER_START = "${";

// All evaluations contains a dollar sign as the first token
export const EXPRESSION_QUALIFIER_DOLLAR_SIGN_START = "$";

// All evaluations contains a bracket as the second token
export const EXPRESSION_QUALIFIER_BRACKET_START = "{";

// All evaluations ends with this
export const EXPRESSION_QUALIFIER_END = "}";

// A regex for matching inner contents of evaluations
export const EXPRESSION_QUALIFIER = new RegExp(`\\${EXPRESSION_QUALIFIER_START}([^}]*)${EXPRESSION_QUALIFIER_END}`);

// A regex for matching inner contents of evaluations globally
export const EXPRESSION_QUALIFIER_GLOBAL = new RegExp(`\\${EXPRESSION_QUALIFIER_START}([^}]*)${EXPRESSION_QUALIFIER_END}`, "g");

// A regex for matching all contents of evaluations
export const EXPRESSION_FULL_QUALIFIER = new RegExp(`(\\${EXPRESSION_QUALIFIER_START}[^}]*${EXPRESSION_QUALIFIER_END})`);

// A regex for matching all contents of evaluations
export const EXPRESSION_FULL_QUALIFIER_GLOBAL = new RegExp(`(\\${EXPRESSION_QUALIFIER_START}[^}]*${EXPRESSION_QUALIFIER_END})`, "g");