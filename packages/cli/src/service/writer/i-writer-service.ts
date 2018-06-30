import {IWriterServiceData} from "./i-writer-service-data";
import {IWriterServiceWriteOptions} from "./i-writer-service-write-options";

export interface IWriterService<T> {
	write (data: IWriterServiceData<T>, options: IWriterServiceWriteOptions): Promise<void>;
}