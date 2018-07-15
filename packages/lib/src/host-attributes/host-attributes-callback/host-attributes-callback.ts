import {IHostAttributesHelperMap} from "../host-attributes-helper-map/i-host-attributes-helper-map";
import {IFoveaHost, ICustomAttribute} from "@fovea/common";
import {IObserver} from "../../observe/i-observer";

export declare type HostAttributesCallback = (host: IFoveaHost|ICustomAttribute, helpers: IHostAttributesHelperMap) => IObserver[];