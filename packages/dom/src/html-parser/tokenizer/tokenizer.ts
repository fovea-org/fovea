import {ITokenizer, ITokenizerOptions} from "./i-tokenizer";
import {AFTER_ATTRIBUTE_NAME, AFTER_CDATA_1, AFTER_CDATA_2, AFTER_CLOSING_TAG_NAME, AFTER_COMMENT_1, AFTER_COMMENT_2, AFTER_SCRIPT_1, AFTER_SCRIPT_2, AFTER_SCRIPT_3, AFTER_SCRIPT_4, AFTER_SCRIPT_5, AFTER_STYLE_1, AFTER_STYLE_2, AFTER_STYLE_3, AFTER_STYLE_4, BEFORE_ATTRIBUTE_NAME, BEFORE_ATTRIBUTE_VALUE, BEFORE_CDATA_1, BEFORE_CDATA_2, BEFORE_CDATA_3, BEFORE_CDATA_4, BEFORE_CDATA_5, BEFORE_CDATA_6, BEFORE_CLOSING_TAG_NAME, BEFORE_COMMENT, BEFORE_DECLARATION, BEFORE_ENTITY, BEFORE_NUMERIC_ENTITY, BEFORE_SCRIPT_1, BEFORE_SCRIPT_2, BEFORE_SCRIPT_3, BEFORE_SCRIPT_4, BEFORE_SCRIPT_5, BEFORE_SPECIAL, BEFORE_SPECIAL_END, BEFORE_STYLE_1, BEFORE_STYLE_2, BEFORE_STYLE_3, BEFORE_STYLE_4, BEFORE_TAG_NAME, IN_ATTRIBUTE_NAME, IN_ATTRIBUTE_VALUE_DQ, IN_ATTRIBUTE_VALUE_NQ, IN_ATTRIBUTE_VALUE_SQ, IN_CDATA, IN_CLOSING_TAG_NAME, IN_COMMENT, IN_DECLARATION, IN_HEX_ENTITY, IN_NAMED_ENTITY, IN_NUMERIC_ENTITY, IN_PROCESSING_INSTRUCTION, IN_SELF_CLOSING_TAG, IN_TAG_NAME, SPECIAL_NONE, SPECIAL_SCRIPT, SPECIAL_STYLE, TEXT} from "./tokens";
import {ITokenizerConsumer} from "./i-tokenizer-consumer";
import {decodeCodePoint, isWhitespace} from "./tokenizer-helpers";
import {XML_MAP} from "./xml-map";
import {ENTITY_MAP} from "./entity-map";
import {LEGACY_MAP} from "./legacy-map";
import {EXPRESSION_QUALIFIER_BRACKET_START, EXPRESSION_QUALIFIER_DOLLAR_SIGN_START, EXPRESSION_QUALIFIER_END, Json} from "@fovea/common";

/**
 * A Tokenizer for the HTML Parser
 */
export class Tokenizer implements ITokenizer {
	/**
	 * The max length of legacy entities
	 * @type {number}
	 */
	private static readonly MAX_LENGTH_OF_LEGACY_ENTITIES = 6;

	/**
	 * The min length of legacy entities
	 * @type {number}
	 */
	private static readonly MIN_LENGTH_OF_LEGACY_ENTITIES = 2;
	/**
	 * The beginning state
	 * @type {number}
	 * @private
	 */
	private state: number = TEXT;

	/**
	 * The amount of open brackets inside a current expression
	 * @type {number}
	 */
	private expressionBracketsDepth: number = 0;

	/**
	 * Holds true if we're currently inside an expression
	 * @type {boolean}
	 */
	private insideExpression: boolean = false;

	/**
	 * Holds true if we've seen an Expression dollar sign
	 * @type {boolean}
	 */
	private seenExpressionDollarSign: boolean = false;

	/**
	 * The beginning index
	 * @type {number}
	 * @private
	 */
	private index: number = 0;

	/**
	 * The beginning string buffer
	 * @type {string}
	 * @private
	 */
	private buffer: string = "";

	/**
	 * The start index of a section
	 * @type {number}
	 * @private
	 */
	private sectionStart: number = 0;

	/**
	 * The buffer offset
	 * @type {number}
	 * @private
	 */
	private bufferOffset: number = 0; //chars removed from _buffer

	/**
	 * The base state
	 * @type {number}
	 * @private
	 */
	private baseState = TEXT;

	/**
	 * The current special character
	 * @type {number}
	 * @private
	 */
	private special = SPECIAL_NONE;

	/**
	 * Whether or not the Tokenizer is running
	 * @type {boolean}
	 * @private
	 */
	private running: boolean = true;

	/**
	 * Whether or not the tokenizer has ended
	 * @type {boolean}
	 * @private
	 */
	private ended: boolean = false;

	/**
	 * Whether or not the Tokenizer runs in XMLMode
	 * @type {boolean}
	 * @private
	 */
	private readonly xmlMode: boolean = false;

