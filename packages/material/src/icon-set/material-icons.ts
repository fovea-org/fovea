import {IIcon} from "../component/icon/i-icon";

const viewBox = "0 0 24 24";

export const ICON_ARROW_UP: IIcon = {
	selector: "arrow-up",
	viewBox,
	template: `<path d="M13 20h-2V8l-5.5 5.5-1.42-1.42L12 4.16l7.92 7.92-1.42 1.42L13 8v12z"/>`
};

export const ICON_ARROW_LEFT: IIcon = {
	selector: "arrow-left",
	viewBox,
	template: `<path d="M20 11v2H8l5.5 5.5-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5 8 11h12z"/>`
};

export const ICON_ARROW_RIGHT: IIcon = {
	selector: "arrow-right",
	viewBox,
	template: `<path d="M4 11v2h12l-5.5 5.5 1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5 16 11H4z"/>`
};

export const ICON_ARROW_DOWN: IIcon = {
	selector: "arrow-down",
	viewBox,
	template: `<path d="M11 4h2v12l5.5-5.5 1.42 1.42L12 19.84l-7.92-7.92L5.5 10.5 11 16V4z"/>`
};

export const ICON_CHEVRON_UP: IIcon = {
	selector: "chevron-up",
	viewBox,
	template: `<path d="M7.4 15.4l4.6-4.6 4.6 4.6L18 14l-6-6-6 6 1.4 1.4z"/>`
};

export const ICON_CHEVRON_LEFT: IIcon = {
	selector: "chevron-left",
	viewBox,
	template: `<path d="M15.4 16.6L10.8 12l4.6-4.6L14 6l-6 6 6 6 1.4-1.4z"/>`
};

export const ICON_CHEVRON_RIGHT: IIcon = {
	selector: "chevron-right",
	viewBox,
	template: `<path d="M8.6 16.6l4.6-4.6-4.6-4.6L10 6l6 6-6 6-1.4-1.4z"/>`
};

export const ICON_CHEVRON_DOWN: IIcon = {
	selector: "chevron-down",
	viewBox,
	template: `<path d="M7.4 8.6l4.6 4.6 4.6-4.6L18 10l-6 6-6-6 1.4-1.4z"/>`
};

export const ICON_MENU_UP: IIcon = {
	selector: "menu-up",
	viewBox,
	template: `<path d="M7,15L12,10L17,15H7Z" />`
};

export const ICON_MENU_LEFT: IIcon = {
	selector: "menu-left",
	viewBox,
	template: `<path d="M14,7L9,12L14,17V7Z" />`
};

export const ICON_MENU_RIGHT: IIcon = {
	selector: "menu-right",
	viewBox,
	template: `<path d="M10,17L15,12L10,7V17Z" />`
};

export const ICON_MENU_DOWN: IIcon = {
	selector: "menu-down",
	viewBox,
	template: `<path d="M7,10L12,15L17,10H7Z" />`
};

export const ICON_CHECK: IIcon = {
	selector: "check",
	viewBox,
	template: `<path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />`
};

export const ICON_CHECK_CIRCLE: IIcon = {
	selector: "check-circle",
	viewBox,
	template: `<path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8m-1 12.5L6.5 12l1.4-1.4 3.1 3.07 5.6-5.58L18 9.5l-7 7z"/>`
};

export const ICON_CHECK_FILL: IIcon = {
	selector: "check-fill",
	viewBox,
	template: `<path d="M10 17l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8m-7-6A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z"/>`
};

export const ICON_CLOSE: IIcon = {
	selector: "close",
	viewBox,
	template: `<path d="M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4l5.6 5.6L5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4z"/>`
};

export const ICON_CLOSE_CIRCLE: IIcon = {
	selector: "close-circle",
	viewBox,
	template: `<path d="M12 20c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8m0-18C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m2.6 6L12 10.6 9.4 8 8 9.4l2.6 2.6L8 14.6 9.4 16l2.6-2.6 2.6 2.6 1.4-1.4-2.6-2.6L16 9.4 14.6 8z"/>`
};

export const ICON_CLOSE_FILL: IIcon = {
	selector: "close-fill",
	viewBox,
	template: `<path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2m3.6 5L12 10.6 8.4 7 7 8.4l3.6 3.6L7 15.6 8.4 17l3.6-3.6 3.6 3.6 1.4-1.4-3.6-3.6L17 8.4 15.6 7z"/>`
};

export const ICON_PLUS: IIcon = {
	selector: "plus",
	viewBox,
	template: `<path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />`
};

export const ICON_PLUS_CIRCLE: IIcon = {
	selector: "plus-circle",
	viewBox,
	template: `<path d="M12 20c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m1 5h-2v4H7v2h4v4h2v-4h4v-2h-4V7z"/>`
};

export const ICON_PLUS_FILL: IIcon = {
	selector: "plus-fill",
	viewBox,
	template: `<path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />`
};

export const ICON_MINUS: IIcon = {
	selector: "minus",
	viewBox,
	template: `<path d="M19,13H5V11H19V13Z" />`
};

export const ICON_MINUS_CIRCLE: IIcon = {
	selector: "minus-circle",
	viewBox,
	template: `<path d="M12 20c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2M7 13h10v-2H7"/>`
};

export const ICON_MINUS_FILL: IIcon = {
	selector: "minus-fill",
	viewBox,
	template: `<path d="M17,13H7V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />`
};

export const ICON_INFO: IIcon = {
	selector: "info",
	viewBox,
	template: `<path d="M13 7h-2v2h2V7zm0 4h-2v6h2v-6z"/>`
};

export const ICON_INFO_CIRCLE: IIcon = {
	selector: "info-circle",
	viewBox,
	template: `<path d="M11 9h2V7h-2m1 13c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2v6z"/>`
};

export const ICON_INFO_FILL: IIcon = {
	selector: "info-fill",
	viewBox,
	template: `<path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />`
};

export const ICON_HELP: IIcon = {
	selector: "help",
	viewBox,
	template: `<path d="M11 18h2v-2h-2v2m1-12c-2.2 0-4 1.8-4 4h2c0-1 1-2 2-2s2 1 2 2c0 2-3 1.8-3 5h2c0-2.3 3-2.5 3-5 0-2.2-1.8-4-4-4z"/>`
};

export const ICON_HELP_CIRCLE: IIcon = {
	selector: "help-circle",
	viewBox,
	template: `<path d="M11 18h2v-2h-2v2m1-16A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8m0-14a4 4 0 0 0-4 4h2a2 2 0 0 1 2-2 2 2 0 0 1 2 2c0 2-3 1.8-3 5h2c0-2.3 3-2.5 3-5a4 4 0 0 0-4-4z"/>`
};

export const ICON_HELP_FILL: IIcon = {
	selector: "help-fill",
	viewBox,
	template: `<path d="M15.07 11.25l-.9.92C13.45 12.89 13 13.5 13 15h-2v-.5c0-1.11.45-2.11 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.11-.9-2-2-2a2 2 0 0 0-2 2H8a4 4 0 0 1 4-4 4 4 0 0 1 4 4c0 .88-.36 1.67-.93 2.25M13 19h-2v-2h2M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10c0-5.53-4.5-10-10-10z"/>`
};

export const ICON_SEARCH: IIcon = {
	selector: "search",
	viewBox,
	template: `<path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.6-.6 3-1.6 4.2l.3.3h.8l5 5-1.5 1.5-5-5v-.8l-.3-.3c-1 1-2.6 1.6-4.2 1.6A6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>`
};

export const ICON_STAR: IIcon = {
	selector: "star",
	viewBox,
	template: `<path d="M12 15.4l-3.76 2.26 1-4.28L5.9 10.5l4.4-.37L12 6.1l1.7 4.03 4.4.37-3.33 2.88 1 4.28M22 9.24l-7.2-.6L12 2 9.2 8.63l-7.2.6 5.45 4.74L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24z"/>`
};

export const ICON_STAR_HALF: IIcon = {
	selector: "star-half",
	viewBox,
	template: `<path d="M12 15.9V6.6l1.7 4.03 4.4.37-3.33 2.88 1 4.28M22 9.74l-7.2-.6L12 2.5 9.2 9.13l-7.2.6 5.45 4.74-1.63 7.03L12 17.77l6.18 3.73-1.64-7.03L22 9.74z"/>`
};

export const ICON_STAR_FILL: IIcon = {
	selector: "star-fill",
	viewBox,
	template: `<path d="M12 17.3l6.2 3.7-1.7-7L22 9.2l-7.2-.6L12 2 9.2 8.6 2 9.2 7.5 14l-1.7 7 6.2-3.7z"/>`
};

export const ICON_HEART: IIcon = {
	selector: "heart",
	viewBox,
	template: `<path d="M12 18.6c-5-4.4-8-7.2-8-10C4 6.6 5.5 5 7.5 5c1.5 0 3 1 3.6 2.4h2C13.6 6 15 5 16.6 5c2 0 3.5 1.5 3.5 3.5 0 3-3 5.7-8 10M16.5 3c-1.7 0-3.4.8-4.5 2-1-1-2.8-2-4.5-2C4.5 3 2 5.4 2 8.5c0 3.8 3.4 7 8.6 11.5l1.4 1.4 1.4-1.4c5.2-4.6 8.6-7.7 8.6-11.5 0-3-2.4-5.5-5.5-5.5z"/>`
};

export const ICON_HEART_FILL: IIcon = {
	selector: "heart-fill",
	viewBox,
	template: `<path d="M12 21.4L10.6 20C5.4 15.4 2 12.3 2 8.5 2 5.5 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2 1-1.2 2.8-2 4.5-2 3 0 5.5 2.4 5.5 5.5 0 3.8-3.4 7-8.6 11.5L12 21.4z"/>`
};

export const ICON_MORE_HORIZONTAL: IIcon = {
	selector: "more-horizontal",
	viewBox,
	template: `<path d="M0 0h24v24H0z" fill="none"/><path d="M12 14c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.597-2.022c0 .89-.722 1.612-1.612 1.612-.89 0-1.612-.722-1.612-1.612 0-.89.722-1.612 1.612-1.612.89 0 1.612.722 1.612 1.612zM5.992 14.03c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.597-2.023c0 .89-.724 1.612-1.614 1.612s-1.612-.724-1.612-1.614.722-1.612 1.612-1.612c.89 0 1.612.722 1.612 1.612zm10.388 1.963c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.597-2.022c0 .89-.722 1.612-1.612 1.612-.89 0-1.612-.722-1.612-1.612 0-.89.724-1.612 1.614-1.612s1.612.722 1.612 1.612z"/>`
};

export const ICON_MORE_HORIZONTAL_FILL: IIcon = {
	selector: "more-horizontal-fill",
	viewBox,
	template: `<path d="M16 12a2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2m-6 0a2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2m-6 0a2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2z"/>`
};

export const ICON_MORE_VERTICAL: IIcon = {
	selector: "more-vertical",
	viewBox,
	template: `<path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.6-2.02c0 .9-.72 1.6-1.62 1.6-.88 0-1.6-.7-1.6-1.6 0-.9.7-1.6 1.6-1.6.9 0 1.62.7 1.62 1.6zm-1.66 8.06c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.6-2.02c0 .88-.72 1.6-1.6 1.6-.9 0-1.63-.7-1.63-1.6 0-.9.76-1.62 1.65-1.62.9 0 1.6.72 1.6 1.62zm-1.57 8.02c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.6-2.02c0 .9-.72 1.6-1.62 1.6-.88 0-1.6-.7-1.6-1.6 0-.9.7-1.62 1.6-1.62.9 0 1.62.73 1.62 1.62z"/>`
};

export const ICON_MORE_VERTICAL_FILL: IIcon = {
	selector: "more-vertical-fill",
	viewBox,
	template: `<path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>`
};

export const ICON_HOME: IIcon = {
	selector: "home",
	viewBox,
	template: `<path d="M9 19v-6h6v6h3v-8l-6-6-6 6v8h3m3-17l10 10h-2v9h-7v-6h-2v6H4v-9H2L12 2z"/>`
};

export const ICON_HOME_FILL: IIcon = {
	selector: "home-fill",
	viewBox,
	template: `<path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />`
};

export const ICON_CLOUD: IIcon = {
	selector: "cloud",
	viewBox,
	template: `<path d="M19 18H6a4 4 0 0 1-4-4 4 4 0 0 1 4-4h.7c.7-2.3 2.8-4 5.3-4a5.5 5.5 0 0 1 5.5 5.5v.5H19a3 3 0 0 1 3 3 3 3 0 0 1-3 3m.4-8c-.7-3.4-3.8-6-7.4-6-3 0-5.4 1.6-6.7 4-3 .4-5.3 3-5.3 6a6 6 0 0 0 6 6h13a5 5 0 0 0 5-5c0-2.6-2-4.8-4.6-5z"/>`
};

export const ICON_CLOUD_FILL: IIcon = {
	selector: "cloud-fill",
	viewBox,
	template: `<path d="M19.4 10c-.7-3.4-3.8-6-7.4-6-3 0-5.4 1.6-6.7 4-3 .4-5.3 3-5.3 6a6 6 0 0 0 6 6h13a5 5 0 0 0 5-5c0-2.6-2-4.8-4.6-5z"/>`
};

export const ICON_UPLOAD: IIcon = {
	selector: "upload",
	viewBox,
	template: `<path d="M12.07 2.35l7.86 8.12h-1.25l-6.6-6.75L6.1 9.5l3.36.02.04 5.9h4.97l.06-6h3.25l1.75 1.05h-4l-.08 5.92-6.97-.04V10.5l-4.68-.03 8.27-8.12zM5 17.95h14.08v.92H5.94v.36l12.24.05.02-.7.88-.1-.02 1.56-14.1-.02.03-2.08z"/>`
};

export const ICON_UPLOAD_FILL: IIcon = {
	selector: "upload-fill",
	viewBox,
	template: `<path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />`
};

export const ICON_CLOUD_UPLOAD: IIcon = {
	selector: "cloud-upload",
	viewBox,
	template: `<path d="M14 13v4h-4v-4H7l5-5 5 5m2.4-3c-.7-3.4-3.8-6-7.4-6-3 0-5.4 1.6-6.7 4-3 .4-5.3 3-5.3 6a6 6 0 0 0 6 6h13a5 5 0 0 0 5-5c0-2.6-2-4.8-4.6-5z"/>`
};

export const ICON_CLOUD_UPLOAD_FILL: IIcon = {
	selector: "cloud-upload-fill",
	viewBox: ICON_CLOUD_UPLOAD.viewBox,
	template: ICON_CLOUD_UPLOAD.template
};

export const ICON_DOWNLOAD: IIcon = {
	selector: "download",
	viewBox,
	template: `<path d="M12.02 16.192l-8.003-8.12 1.245.012 6.752 6.737 5.442-5.77-2.97-.023-.038-5.906-4.975.006-.057 6.01-3.246.002-1.75-1.06 4-.006.08-5.92 6.966.03-.004 5.87 4.296.025-7.737 8.12zM4.992 17.94h14.085v.927H5.942l-.015.365 12.254.047.018-.7.88-.1-.02 1.56-14.09-.026.027-2.076z"/>`
};

export const ICON_DOWNLOAD_FILL: IIcon = {
	selector: "download-fill",
	viewBox,
	template: `<path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />`
};

