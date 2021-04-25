import {WebRTC} from './modules/webRTC.js';
import {UI} from './modules/UI.js';

const webRTC = new WebRTC();

const sendBtn = document.getElementById('send');
const messageBox = document.getElementById('message');
const offerBtn = document.getElementById('offer');

UI.editor.onDidChangeModelContent(() => {
    if (!UI.executeEditsCalled) {
        webRTC.sendRTC('code', UI.editor.getValue());
        return;
    }
    UI.executeEditsCalled = false;
});

offerBtn.addEventListener('click', () => {
    webRTC.createOffer();
});

sendBtn.addEventListener('click', () => {
    webRTC.sendRTC('chat', messageBox.value);
});