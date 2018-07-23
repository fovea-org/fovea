import {IObserver} from "../../observe/i-observer";
import {IDestroyable} from "../../destroyable/i-destroyable";

export interface IBoundHostAttributes extends IObserver, IDestroyable {}