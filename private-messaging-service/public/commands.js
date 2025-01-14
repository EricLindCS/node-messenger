document.addEventListener('DOMContentLoaded', () => {
    const clearMessagesButton = document.getElementById('clear-messages');
    const addUserButton = document.getElementById('add-user');
    const newPasswordInput = document.getElementById('new-password');
    const newUserInput = document.getElementById('new-user');

    clearMessagesButton.addEventListener('click', async () => {
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