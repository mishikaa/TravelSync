const express = require('express')
const { protect } = require('../middlewares/auth')
const {accessChat, fetchAllChats, createGroupChat, renameGroup, addToGroup, removalFromGroup} = require('../controllers/chatControllers')

const router = express.Router()

router.route('/')
    .post(protect, accessChat)
    .get(protect, fetchAllChats)

router.route('/group')
    .post(protect, createGroupChat)

router.route('/rename')
    .put(protect, renameGroup)

router.route('/groupRemove')
    .put(protect, removalFromGroup) //to remove a user from a group

router.route('/groupAdd')
    .put(protect, addToGroup)

module.exports = router;