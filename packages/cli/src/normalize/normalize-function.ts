import {IStringifiableConfig} from "../stringify/i-stringifiable-config";
import {INormalizeOptions} from "./i-normalize-options";
import {IBuildConfig} from "../build-config/i-build-config";

export declare type NormalizeFunction<T, U = Partial<T>, J = IBuildConfig> = (options: INormalizeOptions<U, J>) => Promise<IStringifiableConfig<T>>;