export const ICON_CLOUD_DOWNLOAD: IIcon = {
	selector: "cloud-download",
	viewBox,
	template: `<path d="M17 13l-5 5-5-5h3V9h4v4m5.4-3c-.7-3.4-3.8-6-7.4-6-3 0-5.4 1.6-6.7 4-3 .4-5.3 3-5.3 6a6 6 0 0 0 6 6h13a5 5 0 0 0 5-5c0-2.6-2-4.8-4.6-5z"/>`
};

export const ICON_CLOUD_DOWNLOAD_FILL: IIcon = {
	selector: "cloud-download-fill",
	viewBox: ICON_CLOUD_DOWNLOAD.viewBox,
	template: ICON_CLOUD_DOWNLOAD.template
};

export const ICON_REFRESH: IIcon = {
	selector: "refresh",
	viewBox,
	template: `<path d="M17.6 6.3C16.3 5 14.2 4 12 4a8 8 0 0 0-8 8 8 8 0 0 0 8 8c3.7 0 6.8-2.6 7.7-6h-2c-1 2.3-3 4-5.7 4a6 6 0 0 1-6-6 6 6 0 0 1 6-6c1.7 0 3 .7 4.2 1.8L13 11h7V4l-2.4 2.3z"/>`
};

export const ICON_REFRESH_CIRCLE: IIcon = {
	selector: "refresh-circle",
	viewBox,
	template: `<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/><path d="M15.8 8c-1-1-2.3-1.5-3.8-1.5C9 6.5 6.6 9 6.6 12S9 17.3 12 17.3c2.5 0 4.6-1.7 5.2-4h-1.4c-.5 1.5-2 2.7-3.8 2.7-2.2 0-4-1.8-4-4 0-2.3 1.8-4 4-4 1 0 2 .3 3 1l-2.3 2.2h4.7V6.5L15.8 8z"/>`
};

export const ICON_REFRESH_FILL: IIcon = {
	selector: "refresh-fill",
	viewBox: "0 0 612 612",
	template: `<path d="M548.2 201.7c-13.8-32-32.5-59.7-56-83.3-23.7-23.6-51.5-42.3-83.5-56-32-14-66-20.8-102-20.8-24 0-47.3 3-69.7 9.4-22.3 6.3-43.2 15-62.6 26.5-19.4 11.3-37 25-53 41-15.8 15.8-29.5 33.4-40.8 52.8C69.2 190.7 60.4 211.6 54 234c-6.2 22.3-9.3 45.6-9.3 69.7 0 24 3 47.3 9.4 69.7 7 22.4 16 43.3 27 62.7 12 20 25 37 41 53s34 30 53 41c20 12 41 20 63 27 23 7 46 10 70 10s47-3 70-9 43-15 63-26 37-25 53-41 30-33 41-53c12-19 20-40 27-62 6-22.5 9.6-46 9.6-70 0-36-7-70-20.7-102zm-94.8 99c-2-2-128.2-40.4-128.2-40.4-2.4-1 32-24.8 32-24.8l4-3c-7.6-6-16.2-10.8-25.6-14.3-9.4-3.5-19.4-5.2-30-5.2-12.5 0-24.3 2.4-35.3 7-11 4.8-20.6 11.3-28.8 19.5s-14.7 17.8-19.4 28.8c-4 11-7 22.8-7 35.4 0 12.6 3 24.3 7 35 5 11 12 20.5 20 28.7s18 14.6 29 19.4c11 4.7 23 7 36 7 15 0 29-3.4 43-10.4s28-22 36-34.6c2-1.7 38 25 37 26.8-14.4 21-24 34.2-46 46.3-22 12-46 18-71.3 18-21 0-41-4-59.5-12s-45-28-59-48c-14-21-19.6-51-19.6-72s1-38 9-57c7.6-19 13-30 27-44s25.6-22 44-30c19-8 39-12 59.8-12 21 0 41 4 59 12 19 8 18 13 33 25l41-31 15 128z"/>`
};

export const ICON_RELOAD: IIcon = {
	selector: "reload",
	viewBox,
	template: `<path d="M19 12h3.3l-5 5-5-5H17c0-1.5-.6-3-1.8-4.3-2.3-2.3-6-2.3-8.4 0-2.4 2.4-2.4 6.2 0 8.5 1.8 2 4.6 2.3 6.8 1.2L15 19c-3 1.7-7 1.3-9.7-1.4-3-3-3-8 0-11.3 3.2-3 8.2-3 11.4 0C18.2 8 19 10 19 12z"/>`
};

export const ICON_LOOP: IIcon = {
	selector: "loop",
	viewBox,
	template: `<path d="M12 4V1L8 5l4 4V6c3.3 0 6 2.7 6 6 0 1-.3 2-.7 2.8l1.5 1.5C19.5 15 20 13.6 20 12c0-4.4-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6 0-1 .3-2 .7-2.8L5.2 7.7C4.5 9 4 10.4 4 12c0 4.4 3.6 8 8 8v3l4-4-4-4v3z"/><path d="M0 0h24v24H0z" fill="none"/>`
};

export const ICON_BOOKMARK: IIcon = {
	selector: "bookmark",
	viewBox,
	template: `<path d="M17 18l-5-2.2L7 18V5h10m0-2H7a2 2 0 0 0-2 2v16l7-3 7 3V5c0-1-1-2-2-2z"/>`
};

export const ICON_BOOKMARK_FILL: IIcon = {
	selector: "bookmark-fill",
	viewBox,
	template: `<path d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z" />`
};

export const ICON_BOOK: IIcon = {
	selector: "book",
	viewBox,
	template: `<path d="M18 22a2 2 0 0 0 2-2V4c0-1-1-2-2-2h-6v7L9.5 7.5 7 9V2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12z"/>`
};

export const ICON_BOOK_FILL: IIcon = {
	selector: "book-fill",
	viewBox: ICON_BOOK.viewBox,
	template: ICON_BOOK.template
};

export const ICON_FLAG: IIcon = {
	selector: "flag",
	viewBox,
	template: `<path d="M14.5 6H20v10h-7l-.5-2H7v7H5V4h9l.5 2M7 6v6h6l.5 2H18V8h-4l-.5-2H7z"/>`
};

export const ICON_FLAG_FILL: IIcon = {
	selector: "flag-fill",
	viewBox,
	template: `<path d="M14.4,6L14,4H5V21H7V14H12.6L13,16H20V6H14.4Z" />`
};

export const ICON_WINDOWS: IIcon = {
	selector: "windows",
	viewBox,
	template: `<path d="M-1 0h25.736v25.736H-1V0z" fill="none"/><path d="M1.29 7.252l2 .697v11.84l11.728-.017-.04-10.54-13.683-.09.008-1.887 15.632.106.03 14.39H1.29V7.25z"/><path d="M22.59 2.314l-.003 13.014-5.834-.048v-2h3.885l-.003-9.094-10.595-.08-.063 4.855-2.024.01.045-6.76 14.593.106z"/>`
};

export const ICON_WINDOWS_FILL: IIcon = {
	selector: "windows-fill",
	viewBox,
	template: `<path d="M-1 0h25.7v25.7H-1V0z" fill="none"/><path d="M1.3 7.3H17v14.4H1.2V7.3z"/><path d="M8 2.2h14.6v13h-5V6.7H8V2.2z"/>`
};

export const ICON_AT: IIcon = {
	selector: "at",
	viewBox,
	template: `<path d="M19.93 3.3C16.98 1.14 15.3.8 12.3.8 9.15.8 1.55 2.85 1.3 11.83 1.22 14.86 2.45 17.8 4.56 20c2.13 2.16 6.98 4.6 14.53 1.65 2.3-.9 1.8-3.86-1.07-2.5-6.2 2.92-10.2.34-11.7-1.35-1.48-1.67-2.2-3.63-2.25-5.88-.2-6.68 6-8.56 8.35-8.56 2.17 0 8.18 1.46 7.73 7.14-.33 3.95-2.43 4.83-3.16 4.87-.77.05-.6-1.4-.53-1.86l.84-6.85h-2.9l-.16.68c-.74-.6-1.55-.9-2.43-.9-1.4 0-4.7.85-5.05 5.96-.13 1.7 1.2 5.55 4.5 5.7 1.12.05 2.07-.47 2.83-1.4.6.9 1.5 1.33 2.64 1.33 1.7 0 3.28-.63 4.38-2.2 3.28-4.7 1.66-10.7-1.2-12.5zm-7.87 6.04c2.74.6 2.6 6.47-.6 5.76-3.1-.68-1.6-6.22.6-5.75z"/>`
};

export const ICON_PRICETAG: IIcon = {
	selector: "pricetag",
	viewBox,
	template: `<path d="M0 0h24v24H0z" fill="none"/><path d="M17.6 5.8c-.3-.5-1-.8-1.6-.8H5C4 5 3 6 3 7v10c0 1 1 2 2 2h11c.7 0 1.3-.3 1.6-.8L22 12l-4.4-6.2zM16 17H5V7h11l3.5 5-3.5 5z"/>`
};

export const ICON_PRICETAG_FILL: IIcon = {
	selector: "pricetag-fill",
	viewBox,
	template: `<path d="M0 0h24v24H0z" fill="none"/><path d="M17.6 5.8c-.3-.5-1-.8-1.6-.8H5C4 5 3 6 3 7v10c0 1 1 2 2 2h11c.7 0 1.3-.3 1.6-.8L22 12l-4.4-6.2z"/>`
};

export const ICON_CART: IIcon = {
	selector: "cart",
	viewBox,
	template: `<path d="M17 18a2 2 0 0 1 2 2 2 2 0 0 1-2 2c-1.1 0-2-.9-2-2s.9-2 2-2M1 2h3.27l.94 2H20a1 1 0 0 1 1 1c0 .17-.05.34-.12.5l-3.58 6.47c-.34.6-1 1.03-1.75 1.03H8.1l-.9 1.63-.03.12a.25.25 0 0 0 .25.25H19v2H7c-1.1 0-2-.9-2-2 0-.35.1-.68.24-.96L6.6 11.6 3 4H1V2m6 16a2 2 0 0 1 2 2 2 2 0 0 1-2 2c-1.1 0-2-.9-2-2s.9-2 2-2m9-7l2.78-5H6.14l2.36 5H16z"/>`
};

export const ICON_CART_FILL: IIcon = {
	selector: "cart-fill",
	viewBox,
	template: `<path d="M17 18c-1.1 0-2 .9-2 2a2 2 0 0 0 2 2 2 2 0 0 0 2-2c0-1.1-.9-2-2-2M1 2v2h2l3.6 7.6-1.36 2.44c-.15.28-.24.6-.24.96a2 2 0 0 0 2 2h12v-2H7.42a.25.25 0 0 1-.25-.25c0-.05 0-.1.03-.12L8.1 13h7.45c.75 0 1.4-.42 1.75-1.03l3.58-6.47c.07-.16.12-.33.12-.5a1 1 0 0 0-1-1H5.2l-.93-2M7 18c-1.1 0-2 .9-2 2a2 2 0 0 0 2 2 2 2 0 0 0 2-2c0-1.1-.9-2-2-2z"/>`
};

export const ICON_CREDITCARD: IIcon = {
	selector: "creditcard",
	viewBox,
	template: `<path d="M20 8H4V6h16m0 12H4v-6h16m0-8H4C3 4 2 5 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-1-1-2-2-2z"/>`
};

export const ICON_CHATBUBBLE: IIcon = {
	selector: "chatbubble",
	viewBox,
	template: `<path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 2H4C3 2 2 3 2 4v18l4-4h14c1 0 2-1 2-2V4c0-1-1-2-2-2zm0 14H6l-2 2V4h16v12z"/>`
};

export const ICON_CHATBUBBLE_FILL: IIcon = {
	selector: "chatbubble-fill",
	viewBox,
	template: `<path d="M20 2H4C3 2 2 3 2 4v18l4-4h14c1 0 2-1 2-2V4c0-1-1-2-2-2z"/><path d="M0 0h24v24H0z" fill="none"/>`
};

export const ICON_CHATBOXES: IIcon = {
	selector: "chatboxes",
	viewBox,
	template: `<path d="M0 0h24v24H0V0z" fill="none"/><path d="M17.86 1.25H3.2c-1 0-1.82.83-1.82 1.83v16.48l3.66-3.66h12.82c1 0 1.83-.83 1.83-1.83v-11c0-1-.85-1.82-1.86-1.82zm0 12.82H5.04L3.2 15.9V3.08h14.66v11z"/><path d="M6.05 15.73h1.83l-.02 2.66h13.48V6.1H19.6V4.3l1.74.03s.65 0 1.3.53c.38.32.55 1.16.55 1.16l-.15 16.57-2.37-2.4H6.03v-4.5z"/>`
};

export const ICON_CHATBOXES_FILL: IIcon = {
	selector: "chatboxes-fill",
	viewBox,
	template: `<path d="M17.92 16.8c2.44-.14 2.44-2.35 2.4-5.26-.04-1.42-.02-6.5-.02-6.5s2.88-.35 2.8.56l-.02 17.28-3.98-2.58-12-.03c-1.58-.72-1.23-1.13-1.32-3.5l12.14.02z"/><path d="M1.04 1h24v24.02h-24z" fill="none"/><path d="M17.54 1.12H2.9c-1.02 0-1.84.82-1.84 1.83v16.48l3.66-3.67h12.82c1 0 1.83-.82 1.83-1.83V2.95c0-1-.83-1.83-1.83-1.83z"/>`
};

export const ICON_SETTINGS: IIcon = {
	selector: "settings",
	viewBox,
	template: `<path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.1-1.63c.2-.15.25-.42.13-.64l-2-3.46c-.12-.22-.4-.3-.6-.22l-2.5 1c-.52-.4-1.06-.73-1.7-.98l-.36-2.65c-.04-.24-.25-.42-.5-.42h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.6-1.7.98l-2.48-1c-.22-.1-.5 0-.6.22l-2 3.46c-.14.22-.08.5.1.64L4.58 11c-.04.34-.07.67-.07 1 0 .33.04.65.08.97l-2.1 1.66c-.2.15-.26.42-.13.64l2 3.46c.12.22.4.3.6.22l2.5-1c.52.4 1.06.73 1.7.98l.36 2.65c.05.24.26.42.5.42h4c.26 0 .47-.18.5-.42l.38-2.65c.63-.26 1.17-.6 1.7-1l2.48 1.02c.22.08.5 0 .6-.22l2-3.46c.13-.22.08-.5-.1-.64l-2.12-1.66z"/>`
};

export const ICON_TOGGLES: IIcon = {
	selector: "toggles",
	viewBox,
	template: `<path d="M15.6 2.8c-2.44 0-4.43 1.98-4.43 4.44 0 2.45 2 4.43 4.44 4.43 2.47 0 4.46-1.98 4.46-4.43 0-2.46-2-4.44-4.44-4.44M4.08 9H9.4V5.47H4.07c-.98 0-1.77.8-1.77 1.78S3.1 9 4.07 9M15.6 4.58c1.48 0 2.67 1.2 2.67 2.67S17.07 9.9 15.6 9.9c-1.46 0-2.65-1.2-2.65-2.66 0-1.48 1.2-2.67 2.66-2.67zM6.5 12.6c2.45 0 4.44 1.98 4.44 4.43 0 2.45-2 4.44-4.44 4.44-2.45 0-4.44-2-4.44-4.44 0-2.45 2-4.44 4.44-4.44m11.54 6.2H12.7v-3.55h5.34c.98 0 1.77.8 1.77 1.77 0 .98-.77 1.78-1.75 1.78M6.5 14.38c-1.47 0-2.67 1.2-2.67 2.66 0 1.47 1.2 2.66 2.67 2.66s2.66-1.2 2.66-2.67-1.2-2.66-2.66-2.66z"/>`
};

