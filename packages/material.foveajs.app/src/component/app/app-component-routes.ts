import {RouteInput} from "@fovea/router";

export const routes: RouteInput[] = [
	{
		path: "/",
		name: "home",
		component: () => import("../../page/home/home-page-component")
	},
	{
		path: "/button",
		name: "button",
		component: () => import("../../page/button/button-page-component")
	},
	{
		path: "/icon-button",
		name: "icon-button",
		component: () => import("../../page/icon-button/icon-button-page-component")
	},
	{
		path: "/checkbox",
		name: "checkbox",
		component: () => import("../../page/checkbox/checkbox-page-component")
	},
	{
		path: "/switch",
		name: "switch",
		component: () => import("../../page/switch/switch-page-component")
	},
	{
		path: "/radio-button",
		name: "radio-button",
		component: () => import("../../page/radio-button/radio-button-page-component")
	},
	{
		path: "/slider",
		name: "slider",
		component: () => import("../../page/slider/slider-page-component")
	},
	{
		path: "/text-field",
		name: "text-field",
		component: () => import("../../page/text-field/text-field-page-component")
	},
	{
		path: "/ripple",
		name: "ripple",
		component: () => import("../../page/ripple/ripple-page-component")
	}
];
