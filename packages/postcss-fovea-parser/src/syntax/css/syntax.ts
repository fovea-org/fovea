import {foveaStringify} from "../../stringify/stringify";
import {postCSSFoveaCSSParser} from "../../parser/css/parse-css";

export const postCSSFoveaCSSSyntax = { parse: postCSSFoveaCSSParser, stringify: foveaStringify };