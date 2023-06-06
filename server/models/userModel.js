const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
},
{
    timestamps: true
}
)

userSchema.methods.matchPassword = async function(enteredPass) {
    return await bcrypt.compare(enteredPass, this.password)
}

userSchema.pre('save', async function(next) {
    if(!this.isModified) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
module.exports = mongoose.model("User", userSchema);

