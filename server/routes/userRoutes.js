const express = require('express')
const {registerUser, authUser, allUsers} = require('../controllers/userControllers')

const {protect} = require('../middlewares/auth')

const router = express.Router()

// POST REQUEST FOR REGISTRATION
router.route('/')
    .post(registerUser)
    .get(protect, allUsers)

// POST REQUEST FOR LOGIN
router.route('/login').post(authUser)

module.exports = router