	/**
	 * Whether or not the Tokenizer should decode entities
	 * @type {boolean}
	 * @private
	 */
	private readonly decodeEntities: boolean = false;
	/**
	 * Invoked when before a CDATA
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly stateBeforeCdata1 = this.ifElseState("C", BEFORE_CDATA_2, IN_DECLARATION);
	/**
	 * Invoked when before a CDATA
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly stateBeforeCdata2 = this.ifElseState("D", BEFORE_CDATA_3, IN_DECLARATION);
	/**
	 * Invoked when before a CDATA
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly stateBeforeCdata3 = this.ifElseState("A", BEFORE_CDATA_4, IN_DECLARATION);
	/**
	 * Invoked when before a CDATA
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly stateBeforeCdata4 = this.ifElseState("T", BEFORE_CDATA_5, IN_DECLARATION);
	/**
	 * Invoked when before a CDATA
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly stateBeforeCdata5 = this.ifElseState("A", BEFORE_CDATA_6, IN_DECLARATION);
	/**
	 * Invoked after CDATA
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly stateAfterCdata1 = this.characterState("]", AFTER_CDATA_2);
	/**
	 * Invoked before a script
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly stateBeforeScript1 = this.consumeSpecialNameChar("R", BEFORE_SCRIPT_2);
	/**
	 * Invoked before a script
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly stateBeforeScript2 = this.consumeSpecialNameChar("I", BEFORE_SCRIPT_3);
	/**
	 * Invoked before a script
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly stateBeforeScript3 = this.consumeSpecialNameChar("P", BEFORE_SCRIPT_4);
	/**
	 * Invoked before a script
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly stateBeforeScript4 = this.consumeSpecialNameChar("T", BEFORE_SCRIPT_5);
	/**
	 * Invoked after a script
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly _stateAfterScript1 = this.ifElseState("R", AFTER_SCRIPT_2, TEXT);
	/**
	 * Invoked after a script
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly _stateAfterScript2 = this.ifElseState("I", AFTER_SCRIPT_3, TEXT);
	/**
	 * Invoked after a script
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly _stateAfterScript3 = this.ifElseState("P", AFTER_SCRIPT_4, TEXT);
	/**
	 * Invoked after a script
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly _stateAfterScript4 = this.ifElseState("T", AFTER_SCRIPT_5, TEXT);
	/**
	 * Invoked before a style
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly _stateBeforeStyle1 = this.consumeSpecialNameChar("Y", BEFORE_STYLE_2);
	/**
	 * Invoked before a style
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly _stateBeforeStyle2 = this.consumeSpecialNameChar("L", BEFORE_STYLE_3);
	/**
	 * Invoked before a style
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly _stateBeforeStyle3 = this.consumeSpecialNameChar("E", BEFORE_STYLE_4);
	/**
	 * Invoked after a style
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly _stateAfterStyle1 = this.ifElseState("Y", AFTER_STYLE_2, TEXT);
	/**
	 * Invoked after a style
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly _stateAfterStyle2 = this.ifElseState("L", AFTER_STYLE_3, TEXT);
	/**
	 * Invoked after a style
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly _stateAfterStyle3 = this.ifElseState("E", AFTER_STYLE_4, TEXT);
	/**
	 * Invoked before an entity
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly _stateBeforeEntity = this.ifElseState("#", BEFORE_NUMERIC_ENTITY, IN_NAMED_ENTITY);
	/**
	 * Invoked before a numeric entity
	 * @type {(c: string) => void}
	 * @private
	 */
	private readonly _stateBeforeNumericEntity = this.ifElseState("X", IN_HEX_ENTITY, IN_NUMERIC_ENTITY);

	constructor (options: ITokenizerOptions, private readonly consumer: ITokenizerConsumer) {
		if (options != null) {
			if (options.xmlMode != null) this.xmlMode = options.xmlMode;
			if (options.decodeEntities != null) this.decodeEntities = options.decodeEntities;
		}
	}

	/**
	 * Writes a chunk to the buffer
	 * @param {string} chunk
	 */
	public write (chunk: string): void {
		if (this.ended) this.consumer.onerror(Error(".write() after done!"));

		this.buffer += chunk;
		this._parse();
	}

	/**
	 * Pauses the parser
	 */
	public pause (): void {
		this.running = false;
	}

	/**
	 * Resumes the parser
	 */
	public resume (): void {
		this.running = true;

		if (this.index < this.buffer.length) {
			this._parse();
		}
		if (this.ended) {
			this._finish();
		}
	}

	/**
	 * Invoked with the end chunk
	 */
	public end (chunk: string): void {
		if (this.ended) this.consumer.onerror(Error(".end() after done!"));
		if (chunk != null) this.write(chunk);

		this.ended = true;

		if (this.running) this._finish();
	}

	/**
	 * Resets the Tokenizer
	 */
	public reset (): void {
		Tokenizer.call(this, {xmlMode: this.xmlMode, decodeEntities: this.decodeEntities}, this.consumer);
	}

