import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";
import {IDisposable} from "../../disposable/i-disposable";

export declare type UpgradedHostsMap = WeakMultiMap<IFoveaHost|ICustomAttribute, IDisposable>;