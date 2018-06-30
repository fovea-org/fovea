import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {TemplateResult} from "../../template/template-result/template-result/template-result";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";

export declare type UpgradedHostsMap = WeakMultiMap<IFoveaHost|ICustomAttribute, TemplateResult>;