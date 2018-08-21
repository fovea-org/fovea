export interface IPostCompileConfiguration {
	templateName: string;
	compilerFlagsPropName: string;
	propToAttributeMapPropName: string;
	attributeToPropMapPropName: string;
	hostElementPropName: string;
	registerChangeObserversMethodName: string;
	registerPropsMethodName: string;
	registerSetOnHostPropsMethodName: string;
	registerHostListenersMethodName: string;
	registerEmittersMethodName: string;
	registerVisibilityObserversMethodName: string;
	registerChildListObserversMethodName: string;
	registerAttributeChangeObserversMethodName: string;
	registerHostAttributesMethodName: string;
	useCSSMethodName: string;
	useTemplatesMethodName: string;
	connectTemplatesMethodName: string;
	connectCSSMethodName: string;
}