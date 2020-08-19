import { w3cwebsocket as W3CWebSocket } from "websocket";

export const useWebSocket = () => {
    const client = new W3CWebSocket('ws://127.0.0.1:8000');
    return client
};