import {DIContainer} from "@wessberg/di";
import {FoveaDOMHost} from "./fovea-dom/fovea-dom-host";
import {IDOMTemplator} from "./dom/dom-templator/dom-templator/i-dom-templator";
import {DOMTemplator} from "./dom/dom-templator/dom-templator/dom-templator";
import {IDOMGenerator} from "./dom/dom-generator/dom-generator/i-dom-generator";
import {DOMGenerator} from "./dom/dom-generator/dom-generator/dom-generator";
import {IDOMNodeHandler} from "./dom/dom-handler/dom-node-handler/i-dom-node-handler";
import {DOMNodeHandler} from "./dom/dom-handler/dom-node-handler/dom-node-handler";
import {IDOMHTMLElementHandler} from "./dom/dom-handler/dom-html-element-handler/i-dom-html-element-handler";
import {DOMHTMLElementHandler} from "./dom/dom-handler/dom-html-element-handler/dom-html-element-handler";
import {IDOMSVGElementHandler} from "./dom/dom-handler/dom-svg-element-handler/i-dom-svg-element-handler";
import {DOMSVGElementHandler} from "./dom/dom-handler/dom-svg-element-handler/dom-svg-element-handler";
import {IDOMUtil} from "./util/dom-util/i-dom-util";
import {DOMUtil} from "./util/dom-util/dom-util";
// @ts-ignore
import * as PostHTMLParser from "posthtml-parser";
import {IDOMASTImplementation} from "./dom/dom-ast-implementation/i-dom-ast-implementation";
import {IFoveaDOMAstGenerator} from "./dom/fovea-dom-ast-generator/i-fovea-dom-ast-generator";
import {FoveaDOMAstGenerator} from "./dom/fovea-dom-ast-generator/fovea-dom-ast-generator";
import {IFoveaDOMHost} from "./fovea-dom/i-fovea-dom-host";
import {IExpressionUtil} from "./util/expression-util/i-expression-util";
import {ExpressionUtil} from "./util/expression-util/expression-util";
import {CodeAnalyzer, ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ITokenizerConstructor} from "./html-parser/tokenizer/i-tokenizer";
import {Tokenizer} from "./html-parser/tokenizer/tokenizer";
import {IContextUtil} from "./util/context-util/i-context-util";
import {ContextUtil} from "./util/context-util/context-util";
import {IKeyValueParser} from "./service/key-value-parser/i-key-value-parser";
import {KeyValueParser} from "./service/key-value-parser/key-value-parser";
import {IKeyValueParserConfig} from "./service/key-value-parser/i-key-value-parser-config";
import {keyValueParserConfig} from "./service/key-value-parser/key-value-parser-config";

export const container = new DIContainer();

container.registerSingleton<ITokenizerConstructor>(() => Tokenizer);
container.registerSingleton<IDOMASTImplementation>(() => PostHTMLParser);
container.registerSingleton<IFoveaDOMAstGenerator, FoveaDOMAstGenerator>();
container.registerSingleton<IDOMTemplator, DOMTemplator>();
container.registerSingleton<IDOMNodeHandler, DOMNodeHandler>();
container.registerSingleton<IDOMHTMLElementHandler, DOMHTMLElementHandler>();
container.registerSingleton<IDOMSVGElementHandler, DOMSVGElementHandler>();
container.registerSingleton<IDOMGenerator, DOMGenerator>();
container.registerSingleton<IFoveaDOMHost, FoveaDOMHost>();
container.registerSingleton<IKeyValueParserConfig, IKeyValueParserConfig>(() => keyValueParserConfig);
container.registerSingleton<IKeyValueParser, KeyValueParser>();

// Utilities
container.registerSingleton<IExpressionUtil, ExpressionUtil>();
container.registerSingleton<IDOMUtil, DOMUtil>();
container.registerSingleton<IContextUtil, ContextUtil>();
container.registerSingleton<ICodeAnalyzer, CodeAnalyzer>();