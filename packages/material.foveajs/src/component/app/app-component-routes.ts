import {RouteInput} from "@fovea/router";

export const routes: RouteInput[] = [
	{
		path: "/",
		name: "home",
		component: async () => import("../../page/home/home-page-component")
	},
	{
		path: "/button",
		name: "button",
		component: async () => import("../../page/button/button-page-component")
	},
	{
		path: "/icon-button",
		name: "icon-button",
		component: async () => import("../../page/icon-button/icon-button-page-component")
	},
	{
		path: "/checkbox",
		name: "checkbox",
		component: async () => import("../../page/checkbox/checkbox-page-component")
	},
	{
		path: "/switch",
		name: "switch",
		component: async () => import("../../page/switch/switch-page-component")
	},
	{
		path: "/radio-button",
		name: "radio-button",
		component: async () => import("../../page/radio-button/radio-button-page-component")
	},
	{
		path: "/slider",
		name: "slider",
		component: async () => import("../../page/slider/slider-page-component")
	},
	{
		path: "/text-field",
		name: "text-field",
		component: async () => import("../../page/text-field/text-field-page-component")
	},
	{
		path: "/dialog",
		name: "dialog",
		component: async () => import("../../page/dialog/dialog-page-component")
	},
	{
		path: "/ripple",
		name: "ripple",
		component: async () => import("../../page/ripple/ripple-page-component")
	}
];