export const ICON_TOGGLES_FILL: IIcon = {
	selector: "toggles-fill",
	viewBox,
	template: `<path d="M16.22 2.57c2.44 0 4.42 1.97 4.42 4.4 0 2.44-1.98 4.42-4.42 4.42-2.43 0-4.4-2-4.4-4.44 0-2.44 1.97-4.4 4.4-4.4M4.75 8.73C3.78 8.73 3 7.93 3 6.98 3 6 3.77 5.2 4.74 5.2h5.3v3.54h-5.3zm2.2 3.42c-2.43 0-4.4 1.97-4.4 4.4 0 2.45 1.97 4.42 4.4 4.42 2.45 0 4.4-1.97 4.4-4.4 0-2.45-1.95-4.42-4.4-4.42m11.48 6.18c.98 0 1.77-.8 1.77-1.77 0-.98-.8-1.76-1.77-1.76h-5.3v3.53h5.3z"/>`
};

export const ICON_ANALYTICS: IIcon = {
	selector: "analytics",
	viewBox,
	template: `<path d="M3.5 18.5l6-6.02 4 4L22 6.92l-1.4-1.4-7.1 7.96-4-4-7.5 7.5z"/><path d="M0 0h24v24H0z" fill="none"/>`
};

export const ICON_PULSE: IIcon = {
	selector: "pulse",
	viewBox,
	template: `<path d="M3 13h2.8L10 4.8l1.3 9 3.2-4 3.3 3.2H21v2h-4l-2.3-2.3-4.8 6-1-7.4L7 15H3v-2z"/>`
};

export const ICON_BOX: IIcon = {
	selector: "box",
	viewBox,
	template: `<path d="M9.5 11c-.3 0-.5.2-.5.5V13h6v-1.5c0-.3-.2-.5-.5-.5h-5z"/><path d="M20 8H4v13h16V8zm-1 12H5V9h14v11zm2-17H3v4h18V3zm-1 3H4V4h16v2z"/>`
};

export const ICON_BOX_FILL: IIcon = {
	selector: "box-fill",
	viewBox,
	template: `<path d="M3 3h18v4H3V3m1 5h16v13H4V8m5.5 3a.5.5 0 0 0-.5.5V13h6v-1.5a.5.5 0 0 0-.5-.5h-5z"/>`
};

export const ICON_COMPOSE: IIcon = {
	selector: "compose",
	viewBox,
	template: `<path d="M3 17.25V21h3.75L17.8 9.94 14.07 6.2 3 17.24zm17.7-10.2c.4-.4.4-1.03 0-1.42L18.38 3.3c-.4-.4-1.02-.4-1.4 0l-1.86 1.8 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/>`
};

export const ICON_COMPOSE_BOX: IIcon = {
	selector: "compose-box",
	viewBox,
	template: `<path d="M19 19V5H5v14h14m0-16a2 2 0 0 1 2 2v14c0 1.1-.9 2-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-2.3 6.35l-1 1-2.05-2.05 1-1c.2-.22.56-.22.77 0l1.28 1.28c.22.2.22.56 0 .77M7 14.95l6.06-6.07 2.06 2.06L9.06 17H7v-2.06z"/>`
};

export const ICON_COMPOSE_BOX_FILL: IIcon = {
	selector: "compose-box-fill",
	viewBox,
	template: `<path d="M19 3a2 2 0 0 1 2 2v14c0 1.1-.9 2-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-2.3 6.35c.22-.2.22-.56 0-.77L15.42 7.3c-.2-.22-.56-.22-.77 0l-1 1 2.05 2.05 1-1M7 14.95V17h2.06l6.06-6.06-2.06-2.06L7 14.94z"/>`
};

export const ICON_TRASH: IIcon = {
	selector: "trash",
	viewBox,
	template: `<path d="M6 7h2v12.2h8V8.7H8V7h10v12.3s0 .6-.6 1.2c-.5.5-1.3.6-1.3.6H8s-1 0-1.5-.4-.5-1.3-.5-1.3V7zM5 4h3.5l1-1h5l1 1h-.8l-.5-.5H9.8l-.5.5H19v2H5V4z"/>`
};

export const ICON_TRASH_FILL: IIcon = {
	selector: "trash-fill",
	viewBox,
	template: `<path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z"/>`
};

export const ICON_FILES: IIcon = {
	selector: "files",
	viewBox,
	template: `<path d="M15 8.7h5l-5-5v5M8.7 2.4h7l5.5 5.4v10.6c0 1-.8 1.8-1.8 1.8H8.7c-1 0-1.7-.8-1.7-1.8V4.2c0-1 .7-1.8 1.7-1.8m4.5 1.8H8.7v14.2h10.7v-8h-6.2V4.2z"/><path d="M4.7 3.7H8l.2 15 1.3 1H16s.5.2 0 1c-.2.4-1 .6-1 .6H4.7c-1 0-1.8-.6-1.8-1.5V5.5c0-1 .5-1.8 1.5-1.8M7 5.5H4.8v14h4l-1-.2-.6-1 .3-12.8z"/>`
};

export const ICON_FILES_FILL: IIcon = {
	selector: "files-fill",
	viewBox,
	template: `<path d="M14.3 8.76V3.88l4.88 4.88M8.08 2.54c-1 0-1.8.8-1.8 1.78v14.2c0 1 .8 1.8 1.8 1.8h10.65c.98 0 1.78-.8 1.78-1.8V7.88l-5.3-5.34H8.1z"/><path d="M3.88 4.83L5.4 4.8l.04 14.22s.15.67.46 1.16c.4.65 1.4.92 1.4.92h8.1s.28-.1-.1.6c-.3.54-1.1.68-1.1.68H3.9c-1 0-1.78-.56-1.78-1.54V6.6c0-.98.8-1.77 1.78-1.77"/>`
};

export const ICON_EMAIL: IIcon = {
	selector: "email",
	viewBox,
	template: `<path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 14H4V8l8 5 8-5v10m0-12l-8 5-8-5h16z"/>`
};

export const ICON_EMAIL_FILL: IIcon = {
	selector: "email-fill",
	viewBox,
	template: `<path d="M20 8l-8 5-8-5V6l8 5 8-5m0-2H4C3 4 2 5 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-1-1-2-2-2z"/>`
};

export const ICON_UNDO: IIcon = {
	selector: "undo",
	viewBox,
	template: `<path d="M12.5 8c-2.7 0-5 1-7 2.6L2 7v9h9l-3.6-3.6c1.4-1.2 3-2 5-2 3.6 0 6.7 2.4 7.7 5.6l2.6-.8C21 11 17 8 12.6 8z"/>`
};

export const ICON_UNDO_FILL: IIcon = {
	selector: "undo-fill",
	viewBox: ICON_UNDO.viewBox,
	template: ICON_UNDO.template
};

export const ICON_REDO: IIcon = {
	selector: "redo",
	viewBox,
	template: `<path d="M18.4 10.6C16.6 9 14.2 8 11.4 8 7 8 3 11 1.4 15.2L4 16c1-3.2 4-5.5 7.5-5.5 2 0 3.7.7 5 2L13 16h9V7l-3.6 3.6z"/>`
};

export const ICON_REDO_FILL: IIcon = {
	selector: "redo-fill",
	viewBox: ICON_REDO.viewBox,
	template: ICON_REDO.template
};

export const ICON_SEND: IIcon = {
	selector: "send",
	viewBox,
	template: `<path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />`
};

export const ICON_SEND_FILL: IIcon = {
	selector: "send-fill",
	viewBox: ICON_SEND.viewBox,
	template: ICON_SEND.template
};

export const ICON_FOLDER: IIcon = {
	selector: "folder",
	viewBox,
	template: `<path d="M20 18H4V8h16m0-2h-8l-2-2H4C3 4 2 5 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8c0-1-1-2-2-2z"/>`
};

export const ICON_FOLDER_FILL: IIcon = {
	selector: "folder-fill",
	viewBox,
	template: `<path d="M10 4H4C3 4 2 5 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8c0-1-1-2-2-2h-8l-2-2z"/>`
};

export const ICON_PAPER: IIcon = {
	selector: "paper",
	viewBox,
	template: `<path d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 0 1-2 2H6c-1 0-2-1-2-2V4c0-1 1-2 2-2m5 2H6v16h12v-9h-7V4z"/><path d="M6 12h12v2H6v-2zm0 4h9v2H6v-2z"/>`
};

export const ICON_PAPER_FILL: IIcon = {
	selector: "paper-fill",
	viewBox,
	template: `<path d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 0 1-2 2H6c-1 0-2-1-2-2V4c0-1 1-2 2-2m9 16v-2H6v2h9m3-4v-2H6v2h12z"/>`
};

export const ICON_LIST: IIcon = {
	selector: "list",
	viewBox,
	template: `<path d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 0 1-2 2H6c-1.11 0-2-.9-2-2V4c0-1.11.89-2 2-2m5 2H6v16h12v-9h-7V4z"/><path d="M9.58 11.885h7.067v1.01H9.58v-1.01m0 4.038v-1.01h7.067v1.01H9.58m-1.515-4.29c.418 0 .757.338.757.756s-.34.755-.757.755c-.418 0-.757-.338-.757-.757 0-.42.34-.758.757-.758m0 3.03c.418 0 .757.34.757.757 0 .416-.34.756-.757.756-.418 0-.757-.34-.757-.757 0-.42.34-.76.757-.76m1.514 4.292v-1.01h7.066v1.01H9.58M8.064 17.69c.418 0 .757.34.757.757 0 .42-.34.757-.756.757-.418 0-.757-.338-.757-.757 0-.418.34-.757.757-.757z"/>`
};

export const ICON_LIST_FILL: IIcon = {
	selector: "list-fill",
	viewBox,
	template: `<path d="M14 2l6 6v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm4.5 7L13 3.5V9zm-8.83 6.62h7.07v-1H9.67zm0 3.03h7.07v-1H9.67zm-1.5-4.3c-.43 0-.77.35-.77.77 0 .42.34.76.76.76.4 0 .75-.34.75-.76s-.32-.76-.73-.76zm-.77 3.8c0 .42.34.75.76.75.4 0 .75-.33.75-.75s-.32-.76-.73-.76c-.42 0-.76.32-.76.74zm.76-6.82c-.42 0-.76.34-.76.76 0 .4.34.74.76.74.4 0 .75-.34.75-.76 0-.43-.32-.77-.73-.77zm1.5.26v1h7.08v-1z"/>`
};

export const ICON_WORLD: IIcon = {
	selector: "world",
	viewBox,
	template: `<path d="M18 17.4c-.4-.8-1-1.4-2-1.4h-1v-3a1 1 0 0 0-1-1H8v-2h2a1 1 0 0 0 1-1V7h2a2 2 0 0 0 2-2v-.4c3 1.2 5 4 5 7.4 0 2-.8 4-2 5.4M11 20c-4-.6-7-4-7-8 0-.6 0-1.2.2-1.8L9 15v1a2 2 0 0 0 2 2m1-16A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z"/>`
};

export const ICON_ALARM: IIcon = {
	selector: "alarm",
	viewBox,
	template: `<path d="M12 20a7 7 0 0 1-7-7 7 7 0 0 1 7-7 7 7 0 0 1 7 7 7 7 0 0 1-7 7m0-16a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9m.5 4H11v6l4.75 2.85.75-1.23-4-2.37V8M7.88 3.4L6.6 1.85 2 5.7l1.3 1.54L7.87 3.4M22 5.7l-4.6-3.86-1.3 1.53 4.6 3.85 1.3-1.5z"/>`
};

export const ICON_ALARM_FILL: IIcon = {
	selector: "alarm-fill",
	viewBox,
	template: `<path d="M21.02 13.03c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9zM11 8v6l4.75 2.85.75-1.23-4-2.37V8zm9.7-.75L16.1 3.4l1.3-1.54L22 5.72zM6.6 1.85L2 5.7l1.3 1.54L7.87 3.4z"/>`
};

export const ICON_SPEEDOMETER: IIcon = {
	selector: "speedometer",
	viewBox,
	template: `<path d="M12 16a3 3 0 0 1-3-3c0-1 .6-2 1.5-2.6l9.7-5.6-5.5 9.6c-.5 1-1.5 1.6-2.7 1.6m0-13c1.8 0 3.5.5 5 1.3l-2 1.2c-1-.3-2-.5-3-.5a8 8 0 0 0-8 8c0 2.2 1 4.2 2.3 5.6.4.4.4 1 0 1.5-.3.6-1 .6-1.4 0-2-1.5-3-4-3-7A10 10 0 0 1 12 3m10 10c0 2.8-1 5.3-3 7-.3.4-1 .4-1.3 0-.4-.3-.4-1 0-1.4C19 17.3 20 15.2 20 13c0-1-.2-2-.5-3l1.2-2c.8 1.5 1.3 3.2 1.3 5z"/>`
};

export const ICON_SPEEDOMETER_FILL: IIcon = {
	selector: "speedometer-fill",
	viewBox,
	template: `<path d="M9 13c0-1 .6-2 1.5-2.6l8.3-4.8C17 4 14.6 3 12 3 6.5 3 2 7.5 2 13c0 3.5 1 6.3 3.8 8 1.6 1.2 10 1 11.4.3 3-1.7 5-4.5 5-8.3 0-2.6-1.2-5-2.8-6.8l-4.7 8.2c-.5 1-1.5 1.6-2.7 1.6-1.7 0-3-1.3-3-3zm9.8-7.4l2-1.6-1.4 2.2-.6-.6z"/>`
};

export const ICON_STOPWATCH: IIcon = {
	selector: "stopwatch",
	viewBox: "0 0 512 512",
	template: `<path d="M232 306.7h48V176h-48v130.7z"/><path d="M407.7 170.3l30.8-30.8-34-34-30.8 30.8C341.2 111 300.4 96 256 96 150 96 64 182 64 288s86 192 192 192 192-86 192-192c0-44.4-15-85.2-40.3-117.7zM362 394c-28.3 28.4-66 44-106 44s-77.7-15.6-106-44c-28.4-28.3-44-66-44-106s15.6-77.7 44-106c28.3-28.4 66-44 106-44s77.7 15.6 106 44c28.4 28.3 44 66 44 106s-15.6 77.7-44 106zM192 32h128v48H192z"/>`
};

export const ICON_STOPWATCH_FILL: IIcon = {
	selector: "stopwatch-fill",
	viewBox: "0 0 512 512",
	template: `<path d="M407.7 170.3l30.8-30.8-34-34-30.8 30.8C341.2 111 300.4 96 256 96 150 96 64 182 64 288s86 192 192 192 192-86 192-192c0-44.4-15-85.2-40.3-117.7zM233 302.3v-131h48V302zM192 32h128v48H192z"/>`
};

export const ICON_TIME: IIcon = {
	selector: "time",
	viewBox,
	template: `<path d="M12 20c-4 0-7-3-7-7s3-7 7-7 7 3 7 7-3 7-7 7m0-16c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9m.5 4H11v6l4.8 3 .7-1.4-4-2.3V8"/>`
};

