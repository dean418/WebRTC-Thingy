import {SignallingServer} from './signallingServer.js';
import {UI} from './UI.js';

class WebRTC extends SignallingServer {
    constructor() {
        super('ws://localhost:3001');

        this.configuration = {'iceServers': [{'urls': 'stun:stun1.l.google.com:19302'}]};
        this.peerConnection = new RTCPeerConnection(this.configuration);
        this.dataChannelListener = this.peerConnection.createDataChannel('test');
        this.dataChannel = null;

        this.peerConnection.addEventListener('icecandidate', this.newIceCandidate.bind(this));
        this.peerConnection.addEventListener('datachannel', this.setupDataChannel.bind(this));

        this.dataChannelListener.addEventListener('message', this.handleDataChannelMessage);
    }

    sendRTC(message) {
        this.dataChannel.send(message);
        UI.displayMessage(message, 'sender');
    }

    newIceCandidate(event) {
        if (event.candidate) {
            this.send({iceCandidate: event.candidate});
        }
    }

    setupDataChannel(event) {
        this.dataChannel = event.channel;
    }

    handleDataChannelMessage(message) {
        UI.displayMessage(message.data, 'receiver');
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
}

export {WebRTC};