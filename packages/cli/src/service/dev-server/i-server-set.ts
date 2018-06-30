import {Http2SecureServer} from "http2";
import {Server} from "http";
import {Server as TCPServer} from "net";
import {Server as WebsocketServer} from "ws";

export interface IServerSet {
	https: Http2SecureServer;
	http: Server;
	tcp: TCPServer;
	websocket?: WebsocketServer;
}