export const ICON_TIME_FILL: IIcon = {
	selector: "time-fill",
	viewBox,
	template: `<path d="M21 13c0 5-4 9-9 9s-9-4-9-9 4-9 9-9 9 4 9 9zM11 8v6l4.8 3 .7-1.4-4-2.3V8z"/>`
};

export const ICON_CALENDAR: IIcon = {
	selector: "calendar",
	viewBox,
	template: `<path d="M19 19H5V8h14m-3-7v2H8V1H6v2H5C4 3 3 4 3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5c0-1-1-2-2-2h-1V1m-1 11h-5v5h5v-5z"/>`
};

export const ICON_CALENDAR_FILL: IIcon = {
	selector: "calendar-fill",
	viewBox,
	template: `<path d="M16 1v2H8V1H6v2H5C4 3 3 4 3 5v14c0 1 1 2 2 2h14c1 0 2-1 2-2V5c0-1-1-2-2-2h-1V1zm-4 11h5v5h-5z"/>`
};

export const ICON_PHOTOS: IIcon = {
	selector: "photos",
	viewBox,
	template: `<path d="M21 17H7V3h14m0-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2M3 5H1v16a2 2 0 0 0 2 2h16v-2H3m13-10.7l-2.8 3.5-2-2.3L8.6 15h11L16 10.3z"/>`
};

export const ICON_PHOTOS_FILL: IIcon = {
	selector: "photos-fill",
	viewBox,
	template: `<path d="M22 16V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m-11-4l2 2.7 3-3.7 4 5H8M2 6v14a2 2 0 0 0 2 2h14v-2H4V6"/>`
};

export const ICON_ALBUMS: IIcon = {
	selector: "albums",
	viewBox,
	template: `<path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm.75 3v14.05c0 .96-.75 1.75-1.7 1.75H6.92c-.93 0-1.7-.8-1.7-1.75V5c0-.97.77-1.76 1.7-1.76h10.16c.94 0 1.7.8 1.7 1.76z"/><path d="M5.9 19.98l3-3.86 2.15 2.58 3-3.86 3.86 5.14h-12m.16-15.86h5v8l-2.5-1.5-2.5 1.5"/>`
};

export const ICON_ALBUMS_FILL: IIcon = {
	selector: "albums-fill",
	viewBox,
	template: `<path d="M6 19l3-4 2 2.7 3-3.8 4 5H6M6 4h5v8l-2.5-1.5L6 12M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>`
};

export const ICON_CAMERA: IIcon = {
	selector: "camera",
	viewBox,
	template: `<path d="M7 4l2-2h6l2 2h3c1 0 2 1 2 2v12c0 1-1 2-2 2H4c-1 0-2-1-2-2V6c0-1 1-2 2-2h3zM4.7 5.5c-.7.2-1 .8-1 1.7v9.6c0 1 .7 1.7 1.6 1.7h13.4c1 0 1.6-.8 1.6-1.7V7c0-.8-.7-1.5-1.6-1.5h-2.5l-2-2H9.7l-2 2h-3z"/><path d="M17 11.6c0 2.8-2.2 5-5 5-3 0-5-2.2-5-5s2-5 5-5c2.8 0 5 2.2 5 5zm-5-3c-1.8 0-3 1.3-3 3 0 1.6 1.2 3 3 3 1.6 0 3-1.4 3-3 0-1.7-1.4-3-3-3z"/>`
};

export const ICON_CAMERA_FILL: IIcon = {
	selector: "camera-fill",
	viewBox,
	template: `<path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m8 3a5 5 0 0 0-5 5 5 5 0 0 0 5 5 5 5 0 0 0 5-5 5 5 0 0 0-5-5m0 2a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3z"/>`
};

export const ICON_REVERSE_CAMERA: IIcon = {
	selector: "reverse-camera",
	viewBox,
	template: `<path d="M15 15.5V13H9v2.5L5.5 12 9 8.5V11h6V8.5l3.5 3.5"/><path d="M7 5l2-2h6l2 2h3c1 0 2 1 2 2v12c0 1-1 2-2 2H4c-1 0-2-1-2-2V7c0-1 1-2 2-2h3zM4.7 6.5c-.7.2-1 .8-1 1.7v9.6c0 1 .7 1.7 1.6 1.7h13.4c1 0 1.6-.8 1.6-1.7V8c0-.8-.7-1.5-1.6-1.5h-2.5l-2-2H9.7l-2 2h-3z"/>`
};

export const ICON_REVERSE_CAMERA_FILL: IIcon = {
	selector: "reverse-camera-fill",
	viewBox,
	template: `<path d="M15 15.5V13H9v2.5L5.5 12 9 8.5V11h6V8.5l3.5 3.5M20 4h-3.2L15 2H9L7.2 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-1-1-2-2-2z"/>`
};

export const ICON_EYE: IIcon = {
	selector: "eye",
	viewBox,
	template: `<path d="M12 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 1-5 5m0-12.5c-5 0-9.3 3-11 7.5 1.7 4.4 6 7.5 11 7.5s9.3-3 11-7.5c-1.7-4.4-6-7.5-11-7.5z"/>`
};

export const ICON_FLASH: IIcon = {
	selector: "flash",
	viewBox,
	template: `<path d="M7 2v11h3v9l7-12h-4l4-8zm7.8 1.4l-4 8h3.7l-3 5v-5h-3v-8z"/>`
};

export const ICON_FLASH_FILL: IIcon = {
	selector: "flash-fill",
	viewBox,
	template: `<path d="M7,2V13H10V22L17,10H13L17,2H7Z" />`
};

export const ICON_COLOR_WAND: IIcon = {
	selector: "color-wand",
	viewBox,
	template: `<path d="M7.5 5.6L5 7l1.4-2.5L5 2l2.5 1.4L10 2 8.6 4.5 10 7 7.5 5.6m12 9.8L22 14l-1.4 2.5L22 19l-2.5-1.4L17 19l1.4-2.5L17 14l2.5 1.4M22 2l-1.4 2.5L22 7l-2.5-1.4L17 7l1.4-2.5L17 2l2.5 1.4L22 2m-8.66 10.78l2.44-2.44-2.12-2.12-2.44 2.44 2.12 2.12m1.03-5.5l2.34 2.35c.4.37.4 1.02 0 1.4L5.07 22.73c-.4.4-1.04.4-1.4 0L1.3 20.38c-.4-.38-.4-1.03 0-1.4l11.65-11.7c.4-.4 1.04-.4 1.4 0z"/>`
};

export const ICON_COLOR_WAND_FILL: IIcon = {
	selector: "color-wand-fill",
	viewBox: ICON_COLOR_WAND.viewBox,
	template: ICON_COLOR_WAND.template
};

export const ICON_COLOR_FILTER: IIcon = {
	selector: "color-filter",
	viewBox,
	template: `<path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 10v9H5V5h9V3H5C4 3 3 4 3 5v14c0 1 1 2 2 2h14c1 0 2-1 2-2v-9h-2zm-2 0l1-2 2-1-2-1-1-2-1 2-2 1 2 1zm-3.8.8L12 8l-1.3 2.8L8 12l2.8 1.3L12 16l1.3-2.8L16 12z"/>`
};

export const ICON_COLOR_FILTER_FILL: IIcon = {
	selector: "color-filter-fill",
	viewBox,
	template: `<path d="M0 0h24v24H0V0z" fill="none"/><path d="M5 3h13.7c1 0 2 1 2 2v14c0 1-1 2-2 2H5c-1 0-2-1-2-2V5c0-1 1-2 2-2zm8.5 7.5l-1.3-2.8-1.2 2.8-2.8 1.2L11 13l1.2 2.7 1.3-2.7 2.7-1.3zM18.3 8l2-1-2-1-1-2-1 2-2 1 2 1 1 2z"/>`
};

export const ICON_GRID: IIcon = {
	selector: "grid",
	viewBox,
	template: `<path d="M10 4v4h4V4h-4m6 0v4h4V4h-4m0 6v4h4v-4h-4m0 6v4h4v-4h-4m-2 4v-4h-4v4h4m-6 0v-4H4v4h4m0-6v-4H4v4h4m0-6V4H4v4h4m2 6h4v-4h-4v4M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4c-1 0-2-1-2-2V4a2 2 0 0 1 2-2z"/>`
};

export const ICON_GRID_FILL: IIcon = {
	selector: "grid-fill",
	viewBox,
	template: `<path d="M4 2h16c1 0 2 .8 2 2v16c0 1-1 2-2 2H4c-1.2 0-2.2-1-2.2-2V4c0-1.2 1-2 2-2zm0 6v2h4v4H4v2h4v3.6h2V16h4v3.6h2V16h4v-2h-4v-4h4V8h-4V4h-2v4h-4V4H8v4zm6 6v-4h4v4z"/>`
};

export const ICON_CROP: IIcon = {
	selector: "crop",
	viewBox,
	template: `<path d="M7 17V1H5v4H1v2h4v10a2 2 0 0 0 2 2h10v4h2v-4h4v-2m-6-2h2V7c0-1-1-2-2-2H9v2h8v8z"/>`
};

export const ICON_BARCODE: IIcon = {
	selector: "barcode",
	viewBox,
	template: `<path d="M2 6h2v12H2V6m3 0h1v12H5V6m2 0h3v12H7V6m4 0h1v12h-1V6m3 0h2v12h-2V6m3 0h3v12h-3V6m4 0h1v12h-1V6z"/>`
};

export const ICON_BRIEFCASE: IIcon = {
	selector: "briefcase",
	viewBox,
	template: `<path d="M20 6h-4V4l-2-2h-4L8 4v2H4C3 6 2 7 2 8v11c0 1 1 2 2 2h16c1 0 2-1 2-2V8c0-1-1-2-2-2zm-6 0h-4V4h4zm5.7 3.5v8c0 1-.7 1.6-1.5 1.6H5.8c-1 0-1.6-.5-1.6-1.3v-8C4.2 8.5 5 8 5.8 8h12.4c.8 0 1.5.7 1.5 1.5z"/>`
};

export const ICON_BRIEFCASE_FILL: IIcon = {
	selector: "briefcase-fill",
	viewBox,
	template: `<path d="M14 6h-4V4h4m6 2h-4V4l-2-2h-4L8 4v2H4C3 6 2 7 2 8v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8c0-1-1-2-2-2z"/>`
};

export const ICON_MEDKIT: IIcon = {
	selector: "medkit",
	viewBox,
	template: `<path d="M20 6h-4V4l-2-2h-4L8 4v2H4C3 6 2 7 2 8v11c0 1 1 2 2 2h16c1 0 2-1 2-2V8c0-1-1-2-2-2zm-6 0h-4V4h4zm5.7 3.5v8c0 1-.7 1.6-1.5 1.6H5.8c-1 0-1.6-.5-1.6-1.3v-8C4.2 8.5 5 8 5.8 8h12.4c.8 0 1.5.7 1.5 1.5z"/><path d="M15.7 12.5v2h-2.5v2.7H11v-2.6H8.4v-2H11V10h2.2v2.5z"/>`
};

export const ICON_MEDKIT_FILL: IIcon = {
	selector: "medkit-fill",
	viewBox,
	template: `<path d="M20 6h-4V4l-2-2h-4L8 4v2H4C3 6 2 7 2 8v11c0 1 1 2 2 2h16c1 0 2-1 2-2V8c0-1-1-2-2-2zm-6 0h-4V4h4zm1.7 6.5v2h-2.5v2.7H11v-2.6H8.4v-2H11V10h2.2v2.5z"/>`
};

export const ICON_INFINITE: IIcon = {
	selector: "infinite",
	viewBox,
	template: `<path d="M18.6 6.62C21.58 6.62 24 9 24 12c0 2.96-2.42 5.37-5.4 5.37-1.45 0-2.8-.56-3.82-1.57L12 13.34l-2.83 2.5c-.97.98-2.33 1.54-3.77 1.54C2.42 17.38 0 14.96 0 12s2.42-5.38 5.4-5.38c1.44 0 2.8.56 3.82 1.58L12 10.66l2.83-2.5c.97-.98 2.33-1.54 3.77-1.54M7.8 14.4l2.7-2.4-2.66-2.35C7.16 8.97 6.3 8.62 5.4 8.62 3.53 8.62 2 10.12 2 12c0 1.87 1.53 3.38 3.4 3.38.9 0 1.76-.35 2.4-1m8.4-4.77L13.5 12l2.66 2.35c.68.68 1.54 1.03 2.44 1.03 1.87 0 3.4-1.5 3.4-3.38 0-1.87-1.53-3.38-3.4-3.38-.9 0-1.76.35-2.4 1z"/>`
};

export const ICON_INFINITE_FILL: IIcon = {
	selector: "infinite-fill",
	viewBox: ICON_INFINITE.viewBox,
	template: ICON_INFINITE.template
};

export const ICON_CALCULATOR: IIcon = {
	selector: "calculator",
	viewBox,
	template: `<path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m0 2v4h10V4H7m0 6v2h2v-2H7m4 0v2h2v-2h-2m4 0v2h2v-2h-2m-8 4v2h2v-2H7m4 0v2h2v-2h-2m4 0v2h2v-2h-2m-8 4v2h2v-2H7m4 0v2h2v-2h-2m4 0v2h2v-2h-2z"/>`
};

export const ICON_KEYPAD: IIcon = {
	selector: "keypad",
	viewBox,
	template: `<path d="M4 3c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm3.33-.04c0 .73-.6 1.32-1.32 1.32-.7 0-1.3-.6-1.3-1.32 0-.73.6-1.32 1.3-1.32.76 0 1.35.6 1.35 1.32zM9.98 3c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm3.32-.04c0 .73-.6 1.32-1.3 1.32-.74 0-1.33-.6-1.33-1.32 0-.73.6-1.32 1.32-1.32.7 0 1.3.6 1.3 1.32zm2.7.07c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zM19.34 3c0 .72-.6 1.3-1.3 1.3-.74 0-1.33-.58-1.33-1.3 0-.73.6-1.32 1.34-1.32.72 0 1.3.6 1.3 1.3zM4 9.04c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zM7.32 9c0 .72-.6 1.3-1.32 1.3-.72 0-1.3-.58-1.3-1.3 0-.73.58-1.32 1.3-1.32.73 0 1.32.6 1.32 1.32zm2.65.04c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zM13.3 9c0 .72-.6 1.3-1.32 1.3-.72 0-1.3-.58-1.3-1.3 0-.73.58-1.32 1.3-1.32.73 0 1.32.6 1.32 1.32zm2.7.07c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm3.33-.04c0 .73-.6 1.32-1.32 1.32-.7 0-1.3-.6-1.3-1.32 0-.73.6-1.32 1.3-1.32.76 0 1.35.6 1.35 1.35zM3.97 15c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm3.32-.04c0 .73-.6 1.32-1.35 1.32-.72 0-1.3-.6-1.3-1.32 0-.73.58-1.32 1.3-1.32.73 0 1.32.6 1.32 1.32zm2.64.04c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm3.32-.04c0 .73-.6 1.32-1.32 1.32-.72 0-1.3-.6-1.3-1.32 0-.73.58-1.32 1.3-1.32.73 0 1.32.6 1.32 1.32zm2.7.08c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zM19.3 15c0 .72-.6 1.3-1.32 1.3-.73 0-1.32-.58-1.32-1.3 0-.73.6-1.32 1.32-1.32.73 0 1.32.6 1.32 1.3zm-9.33 6c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm3.33-.03c0 .73-.6 1.32-1.32 1.32-.72 0-1.32-.6-1.32-1.35 0-.73.6-1.32 1.32-1.32.73 0 1.32.6 1.32 1.32z"/>`
};

