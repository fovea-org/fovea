import {FoveaHost, WeakMultiMap} from "@fovea/common";
import {IDestroyable} from "../../destroyable/i-destroyable";

export declare type ConstructedHostsMap = WeakMultiMap<FoveaHost, IDestroyable>;