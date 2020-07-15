const webSocketServer = require('websocket').server;
const http = require('http');
const webSocketsServerPort = 8000;

const server = http.createServer();
server.listen(webSocketsServerPort);

const wsServer = new webSocketServer({
    httpServer: server
});

const clients = {};

CAMBIAR_TEXTO = "CAMBIAR_TEXTO";

const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

wsServer.on('request', function (request) {
    var userID = getUniqueID();
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
    // You can rewrite this part of the code to accept only the requests from allowed origin
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))

    connection.on('message', function (message) {
        const mensaje = JSON.parse(message.utf8Data);
        console.log("[Mensaje recibido] - %s ( %s )", mensaje.type, mensaje.data)
        switch (mensaje.type){
            case CAMBIAR_TEXTO:
                const data = JSON.stringify({data: mensaje.data});
                sendMessage(JSON.stringify(data));
                break;
            default:
                console.log("Tipo de mensaje desonocido");
        }
    });

});

const sendMessage = (json) => {
    Object.keys(clients).map((client) => {
        clients[client].sendUTF(json);
    });
}