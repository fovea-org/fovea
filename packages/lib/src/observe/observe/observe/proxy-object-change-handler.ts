import {ObjectChange} from "../change/change";

export declare type ProxyObjectChangeHandler<T> = (change: ObjectChange<T>) => void;