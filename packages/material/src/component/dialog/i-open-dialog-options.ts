export declare type DialogAction = "confirm"|"cancel";

export declare type DialogOpenState = "opening"|"open"|"closing"|"closed";

export interface IDialogAction {
	elementSelector: string|typeof HTMLElement;
	action: DialogAction;
	text: string;
	icon: {
		elementSelector: string|typeof HTMLElement;
		icon: string;
	};
}

export interface IOpenDialogOptions {
	target: Element|ShadowRoot;
	scrim: boolean;
	actions: Partial<IDialogAction>[];
	title: string;
	text: string;
}