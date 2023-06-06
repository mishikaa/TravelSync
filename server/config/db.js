const mongoose = require('mongoose')

const colors = require('colors')

const connectDB = async() => {
    try {
        const conn = mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log("MONGODB CONNECTED".cyan.bold)
    } catch (error) {
        console.log(`ERROR: ${error.message}`);
        process.exit();
    }
}

module.exports = connectDB;