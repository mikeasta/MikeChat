const path    = require("path");
const express = require("express");
const app     = express();
const http    = require("http").createServer(app);
const io      = require("socket.io")(http);
const formatMessage = require("./utils/messages");
const {getUser, addUser, removeUser, roomUsers} = require("./utils/users");

// Bot name
const botName = "MikeChatBot";

io.on("connection", socket => {

    // Joining room
    socket.on("joinRoom", ({username, room}) => {
        const user = addUser( {
            id: socket.id,
            username,
            room
        });

        socket.join(user.room);

        // Welcome to current user
        socket.emit("message", formatMessage(botName, "Welcome to MikeChat!"));

        //Welcome to all users except current
        socket.broadcast.to(user.room).emit("message", formatMessage(botName,  `${user.username} connected`));

        
        io.to(user.room).emit("roomUsers", roomUsers(room));
    });


    socket.on( "chatMessage", ({username, text, room}) => {
        io.to(room).emit( "message", formatMessage(username, text))
    });

    // On disconnect
    socket.on( "disconnect", () => {
        const user = removeUser(socket.id);
        io.to(user.room).emit("leaveRoom", user.username);
        io.to(user.room).emit("message", formatMessage(botName, `${user.username} disconnected`));
    });
})

// Set static folder
app.use( express.static( path.join(__dirname, "public") ) );

// PORT initialyze
const PORT = process.env.PORT || 5000;

// Server start listening
http.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
})