export const ICON_KEYPAD_FILL: IIcon = {
	selector: "keypad-fill",
	viewBox,
	template: `<path d="M12 19a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2M6 1a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2m0 6a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2m0 6a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2m12-8a2 2 0 0 0 2-2 2 2 0 0 0-2-2 2 2 0 0 0-2 2 2 2 0 0 0 2 2m-6 8a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2m6 0a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2m0-6a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2m-6 0a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2m0-6a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2z"/>`
};

export const ICON_TELEPHONE: IIcon = {
	selector: "telephone",
	viewBox,
	template: `<path d="M6.62 10.8c1.44 2.82 3.76 5.14 6.6 6.58l2.2-2.2c.27-.28.66-.36 1-.25 1.13.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57.1.35.03.74-.25 1.02l-2.2 2.2z"/>`
};

export const ICON_TELEPHONE_FILL: IIcon = {
	selector: "telephone-fill",
	viewBox: ICON_TELEPHONE.viewBox,
	template: ICON_TELEPHONE.template
};

export const ICON_DRAG: IIcon = {
	selector: "drag",
	viewBox,
	template: `<path d="M7 19v-2h2v2H7m4 0v-2h2v2h-2m4 0v-2h2v2h-2m-8-4v-2h2v2H7m4 0v-2h2v2h-2m4 0v-2h2v2h-2m-8-4V9h2v2H7m4 0V9h2v2h-2m4 0V9h2v2h-2M7 7V5h2v2H7m4 0V5h2v2h-2m4 0V5h2v2h-2z"/>`
};

export const ICON_LOCATION_FILL: IIcon = {
	selector: "location-fill",
	viewBox,
	template: `<path d="M12 11.5A2.5 2.5 0 0 1 9.5 9 2.5 2.5 0 0 1 12 6.5 2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7z"/>`
};

export const ICON_LOCATION_OFF: IIcon = {
	selector: "location-off",
	viewBox,
	template: `<path d="M0 0h24v24H0zm11.75 11.47l-.1-.1z" fill="none"/><path d="M12 6.5c1.38 0 2.5 1.12 2.5 2.5 0 .74-.33 1.4-.83 1.85l3.63 3.63c.98-1.86 1.7-3.8 1.7-5.48 0-3.87-3.13-7-7-7-1.98 0-3.76.83-5.04 2.15l3.2 3.2c.45-.53 1.1-.85 1.84-.85zm4.37 9.6l-4.63-4.63-.1-.1L3.26 3 2 4.27l3.18 3.18C5.08 7.95 5 8.47 5 9c0 5.25 7 13 7 13s1.67-1.85 3.38-4.35L18.73 21 20 19.73l-3.63-3.63z"/>`
};

export const ICON_NAVIGATE: IIcon = {
	selector: "navigate",
	viewBox,
	template: `<path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />`
};

export const ICON_NAVIGATE_FILL: IIcon = {
	selector: "navigate-fill",
	viewBox: ICON_NAVIGATE.viewBox,
	template: ICON_NAVIGATE.template
};

export const ICON_LOCKED: IIcon = {
	selector: "locked",
	viewBox,
	template: `<path d="M12 17c-1 0-2-1-2-2s1-2 2-2a2 2 0 0 1 2 2 2 2 0 0 1-2 2m6 3V10H6v10h12m0-12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6c-1 0-2-1-2-2V10c0-1 1-2 2-2h1V6a5 5 0 0 1 5-5 5 5 0 0 1 5 5v2h1m-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3z"/>`
};

export const ICON_LOCKED_FILL: IIcon = {
	selector: "locked-fill",
	viewBox,
	template: `<path d="M12 17a2 2 0 0 0 2-2c0-1-1-2-2-2a2 2 0 0 0-2 2 2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-1 1-2 2-2h1V6a5 5 0 0 1 5-5 5 5 0 0 1 5 5v2h1m-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3z"/>`
};

export const ICON_UNLOCKED: IIcon = {
	selector: "unlocked",
	viewBox,
	template: `<path d="M18 20V10H6v10h12m0-12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6c-1 0-2-1-2-2V10a2 2 0 0 1 2-2h9V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3H7a5 5 0 0 1 5-5 5 5 0 0 1 5 5v2h1m-6 9a2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 1-2 2z"/>`
};

export const ICON_UNLOCKED_FILL: IIcon = {
	selector: "unlocked-fill",
	viewBox,
	template: `<path d="M18 8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6c-1 0-2-1-2-2V10a2 2 0 0 1 2-2h9V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3H7a5 5 0 0 1 5-5 5 5 0 0 1 5 5v2h1m-6 9a2 2 0 0 0 2-2 2 2 0 0 0-2-2 2 2 0 0 0-2 2 2 2 0 0 0 2 2z"/>`
};

export const ICON_MONITOR: IIcon = {
	selector: "monitor",
	viewBox,
	template: `<path d="M21 16H3V4h18m0-2H3C2 2 1 3 1 4v12a2 2 0 0 0 2 2h7v2H8v2h8v-2h-2v-2h7a2 2 0 0 0 2-2V4c0-1-1-2-2-2z"/>`
};

export const ICON_MONITOR_FILL: IIcon = {
	selector: "monitor-fill",
	viewBox,
	template: `<path d="M21 2H3C2 2 1 3 1 4v12c0 1 1 2 2 2h7v2H8v2h8v-2h-2v-2h7c1 0 2-1 2-2V4c0-1-1-2-2-2z"/>`
};

export const ICON_PRINTER: IIcon = {
	selector: "printer",
	viewBox,
	template: `<path d="M18 3H6v4h12m1 5a1 1 0 0 1-1-1 1 1 0 0 1 1-1 1 1 0 0 1 1 1 1 1 0 0 1-1 1m-3 7H8v-5h8m3-6H5a3 3 0 0 0-3 3v6h4v4h12v-4h4v-6a3 3 0 0 0-3-3z"/>`
};

export const ICON_PRINTER_FILL: IIcon = {
	selector: "printer-fill",
	viewBox: ICON_PRINTER.viewBox,
	template: ICON_PRINTER.template
};

export const ICON_GAME_CONTROLLER_RETRO: IIcon = {
	selector: "game-controller-retro",
	viewBox,
	template: `<path d="M0 0v24h24V0H0zm23 16c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h18c1.1 0 2 .9 2 2v8z" fill="none"/><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm.5 3.23v5.93c0 .76-.73 1.4-1.64 1.4H4.1c-.9 0-1.65-.64-1.65-1.4V8.93c0-.76.74-1.4 1.65-1.4h15.76c.9 0 1.64.93 1.64 1.7z"/><path d="M11 12.94H8v3H6v-3H3v-2h3v-3h2v3h3v2zm4.5 2c-.84 0-1.5-.67-1.5-1.5s.66-1.5 1.5-1.5c.82 0 1.5.67 1.5 1.5s-.68 1.5-1.5 1.5zm4-3c-.84 0-1.5-.67-1.5-1.5s.66-1.5 1.5-1.5c.82 0 1.5.67 1.5 1.5s-.68 1.5-1.5 1.5z"/>`
};

export const ICON_GAME_CONTROLLER_RETRO_FILL: IIcon = {
	selector: "game-controller-retro-fill",
	viewBox,
	template: `<path d="M0 0v24h24V0H0zm23 16c0 1-1 2-2 2H3c-1 0-2-1-2-2V8c0-1 1-2 2-2h18c1 0 2 1 2 2v8z" fill="none"/><path d="M21 6H3C2 6 1 7 1 8v8c0 1 1 2 2 2h18c1 0 2-1 2-2V8c0-1-1-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm4-3c-.8 0-1.5-.7-1.5-1.5S18.7 9 19.5 9s1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"/>`
};

export const ICON_GAME_CONTROLLER: IIcon = {
	selector: "game-controller",
	viewBox,
	template: `<path d="M5 19c-.33.3-.77.5-1.25.5-.97 0-1.75-.78-1.75-1.75v-.25l1-7.38C3.2 7.82 5.14 6 7.5 6h9c2.36 0 4.3 1.8 4.5 4.12l1 7.38v.25c0 .97-.78 1.75-1.75 1.75-.48 0-.92-.2-1.25-.5l-2.97-3H7.97zm3.97-4.35h7.33l2.36 2.25c.27.24 1.03 1.02 1.43 1.02.8 0 .2-2.25.2-2.25l-.8-5.3c-.2-1.84-1.8-3.05-3.78-3.05H8.7c-1.98 0-4.03 1.2-4.2 3.06l-.87 5.93c0 .8-.15 1.6.66 1.6.4 0 2.9-2.96 3.2-3.2z"/><path d="M7 8.08v2H5v1h2v2h1v-2h2v-1H8v-2H7m9.5 0c-.42 0-.75.33-.75.75 0 .4.33.75.75.75.4 0 .75-.34.75-.75 0-.42-.34-.75-.75-.75m-1.75 1.75c-.42 0-.75.33-.75.75 0 .4.33.75.75.75.4 0 .75-.34.75-.75 0-.42-.34-.75-.75-.75m3.5 0c-.42 0-.75.33-.75.75 0 .4.33.75.75.75.4 0 .75-.34.75-.75 0-.42-.34-.75-.75-.75m-1.75 1.75c-.42 0-.75.33-.75.75 0 .4.33.75.75.75.4 0 .75-.34.75-.75 0-.42-.34-.75-.75-.75z"/>`
};

export const ICON_GAME_CONTROLLER_FILL: IIcon = {
	selector: "game-controller-fill",
	viewBox,
	template: `<path d="M7.97 16L5 19c-.33.3-.77.5-1.25.5A1.75 1.75 0 0 1 2 17.75v-.25l1-7.38C3.2 7.82 5.14 6 7.5 6h9c2.36 0 4.3 1.8 4.5 4.12l1 7.38v.25a1.75 1.75 0 0 1-1.75 1.75c-.48 0-.92-.2-1.25-.5l-2.97-3H7.97M7 8v2H5v1h2v2h1v-2h2v-1H8V8H7m9.5 0a.75.75 0 0 0-.75.75.75.75 0 0 0 .75.75.75.75 0 0 0 .75-.75.75.75 0 0 0-.75-.75m-1.75 1.75a.75.75 0 0 0-.75.75.75.75 0 0 0 .75.75.75.75 0 0 0 .75-.75.75.75 0 0 0-.75-.75m3.5 0a.75.75 0 0 0-.75.75.75.75 0 0 0 .75.75.75.75 0 0 0 .75-.75.75.75 0 0 0-.75-.75M16.5 11.5a.75.75 0 0 0-.75.75.75.75 0 0 0 .75.75.75.75 0 0 0 .75-.75.75.75 0 0 0-.75-.75z"/>`
};

export const ICON_AMERICAN_FOOTBALL: IIcon = {
	selector: "american-football",
	viewBox,
	template: `<path d="M7.5 7.5c1.67-1.63 3.8-2.8 5.87-3.32 2.1-.5 4.13-.35 5.23-.18 1.1.15 1.27.3 1.43 1.4.15 1.1.3 3.15-.2 5.23-.52 2.08-1.7 4.2-3.33 5.87-1.67 1.63-3.8 2.8-5.87 3.32-2.08.5-4.13.36-5.22.2-1.1-.15-1.22-.3-1.4-1.42-.14-1.1-.3-3.14.2-5.23.5-2.08 1.7-4.2 3.3-5.87m-.2 8.3l.9.9 1.25-1.2 1.2 1.2.92-.9-1.2-1.22L12 12.9l1.2 1.22.92-.9-1.2-1.22 1.66-1.66 1.2 1.2.92-.9-1.2-1.22 1.2-1.2-.9-.92-1.22 1.2-1.2-1.2-.92.9 1.2 1.22L12 11.1l-1.2-1.22-.92.9 1.2 1.22-1.66 1.66-1.2-1.2-.92.9 1.2 1.22-1.2 1.2z"/>`
};

export const ICON_AMERICAN_FOOTBALL_FILL: IIcon = {
	selector: "american-football-fill",
	viewBox: ICON_AMERICAN_FOOTBALL.viewBox,
	template: ICON_AMERICAN_FOOTBALL.template
};

export const ICON_BODY: IIcon = {
	selector: "body",
	viewBox,
	template: `<path d="M0 0h24v24H0z" fill="none"/><path d="M21 9h-6v13h-2v-6h-2v6H9V9H3V7h18zm-9-7c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2zm0 .5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm1.6 13v6h.8v-13h6v-1h-17v1h6.2v13h.8v-6z"/>`
};

export const ICON_BODY_FILL: IIcon = {
	selector: "body-fill",
	viewBox,
	template: `<path d="M0 0h24v24H0z" fill="none"/><path d="M12 2c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>`
};

export const ICON_PERSON: IIcon = {
	selector: "person",
	viewBox,
	template: `<path d="M12,13C9.33,13 4,14.33 4,17V20H20V17C20,14.33 14.67,13 12,13M12,4A4,4 0 0,0 8,8A4,4 0 0,0 12,12A4,4 0 0,0 16,8A4,4 0 0,0 12,4M12,14.9C14.97,14.9 18.1,16.36 18.1,17V18.1H5.9V17C5.9,16.36 9,14.9 12,14.9M12,5.9A2.1,2.1 0 0,1 14.1,8A2.1,2.1 0 0,1 12,10.1A2.1,2.1 0 0,1 9.9,8A2.1,2.1 0 0,1 12,5.9Z" />`
};

export const ICON_PERSON_FILL: IIcon = {
	selector: "person-fill",
	viewBox,
	template: `<path d="M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.4 0 8 1.8 8 4v2H4v-2c0-2.2 3.6-4 8-4z"/>`
};

export const ICON_PERSON_ADD: IIcon = {
	selector: "person-add",
	viewBox,
	template: `<path d="M14.75 13.03c-2.67 0-8 1.33-8 4v3h16v-3c0-2.67-5.33-4-8-4m0-9c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4m0 10.9c2.97 0 6.1 1.46 6.1 2.1v1.1H8.65v-1.1c0-.64 3.1-2.1 6.1-2.1m0-9c1.16 0 2.1.94 2.1 2.1 0 1.16-.94 2.1-2.1 2.1-1.16 0-2.1-.94-2.1-2.1 0-1.16.94-2.1 2.1-2.1zM6.1 9.85v-3h-2v3h-3v2h3v3h2v-3h3v-2"/>`
};

export const ICON_PERSON_ADD_FILL: IIcon = {
	selector: "person-add-fill",
	viewBox,
	template: `<path d="M15 14c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4m-9-4V7H4v3H1v2h3v3h2v-3h3v-2m6 2a4 4 0 0 0 4-4 4 4 0 0 0-4-4 4 4 0 0 0-4 4 4 4 0 0 0 4 4z"/>`
};

export const ICON_PEOPLE: IIcon = {
	selector: "people",
	viewBox,
	template: `<path d="M16.5 6.5a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2m0 5.5A3.5 3.5 0 0 0 20 8.5 3.5 3.5 0 0 0 16.5 5 3.5 3.5 0 0 0 13 8.5a3.5 3.5 0 0 0 3.5 3.5m-9-5.5a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2m0 5.5A3.5 3.5 0 0 0 11 8.5 3.5 3.5 0 0 0 7.5 5 3.5 3.5 0 0 0 4 8.5 3.5 3.5 0 0 0 7.5 12m14 5.5H14v-1.3c0-.4-.2-.8-.5-1.2 1-.3 2-.5 3-.5 2.4 0 5 1.2 5 1.8m-9 1.2h-10v-1.3c0-.5 2.6-1.7 5-1.7s5 1.2 5 1.8m4-3.3c-1.2 0-3 .3-4.5 1-1.4-.7-3.3-1-4.5-1C5.3 13 1 14 1 16.3V19h22v-2.8c0-2-4.3-3.2-6.5-3.2z"/>`
};

