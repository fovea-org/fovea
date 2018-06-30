import {Optional} from "@fovea/common";
import {Change} from "../../observe/change/change";

export declare type ExpressionChainObserverCallback<T = string> = (newValue: Optional<T>, change?: Change<T>) => void;