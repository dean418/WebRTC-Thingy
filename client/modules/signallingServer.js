class SignallingServer {
    constructor(url) {
        this.conn = new WebSocket(url);
        this.conn.addEventListener('message', this.onMessage.bind(this));
        this.conn.addEventListener('open', this.onOpen.bind(this));
        this.conn.addEventListener('close', this.onClose);
    }

    send(data) {
        let message = JSON.stringify(data);

        this.conn.send(message);
    }

    async onMessage(message) {
        let data = JSON.parse(message.data);
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
    }

    onOpen() {
        console.log('connected to signaling server');
    }

    onClose() {
        console.log('disconnected from signaling server');
    }
}

export {SignallingServer};