export const ICON_PEOPLE_FILL: IIcon = {
	selector: "people-fill",
	viewBox,
	template: `<path d="M16 13h-1c1.2 1 2 2 2 3.5V19h6v-2.5c0-2.3-4.7-3.5-7-3.5m-8 0c-2.3 0-7 1.2-7 3.5V19h14v-2.5c0-2.3-4.7-3.5-7-3.5m0-2a3 3 0 0 0 3-3 3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3m8 0a3 3 0 0 0 3-3 3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3z"/>`
};

export const ICON_MUSIC_NOTE: IIcon = {
	selector: "music-note",
	viewBox,
	template: `<path d="M0 0h24v24H0z" fill="none"/><path d="M12 3v10.6c-.6-.4-1.3-.6-2-.6-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4V7h4V3h-6z"/>`
};

export const ICON_MUSIC_NOTES: IIcon = {
	selector: "music-notes",
	viewBox,
	template: `<path d="M0 0h24v24H0z" fill="none"/><path d="M6.84 4.6l-.06 11.08c-.54-.3-1.16-.5-1.83-.5-2.03 0-3.67 1.64-3.67 3.67 0 2.02 1.64 3.66 3.67 3.66 2.02 0 3.67-1.62 3.67-3.64l.06-10.6 9.76-2.58v7.3c-.55-.32-1.17-.5-1.84-.5-2.02 0-3.66 1.63-3.66 3.66 0 2.02 1.64 3.66 3.66 3.66 2.03 0 3.67-1.65 3.67-3.67l.03-14.55-13.46 3z"/>`
};

export const ICON_BELL: IIcon = {
	selector: "bell",
	viewBox,
	template: `<path d="M16 17H7v-6.5C7 8 9 6 11.5 6S16 8 16 10.5m2 5.5v-5.5c0-3-2-5.6-5-6.3v-.7A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5v.7C7 5 5 7.4 5 10.5V16l-2 2v1h17v-1m-8.5 4a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2z"/>`
};

export const ICON_BELL_FILL: IIcon = {
	selector: "bell-fill",
	viewBox,
	template: `<path d="M14 20a2 2 0 0 1-2 2 2 2 0 0 1-2-2h4M12 2a1 1 0 0 1 1 1v1c2.8.6 5 3 5 6v6l3 3H3l3-3v-6c0-3 2.2-5.4 5-6V3a1 1 0 0 1 1-1z"/>`
};

export const ICON_MICROPHONE: IIcon = {
	selector: "microphone",
	viewBox,
	template: `<path d="M17.3 11c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.4 2.72 6.23 6 6.72V21h2v-3.28c3.28-.5 6-3.3 6-6.72m-8.2-6.1c0-.66.54-1.2 1.2-1.2.66 0 1.2.54 1.2 1.2v6.2c0 .66-.54 1.2-1.2 1.2-.66 0-1.2-.54-1.2-1.2M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3 3 3 0 0 0-3 3v6a3 3 0 0 0 3 3z"/>`
};

export const ICON_MICROPHONE_FILL: IIcon = {
	selector: "microphone-fill",
	viewBox,
	template: `<path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V5a3 3 0 0 1 3-3m7 9c0 3.5-2.6 6.4-6 7v3h-2v-3c-3.4-.6-6-3.5-6-7h2a5 5 0 0 0 5 5 5 5 0 0 0 5-5h2z"/>`
};

export const ICON_MICROPHONE_OFF: IIcon = {
	selector: "microphone-off",
	viewBox,
	template: `<path d="M19 11c0 1.2-.34 2.3-.9 3.28l-1.23-1.23c.27-.62.43-1.3.43-2.05H19m-4 .16L9 5.18V5a3 3 0 0 1 3-3 3 3 0 0 1 3 3v6.16M4.27 3L21 19.73 19.73 21l-4.2-4.2c-.76.47-1.62.78-2.53.92V21h-2v-3.28c-3.28-.5-6-3.3-6-6.72h1.7c0 3 2.54 5.1 5.3 5.1.8 0 1.6-.2 2.3-.52l-1.65-1.66L12 14a3 3 0 0 1-3-3v-.72l-6-6L4.27 3z"/>`
};

export const ICON_VOLUME_LOW: IIcon = {
	selector: "volume-low",
	viewBox,
	template: `<path d="M7,9V15H11L16,20V4L11,9H7Z" />`
};

export const ICON_VOLUME_HIGH: IIcon = {
	selector: "volume-high",
	viewBox,
	template: `<path d="M14 3.2v2c3 1 5 3.6 5 6.8 0 3.2-2 5.8-5 6.7v2c4-.8 7-4.4 7-8.7 0-4.3-3-8-7-8.8m2.5 8.8c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4M3 9v6h4l5 5V4L7 9H3z"/>`
};

export const ICON_VOLUME_OFF: IIcon = {
	selector: "volume-off",
	viewBox,
	template: `<path d="M12 4l-2 2 2 2.2M4.3 3L3 4.3 7.7 9H3v6h4l5 5v-6.7l4.3 4.2c-.7.5-1.5 1-2.3 1.2v2c1.4-.3 2.6-1 3.7-1.7l2 2 1.3-1.3-9-9m7 1.3c0 1-.2 1.8-.5 2.6L20 16c.6-1 1-2.5 1-4 0-4.3-3-8-7-8.8v2c3 1 5 3.6 5 6.8m-2.5 0c0-1.8-1-3.3-2.5-4v2.2l2.4 2.4V12z"/>`
};

export const ICON_PLAY: IIcon = {
	selector: "play",
	viewBox,
	template: `<path d="M8 5.14v14l11-7zm9.56 7l-8.7 5.52V6.6z"/>`
};

export const ICON_PLAY_FILL: IIcon = {
	selector: "play-fill",
	viewBox,
	template: `<path d="M8,5.14V19.14L19,12.14L8,5.14Z" />`
};

export const ICON_PLAY_CIRCLE: IIcon = {
	selector: "play-circle",
	viewBox,
	template: `<path d="M12 20c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m-2 14.5l6-4.5-6-4.5v9z"/>`
};

export const ICON_PLAY_CIRCLE_FILL: IIcon = {
	selector: "play-circle-fill",
	viewBox,
	template: `<path d="M10,16.5V7.5L16,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />`
};

export const ICON_PAUSE: IIcon = {
	selector: "pause",
	viewBox,
	template: `<path d="M14 19h4V5h-4zm-8 0h4V5H6zm.6-13.3h2.8v12.7H6.6zm8 0h2.8v12.6h-2.8z"/>`
};

export const ICON_PAUSE_FILL: IIcon = {
	selector: "pause-fill",
	viewBox,
	template: `<path d="M14,19H18V5H14M6,19H10V5H6V19Z" />`
};

export const ICON_PAUSE_CIRCLE: IIcon = {
	selector: "pause-circle",
	viewBox,
	template: `<path d="M13,16V8H15V16H13M9,16V8H11V16H9M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z" />`
};

export const ICON_PAUSE_CIRCLE_FILL: IIcon = {
	selector: "pause-circle-fill",
	viewBox,
	template: `<path d="M15,16H13V8H15M11,16H9V8H11M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />`
};

export const ICON_STOP: IIcon = {
	selector: "stop",
	viewBox,
	template: `<path d="M18 18H6V6h12zm-.8-11.3H6.8v10.5h10.4z"/>`
};

export const ICON_STOP_FILL: IIcon = {
	selector: "stop-fill",
	viewBox,
	template: `<path d="M18,18H6V6H18V18Z" />`
};

export const ICON_STOP_CIRCLE: IIcon = {
	selector: "stop-circle",
	viewBox,
	template: `<path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 2c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8 3.6-8 8-8M9 9v6h6V9"/>`
};

export const ICON_STOP_CIRCLE_FILL: IIcon = {
	selector: "stop-circle-fill",
	viewBox,
	template: `<path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M9,9H15V15H9" />`
};

export const ICON_RECORDING: IIcon = {
	selector: "recording",
	viewBox,
	template: `<path d="M18.5,15A3.5,3.5 0 0,1 15,11.5A3.5,3.5 0 0,1 18.5,8A3.5,3.5 0 0,1 22,11.5A3.5,3.5 0 0,1 18.5,15M5.5,15A3.5,3.5 0 0,1 2,11.5A3.5,3.5 0 0,1 5.5,8A3.5,3.5 0 0,1 9,11.5A3.5,3.5 0 0,1 5.5,15M18.5,6A5.5,5.5 0 0,0 13,11.5C13,12.83 13.47,14.05 14.26,15H9.74C10.53,14.05 11,12.83 11,11.5A5.5,5.5 0 0,0 5.5,6A5.5,5.5 0 0,0 0,11.5A5.5,5.5 0 0,0 5.5,17H18.5A5.5,5.5 0 0,0 24,11.5A5.5,5.5 0 0,0 18.5,6Z" />`
};

export const ICON_RECORDING_FILL: IIcon = {
	selector: "recording-fill",
	viewBox: ICON_RECORDING.viewBox,
	template: ICON_RECORDING.template
};

export const ICON_FASTFORWARD: IIcon = {
	selector: "fastforward",
	viewBox,
	template: `<path d="M3.9 6.13v11.72L13.04 12zm7.94 5.85l-7.2 4.63V7.38zm1.22-6.14v11.73l9.12-5.87zM21 11.7l-7.22 4.63V7.07z"/>`
};

export const ICON_FASTFORWARD_FILL: IIcon = {
	selector: "fastforward-fill",
	viewBox,
	template: `<path d="M13,6V18L21.5,12M4,18L12.5,12L4,6V18Z" />`
};

export const ICON_REWIND: IIcon = {
	selector: "rewind",
	viewBox,
	template: `<path d="M20.37 6.13v11.72L11.25 12zm-7.93 5.85l7.2 4.63V7.37zm-1.22-6.14v11.72L2.1 11.7zM3.3 11.7l7.2 4.63V7.07z"/>`
};

export const ICON_REWIND_FILL: IIcon = {
	selector: "rewind-fill",
	viewBox,
	template: `<path d="M11.5,12L20,18V6M11,18V6L2.5,12L11,18Z" />`
};

export const ICON_SKIP_BACKWARD: IIcon = {
	selector: "skip-backward",
	viewBox,
	template: `<path d="M8.18 6v12h-2V6zm-.62.7h-.83v10.63h.83z"/><path d="M24 0H0v24h24z" fill="none"/><path d="M18.12 6.15V17.4l-8.84-5.62zm-7.68 5.62l6.98 4.45v-8.9z"/>`
};

export const ICON_SKIP_BACKWARD_FILL: IIcon = {
	selector: "skip-backward-fill",
	viewBox,
	template: `<path d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z" />`
};

export const ICON_SKIP_FORWARD: IIcon = {
	selector: "skip-forward",
	viewBox,
	template: `<path d="M16 6v12h2V6zm.62.7h.82v10.63h-.82z"/><path d="M0 0h24v24H0z" fill="none"/><path d="M6.06 6.15V17.4l8.84-5.62zm7.68 5.62l-7 4.45v-8.9z"/>`
};

export const ICON_SKIP_FORWARD_FILL: IIcon = {
	selector: "skip-forward-fill",
	viewBox,
	template: `<path d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z" />`
};

export const ICON_SHUFFLE: IIcon = {
	selector: "shuffle",
	viewBox,
	template: `<path d="M14.8 13.4l-1.4 1.4 3.2 3-2 2.2H20v-5.5l-2 2-3.2-3M14.5 4l2 2L4 18.6 5.4 20 18 7.5l2 2V4m-9.4 5.2L5.4 4 4 5.4l5.2 5.2 1.4-1.4z"/>`
};

export const ICON_VIDEO_CAMERA: IIcon = {
	selector: "video-camera",
	viewBox,
	template: `<path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zm-1-2.8v8.57c0 .47-.37.85-.85.85H4.9c-.48 0-.87-.38-.87-.85V7.72c0-.48.4-.86.86-.86h10.24c.48 0 .86.38.86.85zm4.02 1.13v6.06l-3.04-3.04 3.04-3.04z"/>`
};

export const ICON_VIDEO_CAMERA_FILL: IIcon = {
	selector: "video-camera-fill",
	viewBox,
	template: `<path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/>`
};

export const ICON_FILM: IIcon = {
	selector: "film",
	viewBox,
	template: `<path d="M18 9h-2V7h2m0 6h-2v-2h2m0 6h-2v-2h2M8 9H6V7h2m0 6H6v-2h2m0 6H6v-2h2M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2z"/>`
};

export const ICON_FILM_FILL: IIcon = {
	selector: "film-fill",
	viewBox: ICON_FILM.viewBox,
	template: ICON_FILM.template
};

export const ICON_FLASK: IIcon = {
	selector: "flask",
	viewBox,
	template: `<path d="M5 19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1c0-.2-.07-.4-.18-.57L13 8.35V4h-2v4.35L5.18 18.43c-.1.16-.18.36-.18.57m1 3a3 3 0 0 1-3-3c0-.6.18-1.16.5-1.63L9 7.8V6a1 1 0 0 1-1-1V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1v1.8l5.5 9.57c.32.47.5 1.03.5 1.63a3 3 0 0 1-3 3H6m7-6l1.34-1.34L16.27 18H7.73l2.66-4.6L13 16m-.5-4a.5.5 0 0 1 .5.5.5.5 0 0 1-.5.5.5.5 0 0 1-.5-.5.5.5 0 0 1 .5-.5z"/>`
};

export const ICON_FLASK_FILL: IIcon = {
	selector: "flask-fill",
	viewBox,
	template: `<path d="M6 22a3 3 0 0 1-3-3c0-.6.18-1.16.5-1.63L9 7.8V6a1 1 0 0 1-1-1V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1v1.8l5.5 9.57c.32.47.5 1.03.5 1.63a3 3 0 0 1-3 3H6m-1-3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1c0-.2-.07-.4-.18-.57l-2.3-3.96L14 17l-5.07-5.07-3.75 6.5c-.1.16-.18.36-.18.57m8-9a1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1 1 1 0 0 0-1-1z"/>`
};

export const ICON_LIGHTBULB: IIcon = {
	selector: "lightbulb",
	viewBox,
	template: `<path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 0 1 7-7M9 21v-1h6v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1m3-17a5 5 0 0 0-5 5c0 2 1.2 3.8 3 4.6V16h4v-2.4c1.8-.8 3-2.5 3-4.6a5 5 0 0 0-5-5z"/>`
};

export const ICON_LIGHTBULB_FILL: IIcon = {
	selector: "lightbulb-fill",
	viewBox,
	template: `<path d="M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.5 3 5.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3c1.8-1.2 3-3.3 3-5.7a7 7 0 0 0-7-7M9 21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1z"/>`
};

