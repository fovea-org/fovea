export interface IManifestJsonIcon {
	src: string;
	type: string;
	sizes: string;
}

export interface IManifestJson {
	name: string;
	short_name: string;
	start_url: string;
	display: string;
	orientation: string;
	background_color: string;
	theme_color: string;
	icons: IManifestJsonIcon[];
}