	/**
	 * Gets the absolute index
	 * @returns {number}
	 */
	public getAbsoluteIndex (): number {
		return this.bufferOffset + this.index;
	}

	/**
	 * Starts parsing
	 * @private
	 */
	private _parse (): void {
		while (this.index < this.buffer.length && this.running) {
			const c = this.buffer.charAt(this.index);

			if (this.seenExpressionDollarSign) {
				if (c === EXPRESSION_QUALIFIER_BRACKET_START) {
					this.insideExpression = true;
				}
			}

			else if (c === EXPRESSION_QUALIFIER_DOLLAR_SIGN_START) {
				this.seenExpressionDollarSign = true;
			}

			if (this.insideExpression) {
				if (c === EXPRESSION_QUALIFIER_BRACKET_START) {
					this.expressionBracketsDepth++;
				}

				else if (c === EXPRESSION_QUALIFIER_END) {
					this.expressionBracketsDepth--;
					if (this.expressionBracketsDepth === 0) {
						this.insideExpression = false;
						this.seenExpressionDollarSign = false;
					}
				}
			}

			else {
				if (this.state === TEXT) {
					this._stateText(c);
				} else if (this.state === BEFORE_TAG_NAME) {
					this._stateBeforeTagName(c);
				} else if (this.state === IN_TAG_NAME) {
					this._stateInTagName(c);
				} else if (this.state === BEFORE_CLOSING_TAG_NAME) {
					this._stateBeforeCloseingTagName(c);
				} else if (this.state === IN_CLOSING_TAG_NAME) {
					this._stateInCloseingTagName(c);
				} else if (this.state === AFTER_CLOSING_TAG_NAME) {
					this._stateAfterCloseingTagName(c);
				} else if (this.state === IN_SELF_CLOSING_TAG) {
					this._stateInSelfClosingTag(c);
				}

				/*
				*	attributes
				*/
				else if (this.state === BEFORE_ATTRIBUTE_NAME) {
					this._stateBeforeAttributeName(c);
				} else if (this.state === IN_ATTRIBUTE_NAME) {
					this._stateInAttributeName(c);
				} else if (this.state === AFTER_ATTRIBUTE_NAME) {
					this._stateAfterAttributeName(c);
				} else if (this.state === BEFORE_ATTRIBUTE_VALUE) {
					this._stateBeforeAttributeValue(c);
				} else if (this.state === IN_ATTRIBUTE_VALUE_DQ) {
					this._stateInAttributeValueDoubleQuotes(c);
				} else if (this.state === IN_ATTRIBUTE_VALUE_SQ) {
					this._stateInAttributeValueSingleQuotes(c);
				} else if (this.state === IN_ATTRIBUTE_VALUE_NQ) {
					this._stateInAttributeValueNoQuotes(c);
				}

				/*
				*	declarations
				*/
				else if (this.state === BEFORE_DECLARATION) {
					this._stateBeforeDeclaration(c);
				} else if (this.state === IN_DECLARATION) {
					this._stateInDeclaration(c);
				}

				/*
				*	processing instructions
				*/
				else if (this.state === IN_PROCESSING_INSTRUCTION) {
					this._stateInProcessingInstruction(c);
				}

				/*
				*	comments
				*/
				else if (this.state === BEFORE_COMMENT) {
					this._stateBeforeComment(c);
				} else if (this.state === IN_COMMENT) {
					this._stateInComment(c);
				} else if (this.state === AFTER_COMMENT_1) {
					this._stateAfterComment1(c);
				} else if (this.state === AFTER_COMMENT_2) {
					this._stateAfterComment2(c);
				}

				/*
				*	cdata
				*/
				else if (this.state === BEFORE_CDATA_1) {
					this.stateBeforeCdata1(c);
				} else if (this.state === BEFORE_CDATA_2) {
					this.stateBeforeCdata2(c);
				} else if (this.state === BEFORE_CDATA_3) {
					this.stateBeforeCdata3(c);
				} else if (this.state === BEFORE_CDATA_4) {
					this.stateBeforeCdata4(c);
				} else if (this.state === BEFORE_CDATA_5) {
					this.stateBeforeCdata5(c);
				} else if (this.state === BEFORE_CDATA_6) {
					this._stateBeforeCdata6(c);
				} else if (this.state === IN_CDATA) {
					this._stateInCdata(c);
				} else if (this.state === AFTER_CDATA_1) {
					this.stateAfterCdata1(c);
				} else if (this.state === AFTER_CDATA_2) {
					this._stateAfterCdata2(c);
				}

				/*
				* special tags
				*/
				else if (this.state === BEFORE_SPECIAL) {
					this._stateBeforeSpecial(c);
				} else if (this.state === BEFORE_SPECIAL_END) {
					this._stateBeforeSpecialEnd(c);
				}

				/*
				* script
				*/
				else if (this.state === BEFORE_SCRIPT_1) {
					this.stateBeforeScript1(c);
				} else if (this.state === BEFORE_SCRIPT_2) {
					this.stateBeforeScript2(c);
				} else if (this.state === BEFORE_SCRIPT_3) {
					this.stateBeforeScript3(c);
				} else if (this.state === BEFORE_SCRIPT_4) {
					this.stateBeforeScript4(c);
				} else if (this.state === BEFORE_SCRIPT_5) {
					this._stateBeforeScript5(c);
				}

				else if (this.state === AFTER_SCRIPT_1) {
					this._stateAfterScript1(c);
				} else if (this.state === AFTER_SCRIPT_2) {
					this._stateAfterScript2(c);
				} else if (this.state === AFTER_SCRIPT_3) {
					this._stateAfterScript3(c);
				} else if (this.state === AFTER_SCRIPT_4) {
					this._stateAfterScript4(c);
				} else if (this.state === AFTER_SCRIPT_5) {
					this._stateAfterScript5(c);
				}

				/*
				* style
				*/
				else if (this.state === BEFORE_STYLE_1) {
					this._stateBeforeStyle1(c);
				} else if (this.state === BEFORE_STYLE_2) {
					this._stateBeforeStyle2(c);
				} else if (this.state === BEFORE_STYLE_3) {
					this._stateBeforeStyle3(c);
				} else if (this.state === BEFORE_STYLE_4) {
					this._stateBeforeStyle4(c);
				}

				else if (this.state === AFTER_STYLE_1) {
					this._stateAfterStyle1(c);
				} else if (this.state === AFTER_STYLE_2) {
					this._stateAfterStyle2(c);
				} else if (this.state === AFTER_STYLE_3) {
					this._stateAfterStyle3(c);
				} else if (this.state === AFTER_STYLE_4) {
					this._stateAfterStyle4(c);
				}

				/*
				* entities
				*/
				else if (this.state === BEFORE_ENTITY) {
					this._stateBeforeEntity(c);
				} else if (this.state === BEFORE_NUMERIC_ENTITY) {
					this._stateBeforeNumericEntity(c);
				} else if (this.state === IN_NAMED_ENTITY) {
					this._stateInNamedEntity(c);
				} else if (this.state === IN_NUMERIC_ENTITY) {
					this._stateInNumericEntity(c);
				} else if (this.state === IN_HEX_ENTITY) {
					this._stateInHexEntity(c);
				}

				else {
					this.consumer.onerror(Error("unknown _state"), this.state);
				}
			}

			this.index++;
		}

		this._cleanup();
	}

