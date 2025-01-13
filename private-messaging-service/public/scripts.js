document.addEventListener('DOMContentLoaded', () => {
    const roleSelection = document.getElementById('role-selection');
    const chatContainer = document.getElementById('chat-container');
    const selectSenderButton = document.getElementById('select-sender');
    const selectReceiverButton = document.getElementById('select-receiver');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const messagesContainer = document.getElementById('messages');

    let role = '';
    const displayedMessages = new Set();

    selectSenderButton.addEventListener('click', () => {
        role = 'sender';
        initializeChat();
    });

    selectReceiverButton.addEventListener('click', () => {
        role = 'receiver';
        initializeChat();
    });

    function initializeChat() {
        roleSelection.style.display = 'none';
        chatContainer.style.display = 'block';
        fetchMessages();
    }

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
                    sender: role === 'sender' ? 'user1' : 'user2', // Replace with actual sender
                    receiver: role === 'receiver' ? 'user1' : 'user2', // Replace with actual receiver
                    content: message
                }),
            });

            if (response.ok) {
                const newMessage = await response.json();
                if (!displayedMessages.has(newMessage._id)) {
                    displayMessage(newMessage);
                    displayedMessages.add(newMessage._id);
                }
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
                messages.forEach(message => {
                    if (!displayedMessages.has(message._id)) {
                        displayMessage(message);
                        displayedMessages.add(message._id);
                    }
                });
            } else {
                console.error('Failed to fetch messages');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function displayMessage(message) {
        const messageElement = document.createElement('div');
        const timestamp = new Date(message.timestamp).toLocaleString();
        messageElement.textContent = `${message.sender}: ${message.content} (${timestamp})`;
        messagesContainer.appendChild(messageElement);

        // Update the document title to indicate unread messages
        if (document.hidden) {
            document.title = "New message!";
        }
    }

    // Reset the document title when the tab becomes visible
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            document.title = "Shennagains";
        }
    });

    // Fetch messages every 1 second
    setInterval(fetchMessages, 1000);
});