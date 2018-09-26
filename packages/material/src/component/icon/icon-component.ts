import {onChange, prop, styleSrc} from "@fovea/core";
import {IIcon} from "./i-icon";
import {rafScheduler} from "@fovea/scheduler";

/**
 * This component represents an Icon
 */
@styleSrc([
	"./icon-component.scss"
])
export class IconComponent extends HTMLElement {
	/**
	 * A Map between selectors for icons and HTMLTemplateElements for the SVG contents of icons
	 * @type {Map<string, HTMLTemplateElement>}
	 */
	private static readonly ICON_MAP: Map<string, HTMLTemplateElement> = new Map();

	/**
	 * The selector for the icon to use
	 */
	@prop public icon: string|undefined;

	/**
	 * Gets the nearest root, whether it be a Shadow Root or the local DOM of the element itself
	 * @returns {ShadowRoot | Element}
	 */
	private get root (): ShadowRoot|Element {
		return this.shadowRoot != null ? this.shadowRoot : this;
	}

	/**
	 * Adds the given icon(s) to the IconComponent such that they can be used
	 * within IconComponent instances
	 * @param {IIcon[]} icons
	 */
	public static addIcons (...icons: IIcon[]): void {
		icons.forEach(icon => {
			// Skip icons that has been registered already
			if (this.ICON_MAP.has(icon.selector)) return;
			this.ICON_MAP.set(icon.selector, this.generateSVGTemplate(icon));
		});
	}

	/**
	 * Generates an SVG Template for the icon
	 * @param {IIcon} icon
	 * @returns {HTMLTemplateElement}
	 */
	private static generateSVGTemplate (icon: IIcon): HTMLTemplateElement {
		const template = document.createElement("template");
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.innerHTML = icon.template;
		svg.setAttribute("viewBox", icon.viewBox);
		svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
		svg.style.cssText = "pointer-events: none; display: block; width: 100%; height: 100%;";
		template.content.appendChild(svg);
		return template;
	}

	/**
	 * Invoked when the 'icon' prop changes its' value
	 */
	@onChange("icon")
	public onSelectorChanged () {
		this.consumeSVGTemplate();
	}

	/**
	 * Consumes a template for an SVG Element by cloning its' contents into a new node
	 */
	private consumeSVGTemplate (): void {
		if (this.icon == null) return;

		const template = IconComponent.ICON_MAP.get(this.icon);

		if (template == null) {
			console.log(`No icon with selector: '${this.icon}' has been registered!`);
			return;
		}

		// Clone the template and add it the root
		rafScheduler.mutate(() => this.root.appendChild(template.content.cloneNode(true)), {instantIfFlushing: true});
	}
}