	/**
	 * Invoked when inside some text
	 * @param {string} char
	 * @private
	 */
	private _stateText (char: string): void {
		if (char === "<") {
			if (this.index > this.sectionStart) {
				this.consumer.ontext(this._getSection());
			}
			this.state = BEFORE_TAG_NAME;
			this.sectionStart = this.index;
		}

		else if (this.decodeEntities && this.special === SPECIAL_NONE && char === "&") {
			if (this.index > this.sectionStart) {
				this.consumer.ontext(this._getSection());
			}
			this.baseState = TEXT;
			this.state = BEFORE_ENTITY;
			this.sectionStart = this.index;
		}
	}

	/**
	 * Invoked when before a tag name
	 * @param {string} char
	 * @private
	 */
	private _stateBeforeTagName (char: string): void {
		if (char === "/") {
			this.state = BEFORE_CLOSING_TAG_NAME;
		} else if (char === "<") {
			this.consumer.ontext(this._getSection());
			this.sectionStart = this.index;
		} else if (char === ">" || this.special !== SPECIAL_NONE || isWhitespace(char) || !isNaN(parseInt(char))) {
			this.state = TEXT;
		} else if (char === "!") {
			this.state = BEFORE_DECLARATION;
			this.sectionStart = this.index + 1;
		} else if (char === "?") {
			this.state = IN_PROCESSING_INSTRUCTION;
			this.sectionStart = this.index + 1;
		} else {
			this.state = (!this.xmlMode && (char === "s" || char === "S")) ?
				BEFORE_SPECIAL : IN_TAG_NAME;
			this.sectionStart = this.index;
		}
	}

	/**
	 * Invoked when inside a tag name
	 * @param {string} char
	 * @private
	 */
	private _stateInTagName (char: string): void {
		if (char === "/" || char === ">" || isWhitespace(char)) {
			this._emitToken("onopentagname");
			this.state = BEFORE_ATTRIBUTE_NAME;
			this.index--;
		}
	}

	/**
	 * Invoked when before a closing tag name
	 * @param {string} char
	 * @private
	 */
	private _stateBeforeCloseingTagName (char: string): void {
		if (isWhitespace(char)) {
		}
		else if (char === ">") {
			this.state = TEXT;
		} else if (this.special !== SPECIAL_NONE) {
			if (char === "s" || char === "S") {
				this.state = BEFORE_SPECIAL_END;
			} else {
				this.state = TEXT;
				this.index--;
			}
		} else {
			this.state = IN_CLOSING_TAG_NAME;
			this.sectionStart = this.index;
		}
	}

