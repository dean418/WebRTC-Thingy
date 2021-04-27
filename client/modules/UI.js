const messageContainer = document.getElementById('messageContainer');
const messages = document.getElementById('messages');
const offerBtn = document.getElementById('offer');
const users = document.getElementById('users');

class UI {
    static executeEditsCalled = false;

    static editor = monaco.editor.create(document.getElementById('container'), {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        language: 'javascript',
        fontSize: "18px",
        theme: 'vs-dark',
        automaticLayout: true,
        extraEditorClassName: 'superEditor'
    });

    static editorDecorations = [];

    static getCursorDirection(direction) {
        if (direction) {
            return 'peerCursor peerCursorLeft';
        } else {
            return 'peerCursor peerCursorRight';
        }
    }

    /**
     *  Creates the ranges necessary for a peer cursor to be displayed
     *
     * @param {Object} selection - An object containing details of a peers selection
     * @param {Number} direction - 0 indicates a LTR selection, 1 indicates a RTL selection
     */
    static handlePeerCursor(selection, direction) {
        let {startLineNumber, startColumn, endLineNumber, endColumn, selectionStartColumn, positionColumn, positionLineNumber} = selection;
        let ranges = [];
        let options = {className: UI.getCursorDirection(direction)};
        let model = UI.editor.getModel();

        if (startLineNumber == endLineNumber) {
            let range = new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn);

            UI.addPeerCursor([{range, options}]);
            return;
        }

        let range;
        let lastLine;

        if (direction) {
            range = new monaco.Range(startLineNumber, startColumn, endLineNumber, selectionStartColumn);
            lastLine = new monaco.Range(positionLineNumber, positionColumn, positionLineNumber, positionColumn);
        } else {
            range = new monaco.Range(startLineNumber, startColumn, endLineNumber, model.getLineContent(endLineNumber-1));
            lastLine = new monaco.Range(endLineNumber, 1, endLineNumber, endColumn);

        }
        ranges.push(
            {range, options: {className: 'test'}},
            {range: lastLine, options: {className: UI.getCursorDirection(direction)}});

        UI.addPeerCursor(ranges);
    }

    /**
     * Adds cursors and their selections as a decoration on the editor
     *
     * @param {[Object]} ranges - a list of objects containing an instance of monaco.Range and an options object
     */
    static addPeerCursor(ranges) {
        let lastSelection = ranges[ranges.length-1];

        if (lastSelection.range.startColumn == 1 && lastSelection.range.endColumn == 1) {
            lastSelection.options.className = 'peerCursor peerCursorLeft';
        }

        UI.editorDecorations = UI.editor.deltaDecorations(UI.editorDecorations, ranges);
    }

    /**
     * Resizes the message box when a user drags the resizer
     * @param {*} event
     */
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
    static displayMessage (message, user, userName) {
        const messageElement = document.createElement('div');
        const messageInfo = document.createElement('p');
        const messageText = document.createElement('p');

        messageText.textContent = message;
        messageText.classList.add(user, 'message');

        let date = new Date();
        messageInfo.textContent = `${userName} - ${date.getHours()}:${date.getMinutes()}`;
        messageInfo.classList.add(user, 'messageInfo');

        messageElement.appendChild(messageInfo);
        messageElement.appendChild(messageText);

        messages.appendChild(messageElement);
    }

    static changeConnectState() {
        if (offerBtn.style.color == 'rgb(81, 255, 13)') {
            offerBtn.style.color = '#fff';
        } else {
            offerBtn.style.color = '#51ff0d';
        }
    }

    static showNewPeer(name, thisUser) {
        const li = document.createElement('li');

        li.textContent = name;

        if (thisUser) {
            li.textContent += ' (you)';
        }

        users.appendChild(li);
    }
}

export {UI};