export const ICON_WINE: IIcon = {
	selector: "wine",
	viewBox,
	template: `<path d="M8 2h8c-.33 3-.67 6-1.25 7.83-.58 1.84-1.42 2.5-1.83 4.25-.42 1.75-.42 4.6.16 5.92.6 1.33 1.75 1.17 2.34 1.25.58.08.58.42.58.75H8c0-.33 0-.67.58-.75.6-.08 1.75.08 2.34-1.25.58-1.33.58-4.17.16-5.92-.4-1.75-1.25-2.4-1.83-4.25C8.67 8 8.33 5 8 2m2 2c.07 1.03.15 2.07.24 3h3.52c.1-.93.17-1.97.24-3h-4z"/>`
};

export const ICON_WINE_FILL: IIcon = {
	selector: "wine-fill",
	viewBox: ICON_WINE.viewBox,
	template: ICON_WINE.template
};

export const ICON_BEER: IIcon = {
	selector: "beer",
	viewBox,
	template: `<path d="M4 2h15l-2 20H6L4 2m2.2 2l1.6 16h1L7.4 6.3C8.4 6 10 6 11 7c1.6 1.6 4.3.7 5.5.2l.3-3.2H6.2z"/>`
};

export const ICON_BEER_FILL: IIcon = {
	selector: "beer-fill",
	viewBox: ICON_BEER.viewBox,
	template: ICON_BEER.template
};

export const ICON_NUTRITION: IIcon = {
	selector: "nutrition",
	viewBox,
	template: `<path d="M16 10l-.2 1h-2.3a.5.5 0 0 0-.5.5.5.5 0 0 0 .5.5h2.1l-1 5h-2.1a.5.5 0 0 0-.5.5.5.5 0 0 0 .5.5h1.9l-.4 2a2 2 0 0 1-2 2 2 2 0 0 1-2-2l-1-5h1.5a.5.5 0 0 0 .5-.5.5.5 0 0 0-.5-.5H8.8L8 10c0-1.2.93-2.23 2.3-2.7L8.9 5.27c-.3-.46-.2-1.08.26-1.4.45-.3 1.07-.2 1.4.26l.44.66V3a1 1 0 0 1 1-1 1 1 0 0 1 1 1v2.28l1.5-1.74c.33-.42.97-.47 1.4-.1.4.34.46.97.1 1.4l-2.13 2.5C15.14 7.84 16 8.84 16 10z"/>`
};

export const ICON_NUTRITION_FILL: IIcon = {
	selector: "nutrition-fill",
	viewBox: ICON_NUTRITION.viewBox,
	template: ICON_NUTRITION.template
};

export const ICON_FLOWER: IIcon = {
	selector: "flower",
	viewBox,
	template: `<path d="M3 13a9 9 0 0 0 9 9c0-5-4.03-9-9-9m9-7.5A2.5 2.5 0 0 1 14.5 8a2.5 2.5 0 0 1-2.5 2.5A2.5 2.5 0 0 1 9.5 8 2.5 2.5 0 0 1 12 5.5m-6.4 4.75a2.5 2.5 0 0 0 2.5 2.5c.53 0 1.02-.17 1.4-.44v.2A2.5 2.5 0 0 0 12 15a2.5 2.5 0 0 0 2.5-2.5v-.2c.38.28.87.45 1.4.45 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.85-1.43-2.25.84-.4 1.43-1.26 1.43-2.25 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.02.16-1.4.44v-.2A2.5 2.5 0 0 0 12 1a2.5 2.5 0 0 0-2.5 2.5v.2c-.38-.3-.87-.45-1.4-.45a2.5 2.5 0 0 0-2.5 2.5c0 1 .6 1.85 1.43 2.25-.84.4-1.43 1.25-1.43 2.25M12 22a9 9 0 0 0 9-9c-5 0-9 4-9 9z"/>`
};

export const ICON_FLOWER_FILL: IIcon = {
	selector: "flower-fill",
	viewBox: ICON_FLOWER.viewBox,
	template: ICON_FLOWER.template
};

export const ICON_FLAME: IIcon = {
	selector: "flame",
	viewBox,
	template: `<path d="M13.5.7s.7 2.6.7 4.8c0 2-1.3 3.7-3.4 3.7-2 0-3.6-1.7-3.6-3.7V5C5.2 7.6 4 10.7 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8C20 8.6 17.4 3.8 13.5.7zM11.7 19c-1.8 0-3.2-1.4-3.2-3 0-1.8 1-3 2.8-3.3 1.8-.3 3.6-1.2 4.6-2.5.2 1.2.4 2.6.4 4 0 2.6-2 4.8-4.8 4.8z"/><path d="M0 0h24v24H0z" fill="none"/>`
};

export const ICON_FLAME_FILL: IIcon = {
	selector: "flame-fill",
	viewBox: ICON_FLAME.viewBox,
	template: ICON_FLAME.template
};

export const ICON_SUNNY: IIcon = {
	selector: "sunny",
	viewBox,
	template: `<path d="M6 11.5c0 3.3 2.7 6 6 6s6-2.7 6-6c0-3.32-2.7-6-6-6s-6 2.7-6 6zm11.24 6.66l1.8 1.8 1.4-1.42-1.78-1.8zm-13.7.38l1.42 1.4 1.8-1.78-1.42-1.42zm16.9-14.08l-1.4-1.4-1.8 1.78 1.42 1.42zm-13.68.38l-1.8-1.8-1.4 1.42 1.78 1.8zM20 12.5h3v-2h-3zm-16-2H1v2h3zm9-9.95h-2V3.5h2zm-2 21.9h2V19.5h-2zm5.82-10.97c0 2.67-2.16 4.84-4.84 4.84-2.67 0-4.83-2.17-4.83-4.84s2.16-4.84 4.83-4.84c2.68 0 4.84 2.17 4.84 4.84z"/>`
};

export const ICON_SUNNY_FILL: IIcon = {
	selector: "sunny-fill",
	viewBox,
	template: `<path d="M3.5 18.5L5 20l1.8-2-1.5-1.5m5.7 5.8h2v-3h-2m1-14a6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 6-6c0-3.3-2.7-6-6-6m8 7h3v-2h-3M17.2 18l1.8 2 1.4-1.5-1.7-1.8m1.8-12.2L19 3l-1.8 1.8 1.5 1.5M13 .5h-2v3h2m-9 7H1v2h3m2.8-7.7L5 3 3.5 4.5l1.8 1.8 1.5-1.5z"/>`
};

export const ICON_WARNING: IIcon = {
	selector: "warning",
	viewBox,
	template: `<path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>`
};

export const ICON_ERROR: IIcon = {
	selector: "error",
	viewBox,
	template: `<path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>`
};

export const ICON_CODE_TAGS: IIcon = {
	selector: "code-tags",
	viewBox,
	template: `<path d="M14.6 16.6l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4m-5.2 0L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4z"/>`
};

export const ICON_CODE_BRACES: IIcon = {
	selector: "code-braces",
	viewBox,
	template: `<path d="M8 3a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2H3v2h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2v-2H8v-5a2 2 0 0 0-2-2 2 2 0 0 0 2-2V5h2V3m6 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5h-2V3h2z"/>`
};

export const ICON_FINGERPRINT: IIcon = {
	selector: "fingerprint",
	viewBox,
	template: `<path d="M11.83 1.73c-3.4.06-5.6 1.59-5.6 1.59-.28.18-.35.59-.16.87.2.31.59.36.89.15 0 0 4.31-3.19 10.5.04.29.17.68.07.85-.23.19-.3.06-.68-.28-.87-1.67-.88-3.25-1.32-4.67-1.48-.53-.06-1.04-.08-1.53-.07m.39 2.61c-5.96-.08-8.81 4.71-8.81 4.71-.19.29-.11.67.17.86.29.19.68.09.92-.23 0 0 2.42-4.18 7.7-4.09 5.3.07 7.62 4.06 7.62 4.06.18.29.56.39.86.22.32-.18.39-.56.22-.87 0 0-2.75-4.58-8.68-4.66m-.72 2.48c-1.68.12-3.29.73-4.5 1.74C4.62 10.53 3.1 14.14 4.77 19c.11.33.47.5.8.39.32-.11.5-.47.38-.79-1.54-4.47-.17-7.4 1.85-9.1 1.97-1.61 5.45-2 8.04-.4 1.27.8 2.26 2.18 2.76 3.54.51 1.36.48 2.68.07 3.3-.42.65-1.27.89-2.02.7-.75-.19-1.36-.73-1.39-1.87-.03-1.71-1.37-2.77-2.76-2.93-1.34-.16-2.89.56-3.29 2.16-.76 2.92 1.15 7.07 5.57 8.45.33.1.68-.08.79-.41.1-.33-.07-.69-.42-.79-3.83-1.19-5.28-4.82-4.73-6.96.24-.96 1.08-1.29 1.96-1.21.87.1 1.62.62 1.62 1.71.05 1.64 1.12 2.75 2.34 3.06 1.22.31 2.63-.08 3.38-1.23.78-1.17.65-2.82.06-4.41-.6-1.6-1.71-3.18-3.28-4.17-1.54-.96-3.31-1.34-5-1.22m.36 2.43v.01c-1.78.06-3.56.98-4.58 2.92-1.32 2.49-.72 5.03.16 6.86.89 1.84 2.1 3.06 2.1 3.06.24.25.63.25.88.01s.25-.61.01-.88c0 0-1.07-1.1-1.86-2.73s-1.27-3.69-.19-5.73c1.12-2.1 3.12-2.61 4.88-2.1 1.78.52 3.27 2.07 3.24 4.36-.04.35.21.65.56.67.34.03.64-.23.67-.64.06-2.86-1.86-4.93-4.12-5.59-.57-.16-1.16-.24-1.75-.22m.22 5c-.35.01-.62.3-.61.64 0 0 .03 1.48.84 2.91.84 1.43 2.62 2.79 5.72 2.5.34-.02.61-.3.59-.66-.02-.35-.32-.61-.71-.58-2.72.25-3.87-.78-4.52-1.89-.65-1.1-.67-2.29-.67-2.29 0-.35-.28-.63-.64-.63z"/>`
};

export const ICON_HISTORY: IIcon = {
	selector: "history",
	viewBox,
	template: `<path d="M11 7v5l4.7 3 .8-1.4-4-2.3V7m0-5C9 2 6 4 4.3 6.8L2 4.5V11h6.5L5.7 8.2C7 5.8 9.7 4 12.7 4a7.5 7.5 0 0 1 7.4 7.5 7.5 7.5 0 0 1-7.4 7.5c-3.3 0-6-2-7-5H3.2c1 4 4.8 7 9.2 7 5.2 0 9.5-4.3 9.5-9.5A9.5 9.5 0 0 0 12.4 2z"/>`
};

export const ICON_RECEIPT: IIcon = {
	selector: "receipt",
	viewBox,
	template: `<path d="M3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2m15 7H6V7h12m0 6H6v-2h12m0 6H6v-2h12v2z"/>`
};

export const ICON_MENU: IIcon = {
	selector: "menu",
	viewBox,
	template: `<path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />`
};

export const ICON_VERIFIED: IIcon = {
	selector: "verified",
	viewBox,
	template: `<path d="M10 17l-4-4 1.4-1.4 2.6 2.6 6.6-6.6L18 9m-6-8L3 5v6c0 5.6 3.8 10.7 9 12 5.2-1.3 9-6.4 9-12V5l-9-4z"/>`
};

export const ICON_ZOOM_IN: IIcon = {
	selector: "zoom-in",
	viewBox,
	template: `<path d="M15.5 14h-.8l-.3-.3c1-1 1.6-2.6 1.6-4.2C16 6 13 3 9.5 3S3 6 3 9.5 6 16 9.5 16c1.6 0 3-.6 4.2-1.6l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z"/><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>`
};

export const ICON_ZOOM_OUT: IIcon = {
	selector: "zoom-out",
	viewBox,
	template: `<path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.8l-.3-.3c1-1 1.6-2.6 1.6-4.2C16 6 13 3 9.5 3S3 6 3 9.5 6 16 9.5 16c1.6 0 3-.6 4.2-1.6l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14zM7 9h5v1H7z"/>`
};

export const ICON_BACKSPACE: IIcon = {
	selector: "backspace",
	viewBox,
	template: `<path d="M22 3H7c-.7 0-1.2.4-1.6 1L0 12l5.4 8c.4.6 1 1 1.6 1h15a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-3 12.6L17.6 17 14 13.4 10.4 17 9 15.6l3.6-3.6L9 8.4 10.4 7l3.6 3.6L17.6 7 19 8.4 15.4 12"/>`
};

export const ICON_RETURN: IIcon = {
	selector: "return",
	viewBox,
	template: `<path d="M19 7v4H5.8l3.6-3.6L8 6l-6 6 6 6 1.4-1.4L5.8 13H21V7h-2z"/>`
};

export const ICON_TAB: IIcon = {
	selector: "tab",
	viewBox,
	template: `<path d="M20 18h2V6h-2m-8.4 1.4l3.6 3.6H1v2h14.2l-3.6 3.6L13 18l6-6-6-6-1.4 1.4z"/>`
};

export const ICON_CAPS: IIcon = {
	selector: "caps",
	viewBox,
	template: `<path d="M15 14V8h2.2L12 2.8 6.8 8H9v6h6M12 0l10 10h-5v6H7v-6H2L12 0M7 18h10v6H7v-6m8 2H9v2h6v-2z"/>`
};

export const ICON_COMMAND: IIcon = {
	selector: "command",
	viewBox,
	template: `<path d="M6 2a4 4 0 0 1 4 4v2h4V6a4 4 0 0 1 4-4 4 4 0 0 1 4 4 4 4 0 0 1-4 4h-2v4h2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4v-2h-4v2a4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4h2v-4H6a4 4 0 0 1-4-4 4 4 0 0 1 4-4m10 16a2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2h-2v2m-2-8h-4v4h4v-4m-8 6a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2v-2H6M8 6a2 2 0 0 0-2-2 2 2 0 0 0-2 2 2 2 0 0 0 2 2h2V6m10 2a2 2 0 0 0 2-2 2 2 0 0 0-2-2 2 2 0 0 0-2 2v2h2z"/>`
};

export const ICON_OPTION: IIcon = {
	selector: "option",
	viewBox,
	template: `<path d="M3 4h6l7 14h5v2h-6L7.7 6H3V4m11 0h7v2h-7V4z"/>`
};

export const ICON_SHIFT: IIcon = {
	selector: "shift",
	viewBox,
	template: `<path d="M15 18v-6h2.2L12 6.8 6.8 12H9v6h6M12 4l10 10h-5v6H7v-6H2L12 4z"/>`
};

export const ICON_KEYBOARD: IIcon = {
	selector: "keyboard",
	viewBox,
	template: `<path d="M19 10h-2V8h2m0 5h-2v-2h2m-3-1h-2V8h2m0 5h-2v-2h2m0 6H8v-2h8m-9-5H5V8h2m0 5H5v-2h2m1 0h2v2H8m0-5h2v2H8m3 1h2v2h-2m0-5h2v2h-2m9-5H4C3 5 2 6 2 7v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7c0-1-1-2-2-2z"/>`
};

export const ICON_KEYBOARD_HIDE: IIcon = {
	selector: "keyboard-hide",
	viewBox,
	template: `<path d="M12 23l4-4H8M19 8h-2V6h2m0 5h-2V9h2m-3-1h-2V6h2m0 5h-2V9h2m0 6H8v-2h8M7 8H5V6h2m0 5H5V9h2m1 0h2v2H8m0-5h2v2H8m3 1h2v2h-2m0-5h2v2h-2m9-5H4C3 3 2 4 2 5v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5c0-1-1-2-2-2z"/>`
};

