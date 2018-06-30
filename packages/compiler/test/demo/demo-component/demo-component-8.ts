/*tslint:disable*/
import {__construct, __renderIFoveaHost, __dispose, __attributeChanged, __registerElement, __use} from "@fovea/lib";

class RouterOutlet extends HTMLElement {
	constructor() {
		// @ts-ignore
		super(...arguments);
		__construct(this, this);
	}

	connectedCallback() { __renderIFoveaHost(this); }
	disconnectedCallback() { __dispose(this); }
	// @ts-ignore
	attributeChangedCallback(name, oldValue, newValue) { __attributeChanged(this, name, oldValue, newValue); }
	static get observedAttributes() { return []; }
}
// @ts-ignore
RouterOutlet.___compilerFlags = "0001000000000000";
// @ts-ignore
__registerElement("router-outlet", RouterOutlet);
// @ts-ignore
__use(RouterOutlet, _1040499271);

export {RouterOutlet}