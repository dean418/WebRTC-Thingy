const WebSocket = require('ws');

const SocketConnection = require('./connection');

class Server {
    constructor() {
        this.clients = {};
        this.wss = new WebSocket.Server({ port: 3001 });

        this.wss.on('connection', (socket) => {
            const clientSocket = new SocketConnection(this, socket);

            this.clients[clientSocket.id] = clientSocket;
            console.log(clientSocket.id + ' connected');
        });
    }
}

module.exports = Server