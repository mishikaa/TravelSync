const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// Accessing chats between the given user and the logged in user, and if does not exist, then creating one
const accessChat = expressAsyncHandler(async(req, res) => {
    const {userId} = req.body

    // if the userId has not been sent in the req.body
    if(!userId) {
        console.log("UserId param not sent with the request")
        return res.sendStatus(400)
    }
    
    // Checking whether a chat exists between the logged in user and the userId user
    var chatExists = await Chat.find({
        isGroupChat: false, //not a group
        $and: [
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}},
        ]
    }).populate('users', '-password')
      .populate('latestMessage')

    chatExists = await User.populate(chatExists, {
        path: "latestMessage.sender",
        select: "username profilePic email"
    })

    // if such a chat exists
    if(chatExists.length > 0) {
        res.send(chatExists[0])
    } 
    else {
        const sender = await User.find({_id: userId})
        
        // Create a chat
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }  

        try {
            const createdChat = await Chat.create(chatData)
            
            const fullChat = await Chat.findOne({_id: createdChat._id})
                .populate('users', '-password')
                .populate('latestMessage')
            
            res.status(200).send(fullChat)
        }
        catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
})

// Fetching all the chats of the logged in user
const fetchAllChats = expressAsyncHandler(async(req, res) => {
    try {
        const chats = await Chat.find(
            {users: {
                $elemMatch: {
                    $eq: req.user._id
                    }
                }
            })
            .populate('users',  '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage')
                .sort({updatedAt: -1})

        
        res.status(200).send(chats)
    } catch (error) {
        
    }
})

// Creating a group chat
const createGroupChat = expressAsyncHandler(async(req, res) => {
    if(!req.body.users || !req.body.chatName) {
        return res.status(400)
                  .send({ message: "Kindly fill all the reuqired fields"
        })
    }
    var users = JSON.parse(req.body.users)
    if(users.length >= 2) {
        users.push(req.user) //the logged in user
        try {
            const group = await Chat.create({
                chatName: req.body.chatName,
                isGroupChat: true,
                users: users,
                groupAdmin: req.user
            })
            
            const groupChat = await Chat.findOne(
                {_id: group._id})
                .populate("users", "-password")
                .populate("groupAdmin", "-password")

            res.status(200).send(groupChat)

        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    } else {
        return res.status(400)
                  .send("More than 2 users are required to create a group chat")
    }
})

// To rename the group
const renameGroup = expressAsyncHandler(async(req, res) => {
    const {chatId, chatName} = req.body

    const updatedGroupChat = await Chat.findByIdAndUpdate(chatId, 
        {
            chatName: chatName
        }, {
            new: true //return as the updated value of the group chat
           }
        )
        .populate('users', '-password')
        .populate('groupAdmin', '-password')

    if(!updatedGroupChat) {
        res.status(404)
        throw new Error("Chat not found")
    } else {
        res.json(updatedGroupChat)
    }
})

// Add new member to the group
const addToGroup = expressAsyncHandler(async(req, res) => {
    const {chatId, userId} = req.body
    const group = await Chat.findByIdAndUpdate(chatId, 
        {
            $push: {users: userId}
        },
        {
            new: true
        })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')

        if(!group) {
        res.status(404)
        throw new Error("Chat not found")
    } else {
        res.json(group)
    }
})

// Remove a user from the group
const removalFromGroup = expressAsyncHandler(async(req, res) => {
    const {chatId, userId} = req.body
    const group = await Chat.findByIdAndUpdate(chatId, 
        {
            $pull: {users: userId}
        },
        {
            new: true
        })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')

    if(!group) {
        res.status(404)
        throw new Error("Chat not found")
    } else {
        res.json(group)
    }
})

module.exports = {accessChat, fetchAllChats, createGroupChat, renameGroup, addToGroup, removalFromGroup}