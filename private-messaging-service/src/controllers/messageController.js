const Message = require('../models/messageModel');

class MessageController {
    constructor(messageModel) {
        this.messageModel = messageModel;
    }

    async sendMessage(req, res) {
        try {
            const { sender, receiver, content } = req.body;
            console.log('Received message:', { sender, receiver, content });
            const newMessage = await this.messageModel.create({ sender, receiver, content });
            console.log('Message saved:', newMessage);
            res.status(201).json(newMessage);
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ error: 'Failed to send message' });
        }
    }

    async getMessages(req, res) {
        try {
            const { user1, user2 } = req.query;
            const messages = await this.messageModel.find({
                $or: [
                    { sender: user1, receiver: user2 },
                    { sender: user2, receiver: user1 }
                ]
            });
            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve messages' });
        }
    }
}

module.exports = MessageController;