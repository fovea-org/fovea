import {Http2SecureServer} from "http2";
import {Server as HttpServer} from "http";
import {Server as HttpsServer} from "https";
import {Server as TCPServer} from "net";
import {Server as WebsocketServer} from "ws";

export interface IServerSet {
	https?: Http2SecureServer;
	http?: HttpServer;
	tcp?: TCPServer;
	websocket?: WebsocketServer;
	websocketHttpsServer?: HttpsServer;
}