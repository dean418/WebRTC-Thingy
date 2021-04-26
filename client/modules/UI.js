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
        automaticLayout: true,
        extraEditorClassName: 'superEditor'
    });

    static editorDecorations = [];

    static createPeerCursor(selection) {
        let {startLineNumber, startColumn, endLineNumber, endColumn, selectionStartColumn, positionColumn, positionLineNumber, selectionStartLineNumber} = selection;
        let ranges = [];

        UI.editorDecorations = UI.editor.deltaDecorations(UI.editorDecorations, []);

        for (let i = 1; i <= endLineNumber; i++) {

            let range;
            let options = {className:'test', isWholeLine: false};

            if (i == endLineNumber) {
                range = new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn);

                if (positionLineNumber > selectionStartLineNumber) { // selecting left to right
                    options.className = 'peerCursor peerCursorRight';
                } else if (positionLineNumber < selectionStartLineNumber) {
                    options.className = 'peerCursor peerCursorLeft';
                }

                if (positionLineNumber == selectionStartLineNumber && selectionStartColumn < positionColumn) {
                    options.className = 'peerCursor peerCursorRight';
                } else if (positionLineNumber == selectionStartLineNumber && selectionStartColumn > positionColumn){
                    options.className = 'peerCursor peerCursorLeft';
                }

                ranges.push({range, options});
                break;
            }

            range = new monaco.Range(i,i,i,i);
            options.isWholeLine = true;
            ranges.push({range, options});
        }

        UI.editorDecorations = UI.editor.deltaDecorations(UI.editorDecorations, ranges);
    }

    static cpc(selection) {
        console.log(selection);
        let {startLineNumber, startColumn, endLineNumber, endColumn, selectionStartColumn, positionColumn} = selection;
        let options = {className:'peerCursor'};

        if (startLineNumber == endLineNumber) {

            if (selectionStartColumn < positionColumn) {
                options.className += ' peerCursorRight';
            } else {
                options.className += ' peerCursorLeft';
            }

            if (UI.editorDecorations.length > 1) {
                UI.editorDecorations = UI.editor.deltaDecorations(UI.editorDecorations, []);
            }

            UI.editorDecorations = UI.editor.deltaDecorations([UI.editorDecorations], [
                {range: new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn), options}
            ]);
            return;
        }

        console.log('s: ' + startLineNumber, 'e: ' + endLineNumber);
        let ranges = []

        for (let i = 1; i <= endLineNumber; i++) {
            let range = new monaco.Range(i,i,i,i);
            let options = {className:'test', isWholeLine: true}

            if (i == endLineNumber) {
                options.isWholeLine = false;
                options.className += ' peerCursorRight'
                range = new monaco.Range(endLineNumber, 1, endLineNumber, endColumn)
            }

            ranges.push({range, options});
        }
        UI.editorDecorations = UI.editor.deltaDecorations(UI.editorDecorations, ranges);
        console.log(UI.editorDecorations);
    }

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