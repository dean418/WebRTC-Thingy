const messageContainer = document.getElementById('messageContainer');

class UI {
    static displayMessage (message, user) {
        const messageElement = document.createElement('p');

        messageElement.textContent = message;
        messageElement.classList.add(user);

        messageContainer.appendChild(messageElement);
    }
}

export {UI};