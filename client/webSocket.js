class SignallingServer {
    constructor(url) {
        this.conn = new WebSocket(url);
        this.configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
        this.peerConnection = new RTCPeerConnection(this.configuration);
        this.dataChannel = this.peerConnection.createDataChannel('test');

        this.conn.addEventListener('message', this.onMessage.bind(this));
        this.conn.addEventListener('open', this.onOpen.bind(this));
        this.conn.addEventListener('close', this.onClose);

        this.peerConnection.addEventListener('icecandidate', this.newIceCandidate.bind(this));
        this.peerConnection.addEventListener('connectionstatechange', this.connectionChange.bind(this));
        this.peerConnection.addEventListener('datachannel', event => {
            const dataChannel = event.channel;
            dataChannel.send('yo mate');
        });

        this.dataChannel.addEventListener('message', (message) => {
            console.log(message.data);
        })

    }

    newIceCandidate(event) {
        if (event.candidate) {
            this.send({iceCandidate: event.candidate});
        }
    }

    connectionChange(event) {
        console.log('anything?');
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

    async handleAnswer(answer) {
        const remoteDesc = new RTCSessionDescription(answer);
        await this.peerConnection.setRemoteDescription(remoteDesc);
    }

    async handleOffer(offer) {
        try {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await this.peerConnection.createAnswer();

            await this.peerConnection.setLocalDescription(answer);
            this.send(answer);
        } catch(e) {
            console.log(e);
        }
    }

    async createOffer() {
        const offer = await this.peerConnection.createOffer();

        await this.peerConnection.setLocalDescription(offer);
        this.send(offer);
    }

    onOpen() {
        console.log('connected to signaling server');
        this.createOffer();
    }

    onClose() {
        console.log('disconnected from signaling server');
    }
}

export {SignallingServer}