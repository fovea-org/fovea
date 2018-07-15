import {IPreCompileConfiguration} from "./i-pre-compile-configuration";

export const preCompileConfiguration: IPreCompileConfiguration = {
	templateName: "template",
	stylesName: "styles",
	propDecoratorName: "prop",
	templateSrcDecoratorName: "templateSrc",
	styleSrcDecoratorName: "styleSrc",
	setOnHostDecoratorName: "setOnHost",
	emitDecoratorName: "emit",
	hostListenerDecoratorName: "listener",
	dependsOnDecoratorName: "dependsOn",
	onBecameVisibleDecoratorName: "onBecameVisible",
	onBecameInvisibleDecoratorName: "onBecameInvisible",
	onChildrenAddedDecoratorName: "onChildrenAdded",
	onChildrenRemovedDecoratorName: "onChildrenRemoved",
	onChangeDecoratorName: "onChange",
	selectorDecoratorName: "selector",
	customAttributeDecoratorName: "customAttribute",
	hostAttributesDecoratorName: "hostAttributes"
};