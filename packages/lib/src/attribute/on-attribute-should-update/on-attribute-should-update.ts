import {ITemplateProperty} from "../../template/template-property/i-template-property";
import {setAttribute} from "../set-attribute/set-attribute";
import {FoveaHost, IType, Optional} from "@fovea/common";
import {isAnyType, isBooleanType} from "../../prop/type-for-prop-name/get-type-for-prop-name";

/**
 * Invoked when an attribute should change
 * @param {FoveaHost} host
 * @param {Element} node
 * @param {ITemplateProperty} attribute
 * @param {IType} type
 * @param {Optional<string|boolean>} newValue
 * @param {string?} propertyName
 */
export function onAttributeShouldUpdate (host: FoveaHost, node: Element, attribute: ITemplateProperty, type: IType, newValue: Optional<string|boolean>, propertyName: string|undefined): void {
	const isBoolean = isAnyType(type) && typeof newValue === "boolean" ? true : isBooleanType(type);
	setAttribute(host, node, attribute.key, newValue, isBoolean, propertyName);
}