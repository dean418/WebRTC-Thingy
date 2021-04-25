const messageContainer = document.getElementById('messageContainer');
const messages = document.getElementById('messages');
const offerBtn = document.getElementById('offer');

class UI {
    static executeEditsCalled = false;

    static editor = monaco.editor.create(document.getElementById('container'), {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        language: 'javascript',
        fontSize: "18px",
        theme: 'vs-dark',
        automaticLayout: true
    });

    static resize (event) {
        messageContainer.style.height = window.innerHeight - event.pageY + 'px';
    }

    /**
     * Updates the code editor with changes made by peers
     * @param {*} code - code sent by peers
     */
    static updateCode(code) {
        const model = UI.editor.getModel();

        // Update code in editor with code from peer
        // and preserve cursor positions
        UI.editor.executeEdits(code, [{
            range: model.getFullModelRange(),
            text: code,
            forceMoveMarkers: true
        }], UI.editor.getSelections());
        UI.executeEditsCalled = true;
    }

    /**
     * Takes a message thats just been sent by a user or a peer and displays it
     * @param {*} message from either a user or peer
     * @param {*} user class name to determine who sent the message and display it accordingly
     */
    static displayMessage (message, user) {
        const messageElement = document.createElement('p');

        messageElement.textContent = message;
        messageElement.classList.add(user, 'message');

        messages.appendChild(messageElement);
    }

    static changeConnectState() {
        if (offerBtn.style.color == 'rgb(81, 255, 13)') {
            offerBtn.style.color = '#fff';
        } else {
            offerBtn.style.color = '#51ff0d';
        }
    }
}

export {UI};