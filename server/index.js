require('dotenv').config()

const express = require("express");
const connectDB = require('./config/db');
const colors = require('colors')
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middlewares/error');
const path = require('path')

const app = express();
connectDB();

app.use(express.json())

app.use('/api/user', userRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/message', messageRoutes)

// DEPLOYMENT 
const __dirname1 = path.resolve() 
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, "/client/build")))
    
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
    })
} else {
    app.get("/", (req, res) => {
        res.send("API running successfully")
    })
}

app.use(notFound)
app.use(errorHandler)

const server_port = process.env.SERVER_PORT;

const server = app.listen(server_port, console.log(`SERVER STARTED ON PORT ${server_port}`.brightBlue.bold))

// setup of socket.io in backend
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("CONNECTED TO socket.io".green.bold)
    
    socket.on('setup', (userData) => {
        socket.join(userData._id); // A room has been created for a particular user
        
        socket.emit("connected");
    })

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User joined room: " + room);
    })

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if(!chat.users)
            return console.log("chat.users is not defined");

        chat.users.forEach((user) => {
            // If one sends a message in a group then notification should be shown 
            // to all the members of the group except the sender 
            if(user._id === newMessageReceived.sender._id)
                return ;

            socket.in(user._id).emit("message received", newMessageReceived)
        });
    })

    socket.on('typing', (room) => socket.in(room).emit("typing"))
    socket.on('stop typing', (room) => socket.in(room).emit("stop typing"))

})