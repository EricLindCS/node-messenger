const express = require('express');
const mongoose = require('mongoose');
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});