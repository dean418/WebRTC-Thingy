import {SignallingServer} from './signallingServer.js';

class WebRTC {
    constructor() {
        this.signalling = new SignallingServer('ws://localhost:3001');
        this.configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};
        this.peerConnection = new RTCPeerConnection(this.configuration);
        this.dataChannel = this.peerConnection.createDataChannel('test');

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
            this.signalling.send({iceCandidate: event.candidate});
        }
    }

    connectionChange(event) {
        console.log('anything?');
        if (this.peerConnection.connectionState === 'connected') {
            console.log('we have peers!');
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
            this.signalling.send(answer);
        } catch(e) {
            console.log(e);
        }
    }

    async createOffer() {
        const offer = await this.peerConnection.createOffer();

        await this.peerConnection.setLocalDescription(offer);
        this.signalling.send(offer);
    }
}

export {WebRTC};