import {DialogAction, IOpenDialogOptions} from "./i-open-dialog-options";
import {DialogComponent} from "./dialog-component";

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

		// Resolve the Promise when the 'change' event is emitted
		let changeHandler: EventHandlerNonNull|null = (e: CustomEvent) => {
			resolve(e.detail);
			dialog.removeEventListener("change", changeHandler!);
			changeHandler = null;
		};

		// Resolve the Promise when the 'change' event is emitted
		let stateHandler: EventHandlerNonNull|null = (e: CustomEvent) => {
			if (e.detail === "closed") {
				dialog.removeEventListener("state-changed", stateHandler!);

				if (dialog.parentNode != null) {
					dialog.parentNode.removeChild(dialog);
				}
			}

			stateHandler = null;
		};

		target.appendChild(dialog);
		setTimeout(() => dialog.open = true, 100);

		// Listen for change events
		dialog.addEventListener("change", changeHandler);
		dialog.addEventListener("state-changed", stateHandler);
	});
}