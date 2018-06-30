import {IBuildOutputBundleOptions} from "./i-build-output-bundle-options";

export interface IBuildServiceWorkerOptions extends IBuildOutputBundleOptions {
	watch: boolean;
}