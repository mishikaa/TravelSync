const expressAsyncHandler = require("express-async-handler")
const User = require('../models/userModel')
const generateToken = require("../config/generateToken")

const registerUser = expressAsyncHandler(async(req, res) => {
    const {username, email, password, profilePic} = req.body
    if(!username || !email || !password) {
        res.status(400)
        throw new Error("Please fill all the required fields")
    }

    const userExists = await User.findOne({email})
    if(userExists) {
        res.status(400)
        throw new Error("User already exists. Login")
    } 

    const user = await User.create({
        username, email, password, profilePic
    })
    // if user has been successfully created in the database
    if(user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            token: generateToken(user._id)
        }) 
    } else {
        res.status(400)
        throw new Error("User registration failed.")
    }
})

const authUser = expressAsyncHandler(async(req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({email})
    
    // If such a user exists in the database 
    if(user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Invalid username or password")
    }
})

// To find all the users with the given query
// /api/user?search=<string>
const allUsers = expressAsyncHandler(async(req, res) => {
    const keyword = req.query.search ? {
        // if a req.query.search exists, then either the username or email matches the string in query(pattern matching)
        $or : [
            {username: {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}},
        ]
    } : {}
    // Find all the users having the string as per the query.search in their email or username except the user that is currently logged in
    const users = await User.find(keyword).find({_id: {$ne: req.user._id}})
    res.send(users)
})

module.exports = {registerUser, authUser, allUsers};