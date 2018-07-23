import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";
import {IDestroyable} from "../../destroyable/i-destroyable";

export declare type ConstructedHostsMap = WeakMultiMap<IFoveaHost|ICustomAttribute, IDestroyable>;