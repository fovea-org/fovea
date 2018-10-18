import {MaybeArray} from "@fovea/common";
import {Observable} from "rxjs";

export interface IFileWatcher {
	watch (paths: MaybeArray<string>): Observable<string>;
}