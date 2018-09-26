import {DialogAction, IOpenDialogOptions} from "./i-open-dialog-options";
import {DialogComponent} from "./dialog-component";
import {addObservableEventListener, IObserver} from "../../util/event-util";

/**
 * An event handler for 'change' events
 * @param {Function} promiseResolver
 * @param {CustomEvent} e
 * @param {IObserver} observer
 */
function changeEventHandler (promiseResolver: Function, e: CustomEvent, observer: IObserver): void {
	promiseResolver(e.detail);
	observer.unobserve();
}

/**
 * An event handler for 'state' events
 * @param {DialogComponent} dialog
 * @param {CustomEvent} e
 * @param {IObserver} observer
 */
function stateEventHandler (this: EventHandlerNonNull, dialog: DialogComponent, e: CustomEvent, observer: IObserver): void {
	if (e.detail === "closed") {
		observer.unobserve();

		if (dialog.parentNode != null) {
			dialog.parentNode.removeChild(dialog);
		}
	}
}

/**
 * An imperative way to spawn a dialog and await its result
 * @param {Partial<IOpenDialogOptions>} options
 * @returns {Promise<DialogAction>}
 */
export async function openDialog ({actions = [], scrim, target = document.body, text, title}: Partial<IOpenDialogOptions>): Promise<DialogAction> {
	return new Promise<DialogAction>(resolve => {
		const dialog = new DialogComponent();

		if (scrim != null) {
			dialog.scrim = scrim;
		}

		if (title != null) {
			const header = document.createElement("header");
			header.textContent = title;
			dialog.appendChild(header);
		}

		if (text != null) {
			const article = document.createElement("article");
			article.textContent = text;
			dialog.appendChild(article);
		}

		if (actions.length > 0) {
			const footer = document.createElement("footer");
			dialog.appendChild(footer);

			for (const {action, icon, text: actionText, elementSelector = "button-component"} of actions) {
				const button = typeof elementSelector === "string"
					? document.createElement(elementSelector)
					: new elementSelector();

				if (icon != null) {
					const {elementSelector: iconElementSelector = "icon-component", icon: iconName} = icon;
					const iconComponent = <HTMLElement&{ icon?: string }> (typeof iconElementSelector === "string"
							? document.createElement(iconElementSelector)
							: new iconElementSelector()
					);
					iconComponent.icon = iconName;
					button.appendChild(iconComponent);
				}

				if (actionText != null) {
					button.textContent = actionText;
				}
				if (action != null) {
					button.setAttribute("dialog-action", action);
				}
				footer.appendChild(button);
			}
		}

		target.appendChild(dialog);

		setTimeout(() => {
			// Listen for change events
			addObservableEventListener(dialog, "change", changeEventHandler.bind(null, resolve));
			addObservableEventListener(dialog, "state", stateEventHandler.bind(null, dialog));

			dialog.open = true;
		}, 100);
	});
}