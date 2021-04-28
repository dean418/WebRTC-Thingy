const WebSocket = require('ws');

const SocketConnection = require('./connection');

class Server {
    constructor() {
        this.clients = {};
        this.rooms = {};
        this.wss = new WebSocket.Server({ port: 3001 });

        this.wss.on('connection', (socket) => {
            const clientSocket = new SocketConnection(this, socket);

            console.log(clientSocket.id + ' connected');
        });
    }
}

module.exports = Server