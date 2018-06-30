import {ITslintConfiguration} from "../../../tslint/i-tslint-configuration";

export interface ITslintGeneratorOptions {
	options: Partial<ITslintConfiguration>;
}