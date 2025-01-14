document.addEventListener('DOMContentLoaded', () => {
    const clearMessagesButton = document.getElementById('clear-messages');
    const addUserButton = document.getElementById('add-user');
    const newPasswordInput = document.getElementById('new-password');
    const newUserInput = document.getElementById('new-user');

    clearMessagesButton.addEventListener('click', async () => {
        const password = prompt('Enter the password to clear messages:');
        if (password === 'DELETE') {
            const confirmation = confirm('Are you sure you want to clear all messages?');
            if (confirmation) {
                try {
                    const response = await fetch('/api/messages', {
                        method: 'DELETE',
                    });
                    if (response.ok) {
                        alert('All messages cleared');
                    } else {
                        alert('Failed to clear messages');
                    }
                } catch (error) {
                    console.error('Error clearing messages:', error);
                    alert('Error clearing messages');
                }
            }
        } else {
            alert('Incorrect password');
        }
    });

    addUserButton.addEventListener('click', async () => {
        const password = newPasswordInput.value;
        const user = newUserInput.value;

        if (password && user) {
            try {
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ password, user }),
                });
                if (response.ok) {
                    alert('User added successfully');
                    newPasswordInput.value = '';
                    newUserInput.value = '';
                } else {
                    alert('Failed to add user');
                }
            } catch (error) {
                console.error('Error adding user:', error);
                alert('Error adding user');
            }
        } else {
            alert('Please enter both password and user');
        }
    });
});