	/**
	 * Invoked when inside a closing tagname
	 * @param {string} char
	 */
	private _stateInCloseingTagName (char: string): void {
		if (char === ">" || isWhitespace(char)) {
			this._emitToken("onclosetag");
			this.state = AFTER_CLOSING_TAG_NAME;
			this.index--;
		}
	}

	/**
	 * Invoked when inside a closing tag name
	 * @param {string} char
	 * @private
	 */
	private _stateAfterCloseingTagName (char: string): void {
		//skip everything until ">"
		if (char === ">") {
			this.state = TEXT;
			this.sectionStart = this.index + 1;
		}
	}

	/**
	 * Invoked when before an attribute name
	 * @param {string} char
	 * @private
	 */
	private _stateBeforeAttributeName (char: string): void {
		if (char === ">") {
			this.consumer.onopentagend();
			this.state = TEXT;
			this.sectionStart = this.index + 1;
		} else if (char === "/") {
			this.state = IN_SELF_CLOSING_TAG;
		} else if (!isWhitespace(char)) {
			this.state = IN_ATTRIBUTE_NAME;
			this.sectionStart = this.index;
		}
	}

	/**
	 * Invoked when in a self-closing tag
	 * @param {string} char
	 * @private
	 */
	private _stateInSelfClosingTag (char: string): void {
		if (char === ">") {
			this.consumer.onselfclosingtag();
			this.state = TEXT;
			this.sectionStart = this.index + 1;
		} else if (!isWhitespace(char)) {
			this.state = BEFORE_ATTRIBUTE_NAME;
			this.index--;
		}
	}

	/**
	 * Invoked when inside an attribute name
	 * @param {string} char
	 * @private
	 */
	private _stateInAttributeName (char: string): void {
		if (char === "=" || char === "/" || char === ">" || isWhitespace(char)) {
			this.consumer.onattribname(this._getSection());
			this.sectionStart = -1;
			this.state = AFTER_ATTRIBUTE_NAME;
			this.index--;
		}
	}

	/**
	 * Invoked after an attribute name
	 * @param {string} char
	 * @private
	 */
	private _stateAfterAttributeName (char: string): void {
		if (char === "=") {
			this.state = BEFORE_ATTRIBUTE_VALUE;
		} else if (char === "/" || char === ">") {
			this.consumer.onattribend();
			this.state = BEFORE_ATTRIBUTE_NAME;
			this.index--;
		} else if (!isWhitespace(char)) {
			this.consumer.onattribend();
			this.state = IN_ATTRIBUTE_NAME;
			this.sectionStart = this.index;
		}
	}

	/**
	 * Invoked before the value of an attribute
	 * @param {string} char
	 * @private
	 */
	private _stateBeforeAttributeValue (char: string): void {
		if (char === "\"") {
			this.state = IN_ATTRIBUTE_VALUE_DQ;
			this.sectionStart = this.index + 1;
		} else if (char === "'") {
			this.state = IN_ATTRIBUTE_VALUE_SQ;
			this.sectionStart = this.index + 1;
		} else if (!isWhitespace(char)) {
			this.state = IN_ATTRIBUTE_VALUE_NQ;
			this.sectionStart = this.index;
			this.index--; //reconsume token
		}
	}

	/**
	 * Invoked when at double quotes of an attribute value
	 * @param {string} char
	 * @private
	 */
	private _stateInAttributeValueDoubleQuotes (char: string): void {
		if (char === "\"") {
			this._emitToken("onattribdata");
			this.consumer.onattribend();
			this.state = BEFORE_ATTRIBUTE_NAME;
		} else if (this.decodeEntities && char === "&") {
			this._emitToken("onattribdata");
			this.baseState = this.state;
			this.state = BEFORE_ENTITY;
			this.sectionStart = this.index;
		}
	}

	/**
	 * Invoked when at single quotes of an attribute value
	 * @param {string} char
	 * @private
	 */
	private _stateInAttributeValueSingleQuotes (char: string): void {
		if (char === "'") {
			this._emitToken("onattribdata");
			this.consumer.onattribend();
			this.state = BEFORE_ATTRIBUTE_NAME;
		} else if (this.decodeEntities && char === "&") {
			this._emitToken("onattribdata");
			this.baseState = this.state;
			this.state = BEFORE_ENTITY;
			this.sectionStart = this.index;
		}
	}

	/**
	 * Invoked when at an attribute value and there are no quotes around it
	 * @param {string} char
	 * @private
	 */
	private _stateInAttributeValueNoQuotes (char: string): void {
		if (isWhitespace(char) || char === ">") {
			this._emitToken("onattribdata");
			this.consumer.onattribend();
			this.state = BEFORE_ATTRIBUTE_NAME;
			this.index--;
		} else if (this.decodeEntities && char === "&") {
			this._emitToken("onattribdata");
			this.baseState = this.state;
			this.state = BEFORE_ENTITY;
			this.sectionStart = this.index;
		}
	}

