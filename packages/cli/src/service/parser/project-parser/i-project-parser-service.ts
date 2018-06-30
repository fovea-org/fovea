import {IProjectParserServiceOptions} from "./i-project-parser-service-options";
import {IProject} from "./i-project";
import {IObserver} from "../../../observable/i-observer";
import {ISubscriber} from "../../../observable/i-subscriber";

export interface IProjectParserService {
	parse (options: IProjectParserServiceOptions, subscriber: ISubscriber<IProject>): IObserver;
}