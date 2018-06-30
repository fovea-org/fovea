import {ILibUser} from "../lib-user/i-lib-user";
import {IParentMerger} from "./i-parent-merger";
import {IParentMergerMergeOptions} from "./i-parent-merger-merge-options";
import {IFoveaHostUtil} from "../util/fovea-host-util/i-fovea-host-util";

/**
 * A class that can generate an instruction to merge with the parent
 */
export class ParentMerger implements IParentMerger {
	constructor (private readonly libUser: ILibUser,
							 private readonly foveaHostUtil: IFoveaHostUtil) {
	}

	/**
	 * Generates an instruction to merge with the parent. This is used to merge the sets of props and host props and other things
	 * @param {IParentMergerMergeOptions} options
	 */
	public merge (options: IParentMergerMergeOptions): void {
		const {mark, insertPlacement, compilerOptions, context} = options;
		const {className, classDeclaration} = mark;

		// If the given ClassDeclaration is a base component, it cannot be merged with its' parent
		if (this.foveaHostUtil.isBaseComponent(classDeclaration)) return;

		if (!compilerOptions.dryRun) {
			// Add an instruction to merge with the parent
			context.container.appendAtPlacement(
				`\n${this.libUser.use("mergeWithParent", compilerOptions, context)}(<any>${className});`,
				insertPlacement
			);
		}
	}
}