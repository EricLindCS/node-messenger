document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const messagesContainer = document.getElementById('messages');

    messageForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const message = messageInput.value;

        if (message) {
            await sendMessage(message);
            messageInput.value = '';
        }
    });

    async function sendMessage(message) {
        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender: 'user1', // Replace with actual sender
                    receiver: 'user2', // Replace with actual receiver
                    content: message
                }),
            });

            if (response.ok) {
                const newMessage = await response.json();
                displayMessage(newMessage);
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function fetchMessages() {
        try {
            const response = await fetch('/api/messages?user1=user1&user2=user2');
            if (response.ok) {
                const messages = await response.json();
                messages.forEach(displayMessage);
            } else {
                console.error('Failed to fetch messages');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function displayMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${message.sender}: ${message.content}`;
        messagesContainer.appendChild(messageElement);
    }

    // Fetch and display messages on page load
    fetchMessages();

});