	/**
	 * Invoked before a declaration
	 * @param {string} char
	 * @private
	 */
	private _stateBeforeDeclaration (char: string): void {
		this.state = char === "[" ? BEFORE_CDATA_1 :
			char === "-" ? BEFORE_COMMENT :
				IN_DECLARATION;
	}

	/**
	 * Invoked when inside a declaration
	 * @param {string} char
	 * @private
	 */
	private _stateInDeclaration (char: string): void {
		if (char === ">") {
			this.consumer.ondeclaration(this._getSection());
			this.state = TEXT;
			this.sectionStart = this.index + 1;
		}
	}

	/**
	 * Invoked when in a processing instruction
	 * @param {string} char
	 * @private
	 */
	private _stateInProcessingInstruction (char: string): void {
		if (char === ">") {
			this.consumer.onprocessinginstruction(this._getSection());
			this.state = TEXT;
			this.sectionStart = this.index + 1;
		}
	}

	/**
	 * Invoked before a comment
	 * @param {string} char
	 * @private
	 */
	private _stateBeforeComment (char: string): void {
		if (char === "-") {
			this.state = IN_COMMENT;
			this.sectionStart = this.index + 1;
		} else {
			this.state = IN_DECLARATION;
		}
	}

	/**
	 * Invoked when inside of a comment
	 * @param {string} char
	 * @private
	 */
	private _stateInComment (char: string): void {
		if (char === "-") this.state = AFTER_COMMENT_1;
	}

	/**
	 * Invoked after a comment
	 * @param {string} char
	 * @private
	 */
	private _stateAfterComment1 (char: string): void {
		if (char === "-") {
			this.state = AFTER_COMMENT_2;
		} else {
			this.state = IN_COMMENT;
		}
	}

	/**
	 * Invoked after a comment
	 * @param {string} char
	 * @private
	 */
	private _stateAfterComment2 (char: string): void {
		if (char === ">") {
			//remove 2 trailing chars
			this.consumer.oncomment(this.buffer.substring(this.sectionStart, this.index - 2));
			this.state = TEXT;
			this.sectionStart = this.index + 1;
		} else if (char !== "-") {
			this.state = IN_COMMENT;
		}
		// else: stay in AFTER_COMMENT_2 (`--->`)
	}

	/**
	 * Invoked when before a CDATA
	 * @param {string} char
	 * @private
	 */
	private _stateBeforeCdata6 (char: string): void {
		if (char === "[") {
			this.state = IN_CDATA;
			this.sectionStart = this.index + 1;
		} else {
			this.state = IN_DECLARATION;
			this.index--;
		}
	}

	/**
	 * Invoked when inside CDATA
	 * @param {string} char
	 * @private
	 */
	private _stateInCdata (char: string): void {
		if (char === "]") this.state = AFTER_CDATA_1;
	}

	/**
	 * Invoked after CDATA
	 * @param {string} char
	 * @private
	 */
	private _stateAfterCdata2 (char: string): void {
		if (char === ">") {
			//remove 2 trailing chars
			this.consumer.oncdata(this.buffer.substring(this.sectionStart, this.index - 2));
			this.state = TEXT;
			this.sectionStart = this.index + 1;
		} else if (char !== "]") {
			this.state = IN_CDATA;
		}
		//else: stay in AFTER_CDATA_2 (`]]]>`)
	}

	/**
	 * Invoked before a special character
	 * @param {string} char
	 * @private
	 */
	private _stateBeforeSpecial (char: string): void {
		if (char === "c" || char === "C") {
			this.state = BEFORE_SCRIPT_1;
		} else if (char === "t" || char === "T") {
			this.state = BEFORE_STYLE_1;
		} else {
			this.state = IN_TAG_NAME;
			this.index--; //consume the token again
		}
	}

	/**
	 * Invoked before a special character ends
	 * @param {string} c
	 * @private
	 */
	private _stateBeforeSpecialEnd (c: string): void {
		if (this.special === SPECIAL_SCRIPT && (c === "c" || c === "C")) {
			this.state = AFTER_SCRIPT_1;
		} else if (this.special === SPECIAL_STYLE && (c === "t" || c === "T")) {
			this.state = AFTER_STYLE_1;
		}
		else this.state = TEXT;
	}

	/**
	 * Invoked before a script
	 * @param {string} char
	 * @private
	 */
	private _stateBeforeScript5 (char: string): void {
		if (char === "/" || char === ">" || isWhitespace(char)) {
			this.special = SPECIAL_SCRIPT;
		}
		this.state = IN_TAG_NAME;
		this.index--; //consume the token again
	}

	/**
	 * Invoked after a script
	 * @param {string} char
	 * @private
	 */
	private _stateAfterScript5 (char: string): void {
		const SCRIPT_LENGTH = 6;
		if (char === ">" || isWhitespace(char)) {
			this.special = SPECIAL_NONE;
			this.state = IN_CLOSING_TAG_NAME;
			this.sectionStart = this.index - SCRIPT_LENGTH;
			this.index--; //reconsume the token
		}
		else this.state = TEXT;
	}

