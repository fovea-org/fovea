export interface IBufferSerializer {
	toBuffer<T> (item: T): Buffer;
	fromBuffer<T> (item: Buffer): T;
}