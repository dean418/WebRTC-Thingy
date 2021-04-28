const {nanoid} = require('nanoid');

class SocketConnection {
    constructor(server, socket) {
        this.server = server;
        this.socket = socket;
        this.id = nanoid();
        this.name = '';

        this.socket.on('message', this.handleMessage.bind(this));
        this.socket.on('close', this.handleClose.bind(this));

    }

    exchangePeers(message) {
        for (const id in this.server.clients) {
            let client = this.server.clients[id];

            client.socket.send(JSON.stringify(message)); // send client name to all peers

            if (this.id != client.id) {
                this.socket.send(JSON.stringify({message: 'connected', name: client.name})); // send peers to client
            }
        }
    }

    handleMessage(message) {
        message = JSON.parse(message);
        if (message.type == 'initialRequest') {
            this.name = message.name;
            this.server.clients[this.id] = this;

            this.exchangePeers({message: 'connected', name: this.name});
            return;
        }

        if (message.type == 'offer') {
            this.server.rooms[message.name] = this;
            return;
        }

        if (message.type == 'answer') {
            console.log(message);
            return;
            // this.server.rooms[message.name] = this;
        }

        for (const id in this.server.clients) {
            let client = this.server.clients[id];

            if (client.id != this.id) {
                client.socket.send(JSON.stringify(message.data));
            }
        }
    }

    handleClose() {
        delete this.server.clients[this.id];

        for (const [key, client] of Object.entries(this.server.clients)) {
            client.socket.send(JSON.stringify({message: 'disconnected'}));

            for (const [key, peer] of Object.entries(this.server.clients)) {
                client.socket.send(JSON.stringify({message: 'connected', name: peer.name}));
            }
        }

        console.log(this.id + ' disconnected');
    }
}

module.exports = SocketConnection;