import {Optional} from "../../optional/optional";
import {Json} from "../../json/json";

// These are the expressions we work with within fovea-lib
export declare type HostIdentifier = string;
export declare type ForeignIdentifier = string;
export declare type ExpressionIsAsync = boolean;
export declare type Expression = [(_host: Json, extra?: Json) => Optional<Json>, HostIdentifier[]];