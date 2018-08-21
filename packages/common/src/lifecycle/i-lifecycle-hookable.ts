// tslint:disable:no-any

export interface ILifecycleHookable {
	connectedCallback? (): any;
	disconnectedCallback? (): any;
	destroyedCallback? (): any;
	attributeChangedCallback? (name: string, oldValue: string|null, newValue: string|null): any;

	// These hooks are specific to Fovea
	___connectTemplate? (): void;
	___connectProps? (): void;
}