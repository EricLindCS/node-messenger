document.addEventListener('DOMContentLoaded', () => {
    const roleSelection = document.getElementById('role-selection');
    const chatContainer = document.getElementById('chat-container');
    const loginButton = document.getElementById('login-button');
    const passwordInput = document.getElementById('password-input');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const messagesContainer = document.getElementById('messages');

    let role = '';
    let receiver = '';
    const displayedMessages = new Set();
    let passwordUserMapping = {};

    // Fetch password-user mapping from the server
    fetch('/api/passwords')
        .then(response => response.json())
        .then(data => {
            passwordUserMapping = data;
        })
        .catch(error => {
            console.error('Error fetching password-user mapping:', error);
        });

    loginButton.addEventListener('click', () => {
        const password = passwordInput.value;
        if (passwordUserMapping[password]) {
            role = passwordUserMapping[password];
            receiver = Object.values(passwordUserMapping).find(user => user !== role);
            initializeChat();
        } else {
            alert('Invalid password');
        }
    });

    // Add event listener for Enter key on password input
    passwordInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            loginButton.click();
        }
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
                    sender: role,
                    receiver: receiver,
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
            const response = await fetch(`/api/messages?user1=${role}&user2=${receiver}`);
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
        messageElement.innerHTML = `${message.sender}: ${message.content} <span class="timestamp">(${timestamp})</span>`;
        messagesContainer.appendChild(messageElement);

        // Update the document title to indicate unread messages
        if (document.hidden) {
            document.title = "OnShape";
            changeFavicon('public/icons/green-circle.png');
        }
    }

    // Reset the document title when the tab becomes visible
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            document.title = "Robotics";
            changeFavicon('');

        }
    });

    // Function to change the favicon
    function changeFavicon(src) {
        const favicon = document.getElementById('favicon');
        if (src) {
            favicon.href = src;
        } else {
            favicon.removeAttribute('href');
        }
    }

    // Fetch messages every 1 second
    setInterval(fetchMessages, 1000);
});