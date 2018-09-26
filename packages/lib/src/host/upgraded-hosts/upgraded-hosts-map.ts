import {FoveaHost} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";
import {IDisposable} from "../../disposable/i-disposable";
import {IDestroyable} from "../../destroyable/i-destroyable";

export declare type UpgradedHostsMap = WeakMultiMap<FoveaHost, IDisposable&IDestroyable>;