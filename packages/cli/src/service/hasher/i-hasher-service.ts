export interface IHasherService {
	generate (key?: string): string;
	replaceHashInString (raw: string, hash: string): string;
}