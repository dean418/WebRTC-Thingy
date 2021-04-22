class WebSocketWrapper {
    constructor(url) {
        this.conn = new WebSocket(url);
        this.configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
        this.peerConnection = new RTCPeerConnection(this.configuration);

        this.conn.addEventListener('message', this.onMessage.bind(this));
        this.conn.onopen = this.onOpen.bind(this);
        this.conn.onclose = this.onClose;
    }

    send(data) {
        let message = JSON.stringify(data);

        this.conn.send(message);
    }

    onMessage(message) {
        let data = JSON.parse(message.data);

        if (data.type == 'answer') {
            console.log('got an answer');
            this.handleAnswer(data);
            return false;
        }

        if (data.type = 'offer') {
            console.log('got an offer');
            this.handleOffer(data);
            return false;
        }
    }

    async handleAnswer(answer) {
        const remoteDesc = new RTCSessionDescription(answer);
        await this.peerConnection.setRemoteDescription(remoteDesc);
    }

    async handleOffer(offer) {
        this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await this.peerConnection.createAnswer();

        await this.peerConnection.setLocalDescription(answer);
        this.send(answer);
    }

    async createOffer() {
        console.log('creating offer');
        const offer = await this.peerConnection.createOffer();

        await this.peerConnection.setLocalDescription(offer);
        webSocket.send(offer);
    }

    onOpen() {
        console.log('connected to signaling server');
        this.createOffer()
    }

    onClose() {
        console.log('disconnected from signaling server');
    }
}

let webSocket = new WebSocketWrapper('ws://localhost:3001');

// webSocket.createOffer();