	/**
	 * Invoked before a style
	 * @param {string} char
	 * @private
	 */
	private _stateBeforeStyle4 (char: string): void {
		if (char === "/" || char === ">" || isWhitespace(char)) {
			this.special = SPECIAL_STYLE;
		}
		this.state = IN_TAG_NAME;
		this.index--; //consume the token again
	}

	/**
	 * Invoked after a style
	 * @param {string} char
	 * @private
	 */
	private _stateAfterStyle4 (char: string): void {
		const MINUS_OFFSET = 5;
		if (char === ">" || isWhitespace(char)) {
			this.special = SPECIAL_NONE;
			this.state = IN_CLOSING_TAG_NAME;
			this.sectionStart = this.index - MINUS_OFFSET;
			this.index--; //reconsume the token
		}
		else this.state = TEXT;
	}

	/**
	 * Parses a Named Entity
	 * @private
	 */
	private _parseNamedEntityStrict (): void {
		//offset = 1
		if (this.sectionStart + 1 < this.index) {
			const entity = this.buffer.substring(this.sectionStart + 1, this.index);
			const map = this.xmlMode ? XML_MAP : ENTITY_MAP;

			if (map.hasOwnProperty(entity)) {
				this._emitPartial(map[entity]);
				this.sectionStart = this.index + 1;
			}
		}
	}

	/**
	 * Parses a Legacy Entity
	 * @private
	 */
	private _parseLegacyEntity (): void {
		const start = this.sectionStart + 1;
		let limit = this.index - start;

		// The max length of legacy entities is 6
		if (limit > Tokenizer.MAX_LENGTH_OF_LEGACY_ENTITIES) {
			limit = Tokenizer.MAX_LENGTH_OF_LEGACY_ENTITIES;
		}

		// The min length of legacy entities is 2
		while (limit >= Tokenizer.MIN_LENGTH_OF_LEGACY_ENTITIES) {
			const entity = this.buffer.substr(start, limit);

			if (LEGACY_MAP.hasOwnProperty(entity)) {
				this._emitPartial(LEGACY_MAP[entity]);
				this.sectionStart += limit + 1;
				return;
			} else {
				limit--;
			}
		}
	}

	/**
	 * Invoked when inside a NamedEntity
	 * @param {string} char
	 * @private
	 */
	private _stateInNamedEntity (char: string): void {
		if (char === ";") {
			this._parseNamedEntityStrict();
			if (this.sectionStart + 1 < this.index && !this.xmlMode) {
				this._parseLegacyEntity();
			}
			this.state = this.baseState;
		} else if ((char < "a" || char > "z") && (char < "A" || char > "Z") && (char < "0" || char > "9")) {
			if (this.xmlMode) {
			}
			else if (this.sectionStart + 1 === this.index) {
			}
			else if (this.baseState !== TEXT) {
				if (char !== "=") {
					this._parseNamedEntityStrict();
				}
			} else {
				this._parseLegacyEntity();
			}

			this.state = this.baseState;
			this.index--;
		}
	}

	/**
	 * Decodes a numeric entity
	 * @param {number} offset
	 * @param {number} base
	 * @private
	 */
	private _decodeNumericEntity (offset: number, base: number): void {
		const sectionStart = this.sectionStart + offset;

		if (sectionStart !== this.index) {
			//parse entity
			const entity = this.buffer.substring(sectionStart, this.index);
			const parsed = parseInt(entity, base);

			this._emitPartial(decodeCodePoint(parsed));
			this.sectionStart = this.index;
		} else {
			this.sectionStart--;
		}

		this.state = this.baseState;
	}

	/**
	 * Invoked when inside a NumericEntity
	 * @param {string} char
	 * @private
	 */
	private _stateInNumericEntity (char: string): void {
		if (char === ";") {
			this._decodeNumericEntity(2, 10);
			this.sectionStart++;
		} else if (char < "0" || char > "9") {
			if (!this.xmlMode) {
				this._decodeNumericEntity(2, 10);
			} else {
				this.state = this.baseState;
			}
			this.index--;
		}
	}

	/**
	 * Invoked when inside a Hex entity
	 * @param {string} char
	 * @private
	 */
	private _stateInHexEntity (char: string): void {
		const _3 = 3;
		const _16 = 16;

		if (char === ";") {
			this._decodeNumericEntity(_3, _16);
			this.sectionStart++;
		} else if ((char < "a" || char > "f") && (char < "A" || char > "F") && (char < "0" || char > "9")) {
			if (!this.xmlMode) {
				this._decodeNumericEntity(_3, _16);
			} else {
				this.state = this.baseState;
			}
			this.index--;
		}
	}

	/**
	 * Performs a cleanup
	 * @private
	 */
	private _cleanup (): void {
		if (this.sectionStart < 0) {
			this.buffer = "";
			this.bufferOffset += this.index;
			this.index = 0;
		} else if (this.running) {
			if (this.state === TEXT) {
				if (this.sectionStart !== this.index) {
					this.consumer.ontext(this.buffer.substr(this.sectionStart));
				}
				this.buffer = "";
				this.bufferOffset += this.index;
				this.index = 0;
			} else if (this.sectionStart === this.index) {
				//the section just started
				this.buffer = "";
				this.bufferOffset += this.index;
				this.index = 0;
			} else {
				//remove everything unnecessary
				this.buffer = this.buffer.substr(this.sectionStart);
				this.index -= this.sectionStart;
				this.bufferOffset += this.sectionStart;
			}

			this.sectionStart = 0;
		}
	}

