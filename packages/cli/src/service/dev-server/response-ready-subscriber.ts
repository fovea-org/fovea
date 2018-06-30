import {Request} from "./i-request";
import {Response} from "./i-response";

export declare type ResponseReadySubscriber = (request: Request, response: Response, root: string) => void;