export interface ILifecycleHookable {
	connectedCallback? (): void|Promise<void>;
	disconnectedCallback? (): void|Promise<void>;
	attributeChangedCallback? (name: string, oldValue: string|null, newValue: string|null): void|Promise<void>;
}