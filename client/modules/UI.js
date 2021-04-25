const messageContainer = document.getElementById('messageContainer');

class UI {
    static executeEditsCalled = false;

    static editor = monaco.editor.create(document.getElementById('container'), {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        language: 'javascript',
        theme: 'vs-dark'
    });

    /**
     * Updates the code editor with changes made by peers
     * @param {*} code - code sent by peers
     */
    static updateCode(code) {
        const model = UI.editor.getModel();
        if (code != UI.editor.getValue()) {
            UI.editor.executeEdits(code, [{
                range: model.getFullModelRange(),
                text: code,
                forceMoveMarkers: true
            }]);
            UI.executeEditsCalled = true;
        }
    }

    /**
     * Takes a message thats just been sent by a user or a peer and displays it
     * @param {*} message from either a user or peer
     * @param {*} user class name to determine who sent the message and display it accordingly
     */
    static displayMessage (message, user) {
        const messageElement = document.createElement('p');

        messageElement.textContent = message;
        messageElement.classList.add(user);

        messageContainer.appendChild(messageElement);
    }
}

export {UI};