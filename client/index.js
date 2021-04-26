import {WebRTC} from './modules/webRTC.js';
import {UI} from './modules/UI.js';

const webRTC = new WebRTC();

const resizer = document.getElementById('resizer');
const messageBox = document.getElementById('message');
const sendBtn = document.getElementById('send');
const offerBtn = document.getElementById('offer');

UI.editor.onDidChangeModelContent(() => {
    //prevents unnecessary updates being sent
    if (!UI.executeEditsCalled) {
        webRTC.sendRTC('code', UI.editor.getValue());
        return;
    }
    UI.executeEditsCalled = false;
});

UI.editor.onDidChangeCursorSelection((event) => {
    webRTC.sendRTC('cursor', {selection: event.selection, secondarySelections: event.secondarySelections});
});



offerBtn.addEventListener('click', () => {
    UI.changeConnectState();
    webRTC.createOffer();
});

sendBtn.addEventListener('click', () => {
    webRTC.sendRTC('chat', messageBox.value);
});

resizer.addEventListener('mousedown', () => {
    window.addEventListener('mousemove', UI.resize);
});

window.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', UI.resize);
});