const path    = require("path");
const express = require("express");
const app     = express();
const http    = require("http").createServer(app);
const io      = require("socket.io")(http);
const formatMessage = require("./utils/messages");
const {getCurrentUser, addUser, removeUser, roomUsers} = require("./utils/users");

// Bot name
const botName = "MikeChatBot";

// Set static folder
app.use( express.static( path.join(__dirname, "public") ) );

// IO interface implemention
io.on("connection", socket => {

    // Joining room
    socket.on("joinRoom", ({username, room}) => {
        // Adding current user's object to user state
        const user = addUser( {
            id: socket.id,
            username,
            room
        });

        // Joining to special chanel
        socket.join(user.room);

        // Welcome to current user
        socket.emit("message", formatMessage(botName, "Welcome to MikeChat!"));

        //Welcome to all users except current
        socket.broadcast.to(user.room).emit("message", formatMessage(botName,  `${user.username} connected`));
        
        io.to(user.room).emit("roomUsers", roomUsers(room));
    });

    // Listen on message submit event
    socket.on( "chatMessage", ({ text }) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit( "message", formatMessage(user.username, text))
    });

    // On disconnect
    socket.on( "disconnect", () => {
        // Get current user data
        const user = getCurrentUser(socket.id);

        // Remove user from state
        removeUser(socket.id);

        // Send leaved user username for updating array
        io.to(user.room).emit("leaveRoom", user.username);

        // Send message about quiting
        io.to(user.room).emit("message", formatMessage(botName, `${user.username} disconnected`));
    });
})

// PORT initialyze
const PORT = process.env.PORT || 5000;

// Server start listening
http.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
})