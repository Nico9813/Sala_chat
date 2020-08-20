const webSocketServer = require('websocket').server;
const http = require('http');
const webSocketsServerPort = 8000;

const server = http.createServer();
server.listen(webSocketsServerPort);

const wsServer = new webSocketServer({
    httpServer: server
});

const clients = {};

const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

wsServer.on('request', function (request) {
    var userID = getUniqueID();
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))

    connection.on('message', function (message) {
        const mensaje = JSON.parse(message.utf8Data);
        console.log("[Mensaje recibido] - %s ( %s )", mensaje.type, JSON.stringify(mensaje.payload))
        sendMessageExceptOrigin(JSON.stringify({ type: mensaje.type, payload: mensaje.payload }), connection);
    });

});

const sendMessageExceptOrigin = (json, origen) => {
    Object.keys(clients).map((client) => {
        let clienteActual = clients[client];
        if(clienteActual != origen) clienteActual.send(json);
    });
}