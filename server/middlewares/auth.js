const expressAsyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = expressAsyncHandler(async(req, res, next) => {
    let token;

    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer") //A Bearer token starts with 'Bearer'
    ) {

        try {
            token = req.headers.authorization.split(" ")[1] //only gives the token

            const decoded = jwt.verify(token, process.env.JWT_SECRET) //checking if such token exists

            req.user = await User.findById(decoded.id).select("-password") //storing all the details of user except the password in req.user
            next();
        } catch(error) {
            res.status(401)
            throw new Error("Not authorized, token failed.")
        }
    }
    if(!token) {
        res.status(401)
        throw new Error("Not authorized, no token.")
    }
})

module.exports = {protect}