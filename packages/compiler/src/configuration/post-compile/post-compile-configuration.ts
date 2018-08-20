import {IPostCompileConfiguration} from "./i-post-compile-configuration";

export const postCompileConfiguration: IPostCompileConfiguration = {
	templateName: "__template",
	compilerFlagsPropName: "___compilerFlags",
	propToAttributeMapPropName: "propToAttributeMap",
	attributeToPropMapPropName: "attributeToPropMap",
	hostElementPropName: "___hostElement",
	registerChangeObserversMethodName: "___registerChangeObservers",
	registerPropsMethodName: "___registerProps",
	registerSetOnHostPropsMethodName: "___registerSetOnHostProps",
	registerHostListenersMethodName: "___registerHostListeners",
	registerEmittersMethodName: "___registerEmitters",
	registerVisibilityObserversMethodName: "___registerVisibilityObservers",
	registerChildListObserversMethodName: "___registerChildListObservers",
	registerAttributeChangeObserversMethodName: "___registerAttributeChangeObservers",
	registerHostAttributesMethodName: "___registerHostAttributes",
	useCSSMethodName: "___useCSS",
	useTemplatesMethodName: "___useTemplates"
};