const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/messageController');
const messageModel = require('../models/messageModel');

const messageController = new MessageController(messageModel);

router.post('/', (req, res) => messageController.sendMessage(req, res));
router.get('/', (req, res) => messageController.getMessages(req, res));

module.exports = router;