import {env} from "process";
import {environmentDefaults} from "./environment-defaults";

/**
 * This is finalized environment variables. Don't touch these! Leave them be as they are.
 */
export const environment = {
	...environmentDefaults,
	...env
};
