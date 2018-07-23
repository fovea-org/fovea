import {IHostAttributesHelperMap} from "../host-attributes-helper-map/i-host-attributes-helper-map";
import {IFoveaHost, ICustomAttribute} from "@fovea/common";
import {IObserver} from "../../observe/i-observer";
import {IDestroyable} from "../../destroyable/i-destroyable";

export declare type HostAttributesCallback = (host: IFoveaHost|ICustomAttribute, helpers: IHostAttributesHelperMap) => (IObserver|(IObserver & IDestroyable))[];