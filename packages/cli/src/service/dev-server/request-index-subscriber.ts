import {EmptyResult} from "./empty-result";
import {IRequestIndexSubscriberResult} from "./i-request-index-subscriber-result";

export declare type RequestIndexSubscriber = (userAgent: string, root: string) => IRequestIndexSubscriberResult|EmptyResult;