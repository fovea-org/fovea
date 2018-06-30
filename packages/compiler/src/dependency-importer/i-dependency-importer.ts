import {IDependencyImporterImportOptions} from "./i-dependency-importer-import-options";

export interface IDependencyImporter {
	importDependencies (options: IDependencyImporterImportOptions): void;
}