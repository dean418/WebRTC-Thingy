import {WebRTC} from './modules/webRTC.js';

const sendBtn = document.getElementById('send');
const messageBox = document.getElementById('message');
const offerBtn = document.getElementById('offer');

const webRTC = new WebRTC();

offerBtn.addEventListener('click', () => {
    webRTC.createOffer();
});

sendBtn.addEventListener('click', () => {
    webRTC.sendRTC(messageBox.value);
});