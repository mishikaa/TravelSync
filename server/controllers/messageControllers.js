const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = expressAsyncHandler(async(req, res) => {
    const {content, chatId} = req.body
    if(!content || !chatId) {
        return res.status(400).json({error: "Missing Content or ChatId"})
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        var message = await Message.create(newMessage)
        // Populating the username and profilePic fields of the sender field
        message = await message.populate("sender", "username profilePic");
        // Populating the chat field of the message mongo instance
        message = await message.populate("chat");
        // Populating the username, profilePic and email fields of users model
        message = await User.populate(message, {
            path: 'chat.users',
            select: "username profilePic email"
        })
        
        // Updating the latestMessage parameter of Chat model
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })

        res.json(message)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const allMessages = expressAsyncHandler(async(req, res) => {
    const {chatId} = req.params;
    if(!chatId) {
        return res.status(400).json({error: "Missing chatId"})
    }
    try {
        const allMessages = await Message.find({chat: chatId})
            .populate("sender","-password")
                .populate("chat")
        
        res.json(allMessages)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

module.exports = {sendMessage, allMessages}