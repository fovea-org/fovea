import {FoveaHost, WeakMultiMap} from "@fovea/common";
import {IDisposable} from "../../disposable/i-disposable";
import {IDestroyable} from "../../destroyable/i-destroyable";

export declare type UpgradedHostsMap = WeakMultiMap<FoveaHost, IDisposable&IDestroyable>;