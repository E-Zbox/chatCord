const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const dotenv = require("dotenv");

const formatMessage = require("./utils/messages");
const {
    getCurrentUser,
    getRoomUsers,
    userJoin,
    userLeave,
} = require("./utils/users");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

const admin = "Admin [ ~mazi Eben]";
// run when a client connects
io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        console.log("[ line 23 ]", user);

        socket.join(user.room);

        // welcome current user
        socket.emit(
            "welcome",
            formatMessage(
                socket.id,
                admin,
                `Welcome to ChatCord, ${username}`,
                getRoomUsers(user.room)
            )
        );

        // broadcast to other users when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                formatMessage(
                    socket.id,
                    admin,
                    `${username} joined the chat`,
                    getRoomUsers(user.room)
                )
            );
        // listen for chatMessage
        socket.on("chatMessage", (message) => {
            console.log("chat");
            io.to(user.room).emit(
                "message",
                formatMessage(
                    socket.id,
                    username,
                    message,
                    getRoomUsers(user.room)
                )
            );
        });

        // when user disconnects
        socket.on("disconnect", () => {
            userLeave(socket.id);
            io.to(user.room).emit(
                "goodbye",
                formatMessage(
                    socket.id,
                    admin,
                    `${username} left the chat`,
                    getRoomUsers(user.room)
                )
            );
        });
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
