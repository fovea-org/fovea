import {ExpressionChain, ICustomAttribute, IFoveaHost, Ref} from "@fovea/common";
import {IExpressionChainDict} from "../../observe/expression-chain/i-expression-chain-dict";
import {IObserver} from "../../observe/i-observer";
import {IDestroyable} from "../../destroyable/i-destroyable";

export interface IHostAttributesHelperMap {
	___addAttributes (host: IFoveaHost|ICustomAttribute, ...attributes: [string, ExpressionChain|undefined][]): IObserver;
	___addAttribute (host: IFoveaHost|ICustomAttribute, key: string, value?: ExpressionChain|IExpressionChainDict): IObserver;
	___addProperties (host: IFoveaHost|ICustomAttribute, ...properties: [string, ExpressionChain][]): IObserver;
	___addProperty (host: IFoveaHost|ICustomAttribute, path: string, value?: ExpressionChain): IObserver;
	___addListeners (host: IFoveaHost|ICustomAttribute, ...listeners: [string, ExpressionChain][]): IObserver;
	___addListener (host: IFoveaHost|ICustomAttribute, name: string, handler: ExpressionChain): IObserver;
	___addRef (host: IFoveaHost|ICustomAttribute, ref: Ref): IObserver;
	___addCustomAttribute (host: IFoveaHost|ICustomAttribute, name: string, value?: ExpressionChain|IExpressionChainDict): IObserver&IDestroyable;
}