export const ICON_MOUSE: IIcon = {
	selector: "mouse",
	viewBox,
	template: `<path d="M11 1c-4 .6-7 4-7 8h7m-7 6a8 8 0 0 0 8 8 8 8 0 0 0 8-8v-4H4m9-10v8h7c0-4-3-7.4-7-8z"/>`
};

export const ICON_CUT: IIcon = {
	selector: "cut",
	viewBox,
	template: `<path d="M19 3l-6 6 2 2 7-7V3m-10 9.5a.5.5 0 0 1-.5-.5.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5.5.5 0 0 1-.5.5M6 20a2 2 0 0 1-2-2c0-1 1-2 2-2a2 2 0 0 1 2 2c0 1-1 2-2 2M6 8a2 2 0 0 1-2-2c0-1 1-2 2-2a2 2 0 0 1 2 2c0 1-1 2-2 2m3.6-.4c.3-.5.4-1 .4-1.6a4 4 0 0 0-4-4 4 4 0 0 0-4 4 4 4 0 0 0 4 4c.6 0 1 0 1.6-.4L10 12l-2.4 2.4C7 14 6.6 14 6 14a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4c0-.6 0-1-.4-1.6L12 14l7 7h3v-1L9.6 7.6z"/>`
};

export const ICON_COPY: IIcon = {
	selector: "copy",
	viewBox,
	template: `<path d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1z"/>`
};

export const ICON_PASTE: IIcon = {
	selector: "paste",
	viewBox,
	template: `<path d="M19 20H5V4h2v3h10V4h2m-7-2a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1m7 0h-4.2C14.4.8 13.3 0 12 0c-1.3 0-2.4.8-2.8 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>`
};

export const ICON_FILTER: IIcon = {
	selector: "filter",
	viewBox,
	template: `<path d="M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z"/>`
};

export const ICON_INBOX: IIcon = {
	selector: "inbox",
	viewBox,
	template: `<path d="M19 15h-4a3 3 0 0 1-3 3 3 3 0 0 1-3-3H5V5h14m0-2H5C4 3 3 4 3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>`
};

export const ICON_LINK: IIcon = {
	selector: "link",
	viewBox,
	template: `<path d="M16 6h-3v2h3c2.3 0 4 1.7 4 4a4 4 0 0 1-4 4h-3v2h3a6 6 0 0 0 6-6c0-3.3-2.7-6-6-6M4 12c0-2.3 1.7-4 4-4h3V6H8a6 6 0 0 0-6 6 6 6 0 0 0 6 6h3v-2H8c-2.3 0-4-1.7-4-4m4 1h8v-2H8v2z"/>`
};

export const ICON_SHARE: IIcon = {
	selector: "share",
	viewBox,
	template: `<path d="M18 16c-.8 0-1.4.4-2 1l-7-4.3v-1.4l7-4c.5.4 1.2.7 2 .7a3 3 0 0 0 3-3 3 3 0 0 0-3-3 3 3 0 0 0-3 3v.7l-7 4C7.5 9.4 6.8 9 6 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3c.8 0 1.5-.3 2-.8l7.2 4v.8c0 1.6 1.2 3 2.8 3 1.6 0 3-1.4 3-3a3 3 0 0 0-3-3z"/>`
};

export const ICON_SAVE: IIcon = {
	selector: "save",
	viewBox,
	template: `<path d="M15 9H5V5h10m-3 14a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3m5-16H5C4 3 3 4 3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4z"/>`
};

export const ICON_ATTACH: IIcon = {
	selector: "attach",
	viewBox,
	template: `<path d="M7.5 18A5.5 5.5 0 0 1 2 12.5 5.5 5.5 0 0 1 7.5 7H18a4 4 0 0 1 4 4 4 4 0 0 1-4 4H9.5A2.5 2.5 0 0 1 7 12.5 2.5 2.5 0 0 1 9.5 10H17v1.5H9.5a1 1 0 0 0-1 1 1 1 0 0 0 1 1H18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 18 8.5H7.5a4 4 0 0 0-4 4 4 4 0 0 0 4 4H17V18H7.5z"/>`
};

export const ICON_EMOJI: IIcon = {
	selector: "emoji",
	viewBox,
	template: `<path d="M12 17.5c2.3 0 4.3-1.5 5-3.5H7c.7 2 2.7 3.5 5 3.5M8.5 11A1.5 1.5 0 0 0 10 9.5 1.5 1.5 0 0 0 8.5 8 1.5 1.5 0 0 0 7 9.5 1.5 1.5 0 0 0 8.5 11m7 0A1.5 1.5 0 0 0 17 9.5 1.5 1.5 0 0 0 15.5 8 1.5 1.5 0 0 0 14 9.5a1.5 1.5 0 0 0 1.5 1.5M12 20a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8m0-18C6.5 2 2 6.5 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z"/>`
};

export const ICON_SECURITY: IIcon = {
	selector: "security",
	viewBox,
	template: `<path d="M12 12h7c-.5 4-3.3 7.8-7 9v-9H5V6.3l7-3M12 1L3 5v6c0 5.6 3.8 10.7 9 12 5.2-1.3 9-6.4 9-12V5l-9-4z"/>`
};

export const ICON_SMARTPHONE: IIcon = {
	selector: "smartphone",
	viewBox,
	template: `<path d="M17 19H7V5h10m0-4H7C6 1 5 2 5 3v18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3c0-1-1-2-2-2z"/>`
};

export const ICON_TABLET: IIcon = {
	selector: "tablet",
	viewBox,
	template: `<path d="M19 18H5V6h14m2-2H3C2 4 1 5 1 6v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6c0-1-1-2-2-2z"/>`
};

export const ICON_SPEAKER: IIcon = {
	selector: "speaker",
	viewBox,
	template: `<path d="M12 12a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 1-5 5m0-16a2 2 0 0 1 2 2 2 2 0 0 1-2 2c-1 0-2-1-2-2s1-2 2-2m5-2H7C6 2 5 3 5 4v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4c0-1-1-2-2-2z"/>`
};

export const ICON_BRUSH: IIcon = {
	selector: "brush",
	viewBox,
	template: `<path d="M20.7 4.63L19.38 3.3c-.37-.4-1.02-.4-1.4 0L9 12.24 11.75 15l8.96-8.96c.4-.4.4-1.04 0-1.4M7 14a3 3 0 0 0-3 3c0 1.3-1.16 2-2 2 .92 1.22 2.5 2 4 2a4 4 0 0 0 4-4 3 3 0 0 0-3-3z"/>`
};

export const ICON_PALETTE: IIcon = {
	selector: "palette",
	viewBox,
	template: `<path d="M17.5 12a1.5 1.5 0 0 1-1.5-1.5A1.5 1.5 0 0 1 17.5 9a1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5m-3-4A1.5 1.5 0 0 1 13 6.5 1.5 1.5 0 0 1 14.5 5 1.5 1.5 0 0 1 16 6.5 1.5 1.5 0 0 1 14.5 8m-5 0A1.5 1.5 0 0 1 8 6.5 1.5 1.5 0 0 1 9.5 5 1.5 1.5 0 0 1 11 6.5 1.5 1.5 0 0 1 9.5 8m-3 4A1.5 1.5 0 0 1 5 10.5 1.5 1.5 0 0 1 6.5 9 1.5 1.5 0 0 1 8 10.5 1.5 1.5 0 0 1 6.5 12M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 1.5 1.5 0 0 0 1.5-1.5c0-.4-.15-.74-.4-1-.22-.27-.37-.62-.37-1a1.5 1.5 0 0 1 1.5-1.5H16a5 5 0 0 0 5-5c0-4.42-4.03-8-9-8z"/>`
};

export const ICON_APPS: IIcon = {
	selector: "apps",
	viewBox,
	template: `<path d="M16 20h4v-4h-4m0-2h4v-4h-4m-6-2h4V4h-4m6 4h4V4h-4m-6 10h4v-4h-4m-6 4h4v-4H4m0 10h4v-4H4m6 4h4v-4h-4M4 8h4V4H4v4z"/>`
};

export const ICON_TROPHY: IIcon = {
	selector: "trophy",
	viewBox,
	template: `<path d="M20.2 2H18c-1 0-2 1-2 2H8c0-1-1-2-2-2H2v9c0 1 1 2 2 2h2.2c.4 2 1.7 3.7 4.8 4v2c-2.2.3-3 1.4-3 2.7v.3h8v-.3c0-1.3-.8-2.4-3-2.6v-2c3-.2 4.4-2 4.8-4H20c1 0 2-1 2-2V2h-1.8M4 11V4h2v7H4m16 0h-2V4h2v7z"/>`
};

export const ICON_FACEBOOK: IIcon = {
	selector: "facebook",
	viewBox,
	template: `<path d="M19 4v3h-2a1 1 0 0 0-1 1v2h3v3h-3v7h-3v-7h-2v-3h2V7.5c0-2 1.6-3.5 3.5-3.5M20 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4c0-1-1-2-2-2z"/>`
};

export const ICON_TWITTER: IIcon = {
	selector: "twitter",
	viewBox,
	template: `<path d="M17.7 9.33c-.06 4.62-3 7.78-7.42 7.98-1.82.1-3.13-.5-4.28-1.22 1.34.2 3-.32 3.9-1.08-1.32-.14-2.1-.8-2.46-1.88.38.06.78.04 1.14-.03-1.2-.4-2.04-1.15-2.08-2.7.33.17.68.3 1.14.34-.9-.5-1.54-2.36-.8-3.58 1.33 1.45 2.92 2.63 5.53 2.8-.66-2.8 3.05-4.33 4.6-2.46.66-.12 1.2-.36 1.7-.64-.2.64-.6 1.1-1.1 1.47.53-.07 1.02-.2 1.43-.4-.25.52-.8 1-1.3 1.4M20 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4c0-1.1-.9-2-2-2z"/>`
};

export const ICON_INSTAGRAM: IIcon = {
	selector: "instagram",
	viewBox,
	template: `<path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8c0 2 1.6 3.6 3.6 3.6h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6c0-2-1.6-3.6-3.6-3.6H7.6m9.7 1.5a1.3 1.3 0 0 1 1.2 1.3A1.3 1.3 0 0 1 17.2 8 1.3 1.3 0 0 1 16 6.7a1.3 1.3 0 0 1 1.3-1.2M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>`
};

export const ICON_SNAPCHAT: IIcon = {
	selector: "snapchat",
	viewBox,
	template: `<path d="M12 20.45c-1.2 0-1.9-.5-2.53-.95-.47-.32-.9-.63-1.4-.7-1.14-.07-1.48 0-2.1.1-.1 0-.24-.03-.3-.2-.17-.76-.22-.97-.35-1-1.32-.2-2.13-.5-2.3-.87-.02-.23.05-.33.16-.33 1.07-.2 2.02-.75 2.82-1.7.63-.7.93-1.4.96-1.48.16-.32.2-.6.1-.82-.17-.4-.75-.6-1.38-.8-.34-.13-.9-.4-.82-.8.06-.28.43-.48.95-.44.36.16.66.24.93.24.33 0 .48-.12.52-.16-.1-1.76-.2-3.3.2-4.16C8.6 3.76 11.07 3.55 12 3.55c.92 0 3.4.2 4.56 2.83.4.87.3 2.4.2 4.16.03.04.18.16.5.16.28 0 .58-.08.93-.24.5-.04.88.16.94.44.07.4-.48.67-.82.8-.63.2-1.2.4-1.38.8-.1.22-.06.5.1.82.03.07.33.77.96 1.5.8.93 1.75 1.5 2.82 1.68.1 0 .18.1.15.33-.16.37-.97.67-2.3.88-.12.03-.17.24-.35 1-.05.17-.18.2-.3.2-.6-.1-.95-.17-2.1-.1-.5.07-.92.38-1.4.7-.62.44-1.33.95-2.52.95z"/>`
};

export const ICON_LINKEDIN: IIcon = {
	selector: "linkedin",
	viewBox,
	template: `<path d="M19 19h-3v-5.3a1.5 1.5 0 0 0-1.5-1.5 1.5 1.5 0 0 0-1.5 1.5V19h-3v-9h3v1.2c.5-.8 1.6-1.4 2.5-1.4a3.5 3.5 0 0 1 3.5 3.5m-12.5-5c-1 0-1.8-.8-1.8-1.8a1.8 1.8 0 0 1 1.8-1.8c1 0 1.8.8 1.8 1.8a1.8 1.8 0 0 1-1.8 1.8M8 19H5v-9h3m12-8H4C3 2 2 3 2 4v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4c0-1-1-2-2-2z"/>`
};

export const ICON_SIGN_IN: IIcon = {
	selector: "sign-in",
	viewBox,
	template: `<path d="M19 3H5C4 3 3 4 3 5v4h2V5h14v14H5v-4H3v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5c0-1-1-2-2-2m-9 12.6l1.5 1.4 5-5-5-5L10 8.4l2.7 2.6H3v2h9.7L10 15.6z"/>`
};

export const ICON_SIGN_OUT: IIcon = {
	selector: "sign-out",
	viewBox,
	template: `<path d="M14 15.6l2.7-2.6H7v-2h9.7L14 8.4 15.6 7l5 5-5 5-1.4-1.4M19 3a2 2 0 0 1 2 2v4.7l-2-2V5H5v14h14v-2.7l2-2V19a2 2 0 0 1-2 2H5c-1 0-2-1-2-2V5c0-1 1-2 2-2h14z"/>`
};

export const ICON_KEY: IIcon = {
	selector: "key",
	viewBox,
	template: `<path d="M7 14a2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 1-2 2m5.7-4c-1-2.3-3-4-5.7-4a6 6 0 0 0-6 6 6 6 0 0 0 6 6c2.6 0 4.8-1.7 5.7-4H17v4h4v-4h2v-4H12.7z"/>`
};

export const ICON_THUMB_UP: IIcon = {
	selector: "thumb-up",
	viewBox,
	template: `<path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h4V9H1v12zm22-11c0-1-1-2-2-2h-6.3l1-4.6V3c0-.3-.2-.7-.5-1l-1-1-6.6 6.6C7.2 8 7 8.4 7 9v10c0 1 1 2 2 2h9c.8 0 1.5-.5 1.8-1.2l3-7 .2-.8v-2z"/>`
};

export const ICON_THUMB_DOWN: IIcon = {
	selector: "thumb-down",
	viewBox,
	template: `<path d="M0 0h24v24H0z" fill="none"/><path d="M15 3H6c-.8 0-1.5.5-1.8 1.2l-3 7-.2.8v2c0 1 1 2 2 2h6.3l-1 4.6v.3c0 .3.2.7.5 1l1 1 6.6-6.6c.4-.3.6-.8.6-1.4V5c0-1-1-2-2-2zm4 0v12h4V3h-4z"/>`
};

export const ICON_AUDIO: IIcon = {
	selector: "audio",
	viewBox: ICON_VOLUME_LOW.viewBox,
	template: ICON_VOLUME_LOW.template
};

export const ICON_IMAGE: IIcon = {
	selector: "image",
	viewBox,
	template: `<path d="M8.5 13.5l2.5 3 3.5-4.5 4.5 6H5m16 1V5c0-1-1-2-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/>`
};

export const ICON_VIDEO: IIcon = {
	selector: "video",
	viewBox,
	template: `<path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/>`
};