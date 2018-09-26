import {ExpressionChain, FoveaHost, Ref} from "@fovea/common";
import {IExpressionChainDict} from "../../observe/expression-chain/i-expression-chain-dict";
import {IObserver} from "../../observe/i-observer";
import {IDestroyable} from "../../destroyable/i-destroyable";

export interface IHostAttributesHelperMap {
	___addAttributes (host: FoveaHost, ...attributes: [string, ExpressionChain|undefined][]): IObserver;
	___addAttribute (host: FoveaHost, key: string, value?: ExpressionChain|IExpressionChainDict): IObserver;
	___addProperties (host: FoveaHost, ...properties: [string, ExpressionChain][]): IObserver;
	___addProperty (host: FoveaHost, path: string, value?: ExpressionChain): IObserver;
	___addListeners (host: FoveaHost, ...listeners: [string, ExpressionChain][]): IObserver;
	___addListener (host: FoveaHost, name: string, handler: ExpressionChain): IObserver;
	___addRef (host: FoveaHost, ref: Ref): IObserver;
	___addCustomAttribute (host: FoveaHost, name: string, value?: ExpressionChain|IExpressionChainDict): IObserver&IDestroyable;
}