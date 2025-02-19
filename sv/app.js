const webSocketServer = require('websocket').server;
const http = require('http');
const webSocketsServerPort = 8000;

const NUEVO_USUARIO = "NUEVO_USUARIO";
const HANDSHAKE = "HANDSHAKE";

const server = http.createServer();
server.listen(webSocketsServerPort);

const wsServer = new webSocketServer({
    httpServer: server
});

const clients = {}
const clients_connexions = {};

const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

wsServer.on('request', function (request) {
    const userID = getUniqueID();
    const connection = request.accept(null, request.origin);
    clients_connexions[userID] = connection

    connection.on('message', function (message) {
        const mensaje = JSON.parse(message.utf8Data);
        console.log("[Mensaje recibido] - %s ( %s )", mensaje.type, JSON.stringify(mensaje.payload))
        if (mensaje.type == HANDSHAKE){
            Object.keys(clients).forEach((index) => {
                connection.send(JSON.stringify({ type: NUEVO_USUARIO, payload: clients[index], id: index }))
            })
            clients[userID] = mensaje.payload
            console.log(clients)
            sendMessageExceptOrigin(JSON.stringify({ type: NUEVO_USUARIO, payload: mensaje.payload, id:userID }), userID)
        }else{
            sendMessageExceptOrigin(JSON.stringify({ type: mensaje.type, payload: mensaje.payload, id: userID }), userID);
        }
    });
});

const sendMessageExceptOrigin = (json, origen) => {
    Object.keys(clients_connexions).filter(value => value != origen).map((indice) => {
        clients_connexions[indice].send(json)
    });
}