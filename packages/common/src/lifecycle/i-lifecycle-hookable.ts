// tslint:disable:no-any

export interface IStaticLifecycleHookable {
	___registerChangeObservers? (): void;
	___registerProps? (): void;
	___registerSetOnHostProps? (): void;
	___registerListeners? (): void;
	___registerEmitters? (): void;
	___registerVisibilityObservers? (): void;
	___registerChildListObservers? (): void;
	___registerAttributeChangeObservers? (): void;
	___registerHostAttributes? (): void;
	___useCSS? (): void;
	___useTemplates? (): void;
}

export interface ILifecycleHookable {
	connectedCallback? (): any;
	disconnectedCallback? (): any;
	destroyedCallback? (): any;
	attributeChangedCallback? (name: string, oldValue: string|null, newValue: string|null): any;

	// These hooks are specific to Fovea
	___connectTemplates? (): void;
	___connectCSS? (): void;
	___connectProps? (): void;
	___connectListeners? (): void;
	___connectVisibilityObservers? (): void;
	___connectChildListObservers? (): void;
	___connectAttributeChangeObservers? (): void;
	___connectHostAttributes? (): void;
	___disposeProps? (): void;
	___disposeListeners? (): void;
	___disposeVisibilityObservers? (): void;
	___disposeCSS? (): void;
	___disposeTemplates? (): void;
	___disposeChildListObservers? (): void;
	___disposeAttributeChangeObservers? (): void;
	___disposeHostAttributes? (): void;
	___destroyTemplates? (): void;
}