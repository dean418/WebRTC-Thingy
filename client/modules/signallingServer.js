import { UI } from './UI.js';

class SignallingServer {
    constructor(url) {
        this.conn = new WebSocket(url);
        this.conn.addEventListener('message', this.onMessage.bind(this));
        this.conn.addEventListener('open', this.onOpen.bind(this));
        this.conn.addEventListener('close', this.onClose);
    }

    /**
     * Turns data into JSON and sends it to peers through a websocket
     * @param {Object} data
     */
    send(data) {
        let message = JSON.stringify(data);

        this.conn.send(message);
    }

    /**
     * Determines what to do with a message received from the signalling server
     * @param {*} message - received from a peer
     */
    async onMessage(message) {
        const data = JSON.parse(message.data);

        if (data.message == 'connected') {
            let thisUser = false;

            this.name == data.name ? thisUser = true : thisUser = false;

            UI.showNewPeer(data.name, thisUser);
            return false;
        }

        if (data.message == 'disconnected') {
            UI.clearPeerList();
            return false;
        }

        if (data.iceCandidate) {
            try {
                await this.peerConnection.addIceCandidate(data.iceCandidate);
            } catch (error) {
                console.error(error);
            }
            return false;
        }

        if (data.type == 'answer') {
            this.handleAnswer(data);
            return false;
        }

        if (data.type = 'offer') {
            this.handleOffer(data);
            return false;
        }
        return false;
    }

    onOpen() {
        this.name = prompt('enter your name');
        this.send({type: 'initialRequest', name: this.name});

        console.log('connected to signaling server');
    }

    onClose() {
        console.log('disconnected from signaling server');
    }
}

export { SignallingServer };