	/**
	 * Finishes the parsing
	 * @private
	 */
	private _finish (): void {
		//if there is remaining data, emit it in a reasonable way
		if (this.sectionStart < this.index) {
			this._handleTrailingData();
		}

		this.consumer.onend();
	}

	/**
	 * Handles trailing data
	 * @private
	 */
	private _handleTrailingData (): void {
		const _2 = 2;
		const _3 = 3;
		const _10 = 10;
		const _16 = 16;
		const data = this.buffer.substr(this.sectionStart);

		if (this.state === IN_CDATA || this.state === AFTER_CDATA_1 || this.state === AFTER_CDATA_2) {
			this.consumer.oncdata(data);
		} else if (this.state === IN_COMMENT || this.state === AFTER_COMMENT_1 || this.state === AFTER_COMMENT_2) {
			this.consumer.oncomment(data);
		} else if (this.state === IN_NAMED_ENTITY && !this.xmlMode) {
			this._parseLegacyEntity();
			if (this.sectionStart < this.index) {
				this.state = this.baseState;
				this._handleTrailingData();
			}
		} else if (this.state === IN_NUMERIC_ENTITY && !this.xmlMode) {
			this._decodeNumericEntity(_2, _10);
			if (this.sectionStart < this.index) {
				this.state = this.baseState;
				this._handleTrailingData();
			}
		} else if (this.state === IN_HEX_ENTITY && !this.xmlMode) {
			this._decodeNumericEntity(_3, _16);
			if (this.sectionStart < this.index) {
				this.state = this.baseState;
				this._handleTrailingData();
			}
		} else if (
			this.state !== IN_TAG_NAME &&
			this.state !== BEFORE_ATTRIBUTE_NAME &&
			this.state !== BEFORE_ATTRIBUTE_VALUE &&
			this.state !== AFTER_ATTRIBUTE_NAME &&
			this.state !== IN_ATTRIBUTE_NAME &&
			this.state !== IN_ATTRIBUTE_VALUE_SQ &&
			this.state !== IN_ATTRIBUTE_VALUE_DQ &&
			this.state !== IN_ATTRIBUTE_VALUE_NQ &&
			this.state !== IN_CLOSING_TAG_NAME
		) {
			this.consumer.ontext(data);
		}
		//else, ignore remaining data
		//TODO add a way to remove current tag
	}

	/**
	 * Gets the current section
	 * @returns {string}
	 * @private
	 */
	private _getSection (): string {
		return this.buffer.substring(this.sectionStart, this.index);
	}

	/**
	 * Emits the given token
	 * @param {string} name
	 * @private
	 */
	private _emitToken (name: string): void {
		(<Json>this).consumer[name](this._getSection());
		this.sectionStart = -1;
	}

	/**
	 * Emits a partial value
	 * @param {string} value
	 * @private
	 */
	private _emitPartial (value: string): void {
		if (this.baseState !== TEXT) {
			this.consumer.onattribdata(value);
		} else {
			this.consumer.ontext(value);
		}
	}

	/**
	 * Returns a function that can update the character state
	 * @param {string} char
	 * @param {number} SUCCESS
	 * @returns {(c: string) => void}
	 */
	private characterState (char: string, SUCCESS: number): (c: string) => void {
		return (c: string): void => {
			if (c === char) this.state = SUCCESS;
		};
	}

	/**
	 * Returns a function that can update the state
	 * @param {string} upper
	 * @param {number} SUCCESS
	 * @param {number} FAILURE
	 * @returns {(c: string) => void}
	 */
	private ifElseState (upper: string, SUCCESS: number, FAILURE: number): (c: string) => void {
		const lower = upper.toLowerCase();

		if (upper === lower) {

			return (c: string) => {
				if (c === lower) {
					this.state = SUCCESS;
				} else {
					this.state = FAILURE;
					this.index--;
				}
			};
		} else {

			return (c: string) => {
				if (c === lower || c === upper) {
					this.state = SUCCESS;
				} else {
					this.state = FAILURE;
					this.index--;
				}
			};
		}
	}

	/**
	 * Returns a function that can consume a SpecialNameChar
	 * @param {string} upper
	 * @param {number} NEXT_STATE
	 * @returns {(c: string) => void}
	 */
	private consumeSpecialNameChar (upper: string, NEXT_STATE: number): (c: string) => void {
		const lower = upper.toLowerCase();

		return (c: string) => {
			if (c === lower || c === upper) {
				this.state = NEXT_STATE;
			} else {
				this.state = IN_TAG_NAME;
				this.index--; //consume the token again
			}
		};
	}
}