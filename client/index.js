class WebSocketWrapper {
    constructor(url) {
        this.conn = new WebSocket(url);
        this.configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
        this.peerConnection = new RTCPeerConnection(this.configuration);

        this.conn.addEventListener('message', this.onMessage.bind(this));
        this.conn.addEventListener('open', this.onOpen.bind(this));
        this.conn.addEventListener('close', this.onClose);

        this.peerConnection.addEventListener('icecandidate', this.newIceCandidate.bind(this));
        this.peerConnection.addEventListener('connectionstatechange', this.connectionChange.bind(this));
    }

    newIceCandidate(event) {
        console.log('yo!!!!');
        if (event.candidate) {
            this.send({'new-ice-candidate': event.candidate});
        }
    }

    connectionChange(event) {
        console.log('yo!!! anyone?');
        if (this.peerConnection.connectionState === 'connected') {
            console.log('we have peers!');
        }
    }

    send(data) {
        let message = JSON.stringify(data);

        this.conn.send(message);
    }

    async onMessage(message) {
        let data = JSON.parse(message.data);

        if (data.iceCandidate) {
            console.log('yo new guy');
            try {
                await this.peerConnection.addIceCandidate(data.iceCandidate);
            } catch (error) {
                console.error('Error adding received ice candidate', e);
            }

            return false;
        }

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
        console.log(answer);
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
        const offer = await this.peerConnection.createOffer();

        await this.peerConnection.setLocalDescription(offer);
        webSocket.send(offer);
    }

    onOpen() {
        console.log('connected to signaling server');
        this.createOffer();
    }

    onClose() {
        console.log('disconnected from signaling server');
    }
}

let webSocket = new WebSocketWrapper('ws://localhost:3001');