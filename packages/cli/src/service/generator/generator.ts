import {IGenerator} from "./i-generator";
import {TemplateFile, TemplateFileKind} from "./template-generator/template-file";

// tslint:disable:no-any

/**
 * The abstract base class for generators
 */
export abstract class Generator implements IGenerator {

	/**
	 * The 'generate' method must return an array of TemplateFiles and be implemented by derived classes
	 * @param args
	 * @returns {Promise<TemplateFile[]>}
	 */
	public async generate (...args: any[]): Promise<TemplateFile[]> {
		return this.upgrade(await this.onGenerate(...args));
	}

	/**
	 * The 'onGenerate' method must return an array of TemplateFiles and be implemented by derived classes
	 * @param args
	 * @returns {Promise<TemplateFile[]>}
	 */
	public abstract onGenerate (...args: any[]): Promise<TemplateFile[]>;

	/**
	 * Upgrade the given template files
	 * @param {TemplateFile[]} templateFiles
	 * @returns {TemplateFile[]}
	 */
	private upgrade (templateFiles: TemplateFile[]): TemplateFile[] {
		return this.updateNames(this.setParents(templateFiles));
	}

	/**
	 * Updates the names of all of the given template files
	 * @param {TemplateFile[]} templateFiles
	 * @returns {TemplateFile[]}
	 */
	private updateNames (templateFiles: TemplateFile[]): TemplateFile[] {
		for (const templateFile of templateFiles) {

			// Update the name and prepend the full paths of the parent names to the name of the file
			if (templateFile.parent != null) {
				templateFile.name = `${templateFile.parent.name}/${templateFile.name}`;
			}

			if (templateFile.kind === TemplateFileKind.DIRECTORY) {
				this.updateNames(templateFile.children);
			}
		}
		return templateFiles;
	}

	/**
	 * Sets the parents for all of the given template files
	 * @param {TemplateFile[]} templateFiles
	 * @returns {TemplateFile[]}
	 */
	private setParents (templateFiles: TemplateFile[]): TemplateFile[] {
		for (const templateFile of templateFiles) {
			if (templateFile.kind === TemplateFileKind.DIRECTORY) {
				templateFile.children.forEach(child => child.parent = templateFile);
				this.setParents(templateFile.children);
			}
		}

		return templateFiles;
	}

}