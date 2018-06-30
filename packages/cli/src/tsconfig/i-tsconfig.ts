import {CompilerOptions} from "typescript";
export interface ITsconfigBase {
	extends?: string;
	compileOnSave?: boolean;
	exclude?: string[];
	files?: string[];
	include?: string[];
	typeAcquisition?: Partial<{
		enable: boolean;
		include: string;
		exclude: string;
	}>;
}

export interface ITsconfig extends ITsconfigBase {
	compilerOptions: CompilerOptions;
}

export interface ITsconfigPartial extends ITsconfigBase {
	compilerOptions: Partial<CompilerOptions>;
}