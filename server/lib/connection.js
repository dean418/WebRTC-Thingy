const {nanoid} = require('nanoid');

class SocketConnection {
    constructor(server, socket) {
        this.server = server;
        this.socket = socket;
        this.id = nanoid();
        this.name = ''

        this.socket.on('message', this.handleMessage.bind(this));
        this.socket.on('close', this.handleClose.bind(this));

    }

    exchangePeers(message) {
        for (const id in this.server.clients) {
            let client = this.server.clients[id];

            client.socket.send(JSON.stringify(message));

            if (this.id != client.id) {
                this.socket.send(JSON.stringify({message: 'connected', name: client.name}))
            }
        }
    }

    handleMessage(message) {
        let data = JSON.parse(message);

        if (data.type == 'initialRequest') {
            this.name = data.name;
            this.server.clients[this.id] = this;

            this.exchangePeers({message: 'connected', name: this.name});
            return;
        }

        for (const id in this.server.clients) {
            let client = this.server.clients[id];

            if (client.id != this.id) {
                client.socket.send(JSON.stringify(data));
            }
        }
    }

    handleClose() {
        delete this.server.clients[this.id];
        console.log(this.id + ' disconnected');
    }
}

module.exports = SocketConnection;