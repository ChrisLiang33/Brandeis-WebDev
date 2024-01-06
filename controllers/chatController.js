//chat controller 
const Message = require("../models/message");

module.exports = (io) => {

    //when connected
    io.on("connection", (client) => {
        client.broadcast.emit("user joined");
        client.on("disconnect", () => {
            client.broadcast.emit("user disconnected");
            console.log("user disconnected");
        });
        client.on("message", (data) => {
            let messageAttributes = {
                content: data.content,
                userName: data.userName,
                user: data.userId,
            };
            Message.create(messageAttributes)
                .then(() => {
                    io.emit("message", messageAttributes);
                })
                .catch((error) => {
                    console.log(`error: ${error.message}`);
                });
        });
        Message.find({})
            .sort({ createdAt: -1 })
            .limit(20)
            .then((messages) => {
                client.emit("load all messages", messages.reverse());
            })
            .catch((error) => {
                console.log(`error: ${error.message}`);
            });
    });
};
