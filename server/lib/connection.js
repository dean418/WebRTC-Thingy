const {nanoid} = require('nanoid');

class SocketConnection {
    constructor(server, socket) {
        this.server = server;
        this.socket = socket;
        this.id = nanoid();

        this.socket.on('message', this.handleMessage.bind(this));
        this.socket.on('close', this.handleClose.bind(this));
    }

    handleMessage(message) {
        const data = JSON.parse(message);
        console.log(data);

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