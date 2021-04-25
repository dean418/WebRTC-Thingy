const messageContainer = document.getElementById('messageContainer');

class UI {
    static executeEditsCalled = false;

    static editor = monaco.editor.create(document.getElementById('container'), {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        language: 'javascript',
        theme: 'vs-dark'
    });

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

    static displayMessage (message, user) {
        const messageElement = document.createElement('p');

        messageElement.textContent = message;
        messageElement.classList.add(user);

        messageContainer.appendChild(messageElement);
    }
}

export {UI};