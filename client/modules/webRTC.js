import {SignallingServer} from './signallingServer.js';
import {UI} from './UI.js';

class WebRTC extends SignallingServer {
    constructor() {
        super('ws://localhost:3001');

        this.configuration = {'iceServers': [{'urls': 'stun:stun1.l.google.com:19302'}]};
        this.peerConnection = new RTCPeerConnection(this.configuration);
        this.dataChannelListener = this.peerConnection.createDataChannel('test');
        this.dataChannel = null; //defined when a data channel is established

        this.peerConnection.addEventListener('icecandidate', this.newIceCandidate.bind(this));
        this.peerConnection.addEventListener('datachannel', this.setupDataChannel.bind(this));

        this.dataChannelListener.addEventListener('message', this.handleDataChannelMessage);
    }

    /**
     * Will send a JSON string through WebRTC to peers
     *
     * @param {string} type - type of message being sent to peers [code, chat]
     * @param {String} message - user message to peers
     */
    sendRTC(type, message) {
        let data = JSON.stringify({type, message});
        this.dataChannel.send(data);

        // console.log(UI.editor.getModel().getAllDecorations())

        if (type == 'chat') {
            UI.displayMessage(message, 'sender');
        }
    }

    /**
     * Will decide what to do with a message received from peers
     * @param {Object} message - message received from peers
     */
    handleDataChannelMessage(message) {
        let data = JSON.parse(message.data);

        switch (data.type) {
            case 'cursor':
                UI.createPeerCursor(data.message.selection);
                break;
            case 'code':
                UI.updateCode(data.message);
                break;
            case 'chat':
                UI.displayMessage(data.message, 'receiver');
                break;
        }
    }

    /**
     * Sends new iceCandidates to peers over signalling channel
     * @param {*} event
     */
    newIceCandidate(event) {
        if (event.candidate) {
            this.send({iceCandidate: event.candidate});
        }
    }

    /**
     * Defines dataChannel to be used to send messages later on
     *
     * @param {*} event
     */
    setupDataChannel(event) {
        this.dataChannel = event.channel;
    }

    /**
     * Sets a remote description for a peer that has replied to an offer
     *
     * @param {*} answer
     */
    async handleAnswer(answer) {
        const remoteDesc = new RTCSessionDescription(answer);
        await this.peerConnection.setRemoteDescription(remoteDesc);
    }

    /**
     * Replies with an answer object when an offer is received over the signalling channel
     *
     * @param {*} offer
     */
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

    /**
     * Creates an offer and sends to peers over the signalling channel
     */
    async createOffer() {
        const offer = await this.peerConnection.createOffer();

        await this.peerConnection.setLocalDescription(offer);
        this.send(offer);
    }
}

export {WebRTC};