import {customAttribute, hostAttributes, prop, setOnHost, styleSrc} from "@fovea/core";

/**
 * A Custom Attribute that can perform syntax highlighting of blocks of code
 */
@customAttribute
@styleSrc("./highlight.scss")
@hostAttributes({
	class: {
		psh: true,
		highlight: true,
		"psh-line-numbers": "${lineNumbers}",
		"psh-line-numbers-s": "${lineNumbers}"
	}
})
export class Highlight {
	/**
	 * The language to highlight
	 */
	@prop @setOnHost public language: "html"|"typescript"|"javascript"|"css"|"scss"|"sass"|"less";

	/**
	 * Whether to display line numbers within the syntax highlighted code block
	 * @type {boolean}
	 */
	@prop public lineNumbers: boolean = false;

	constructor (private readonly hostElement: HTMLElement) {
	}

	/**
	 * Invoked when the parent element is connected
	 */
	protected connectedCallback () {
		// noinspection JSIgnoredPromiseFromCall
		this.refresh();
	}

	/**
	 * Requests syntax highlighting from the Web Service Photon
	 * @returns {Promise<void>}
	 */
	private async refresh (): Promise<void> {
		const originalInnerHTML = this.hostElement.innerHTML;

		const response = await fetch("https://api.photon.sh/snippets", {
			method: "POST",
			headers: {
				Authorization: "Token ee3ed483513db413a04d9ffdcff030fa",
				"Content-Type": "text/html"
			},
			body: `<code class="language-${this.language}" data-line-numbers="${this.lineNumbers}">${originalInnerHTML}</code>`
		});

		if (response.status !== 200 || !response.ok) {
			return;
		}
		const body = await response.text();

		// Create a template from the response text
		const template = document.createElement("template");
		template.innerHTML = body;
		const stampedTemplate = <DocumentFragment> template.content.cloneNode(true);
		// Take the nested code element from it
		const innerCodeElement = stampedTemplate.querySelector("code")!;

		// Remove all children from the host element
		while (this.hostElement.childNodes.length > 0) {
			this.hostElement.removeChild(this.hostElement.childNodes[0]);
		}
		// Append all children of the parsed fragment to it
		while (innerCodeElement.childNodes.length > 0) {
			this.hostElement.appendChild(innerCodeElement.childNodes[0]);
		}
	}

}