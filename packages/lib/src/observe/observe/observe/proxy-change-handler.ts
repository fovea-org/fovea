import {Change} from "../change/change";

export declare type ProxyChangeHandler<T> = (change: Change<T>) => void;