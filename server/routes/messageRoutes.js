const express = require('express');
const { protect } = require('../middlewares/auth');
const {sendMessage, allMessages} = require('../controllers/messageControllers');

const routes = express.Router()

routes.route('/').post(protect, sendMessage)

// To fetch all the messages of a single chat
routes.route('/:chatId').get(protect, allMessages)

module.exports = routes;