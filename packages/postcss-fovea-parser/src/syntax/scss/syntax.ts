import {foveaStringify} from "../../stringify/stringify";
import {postCSSFoveaSCSSParser} from "../../parser/scss/parse-scss";

export const postCSSFoveaSCSSSyntax = {parse: postCSSFoveaSCSSParser, stringify: foveaStringify};