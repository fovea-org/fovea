import "./services";
import {DIContainer} from "@wessberg/di";
import {ICommandContainer} from "./command/i-command-container";

DIContainer.get<ICommandContainer>()
	.run();

// Exports
export {IFoveaCliConfig} from "./fovea-cli-config/i-fovea-cli-config";
export {IResource} from "./resource/i-resource";
export {IIndexHtmlOptions} from "./index-html/i-index-html-options";