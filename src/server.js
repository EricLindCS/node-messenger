const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Message = require('./models/messageModel'); 
const messageRoutes = require('./routes/messageRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
    res.render('chat');
});

// Endpoint to serve password-user mapping
app.get('/api/passwords', (req, res) => {
    const passwordsFilePath = path.join(__dirname, '../passwords.txt');
    fs.readFile(passwordsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading passwords file:', err);
            return res.status(500).json({ error: 'Failed to read passwords file' });
        }
        const passwordUserMapping = data.split('\n').reduce((acc, line) => {
            const [password, user] = line.split(':').map(item => item.trim()); // Trim whitespace
            if (password && user) {
                acc[password] = user;
            }
            return acc;
        }, {});
        res.json(passwordUserMapping);
    });
});

// Serve the commands page
app.get('/cmd', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/commands.html'));
});

// Endpoint to clear messages
app.delete('/api/messages', async (req, res) => {
    try {
        await Message.deleteMany({});
        res.status(200).json({ message: 'All messages cleared' });
    } catch (error) {
        console.error('Error clearing messages:', error);
        res.status(500).json({ error: 'Failed to clear messages' });
    }
});

// Endpoint to add a new user
app.post('/api/users', (req, res) => {
    const { password, user } = req.body;
    const passwordsFilePath = path.join(__dirname, '../passwords.txt');
    fs.appendFile(passwordsFilePath, `\n${password}:${user}`, (err) => {
        if (err) {
            console.error('Error adding user:', err);
            return res.status(500).json({ error: 'Failed to add user' });
        }
        res.status(200).json({ message: 'User added successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});