import {IPropertiesToAttributesMapOptions} from "./i-properties-to-attributes-map-options";

export interface IPropertiesToAttributesMapper {
	map (options: IPropertiesToAttributesMapOptions): void;
}