let i = 0;
let j = 0;

export const TEXT = i++;
export const BEFORE_TAG_NAME = i++; //after <
export const IN_TAG_NAME = i++;
export const IN_SELF_CLOSING_TAG = i++;
export const BEFORE_CLOSING_TAG_NAME = i++;
export const IN_CLOSING_TAG_NAME = i++;
export const AFTER_CLOSING_TAG_NAME = i++;

// attributes
export const BEFORE_ATTRIBUTE_NAME = i++;
export const IN_ATTRIBUTE_NAME = i++;
export const AFTER_ATTRIBUTE_NAME = i++;
export const BEFORE_ATTRIBUTE_VALUE = i++;
export const IN_ATTRIBUTE_VALUE_DQ = i++; // "
export const IN_ATTRIBUTE_VALUE_SQ = i++; // '
export const IN_ATTRIBUTE_VALUE_NQ = i++;

// declarations
export const BEFORE_DECLARATION = i++; // !
export const IN_DECLARATION = i++;

// processing instructions
export const IN_PROCESSING_INSTRUCTION = i++; // ?

// comments
export const BEFORE_COMMENT = i++;
export const IN_COMMENT = i++;
export const AFTER_COMMENT_1 = i++;
export const AFTER_COMMENT_2 = i++;

// cdata
export const BEFORE_CDATA_1 = i++; // [
export const BEFORE_CDATA_2 = i++; // C
export const BEFORE_CDATA_3 = i++; // D
export const BEFORE_CDATA_4 = i++; // A
export const BEFORE_CDATA_5 = i++; // T
export const BEFORE_CDATA_6 = i++; // A
export const IN_CDATA = i++; // [
export const AFTER_CDATA_1 = i++; // ]
export const AFTER_CDATA_2 = i++; // ]

// special tags
export const BEFORE_SPECIAL = i++; //S
export const BEFORE_SPECIAL_END = i++;   //S

export const BEFORE_SCRIPT_1 = i++; //C
export const BEFORE_SCRIPT_2 = i++; //R
export const BEFORE_SCRIPT_3 = i++; //I
export const BEFORE_SCRIPT_4 = i++; //P
export const BEFORE_SCRIPT_5 = i++; //T
export const AFTER_SCRIPT_1 = i++; //C
export const AFTER_SCRIPT_2 = i++; //R
export const AFTER_SCRIPT_3 = i++; //I
export const AFTER_SCRIPT_4 = i++; //P
export const AFTER_SCRIPT_5 = i++; //T

export const BEFORE_STYLE_1 = i++; //T
export const BEFORE_STYLE_2 = i++; //Y
export const BEFORE_STYLE_3 = i++; //L
export const BEFORE_STYLE_4 = i++; //E
export const AFTER_STYLE_1 = i++; //T
export const AFTER_STYLE_2 = i++; //Y
export const AFTER_STYLE_3 = i++; //L
export const AFTER_STYLE_4 = i++; //E

export const BEFORE_ENTITY = i++; //&
export const BEFORE_NUMERIC_ENTITY = i++; //#
export const IN_NAMED_ENTITY = i++;
export const IN_NUMERIC_ENTITY = i++;
export const IN_HEX_ENTITY = i++; //X

export const SPECIAL_NONE = j++;
export const SPECIAL_SCRIPT = j++;
export const SPECIAL_STYLE = j++;