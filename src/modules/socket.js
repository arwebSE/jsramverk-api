require("dotenv").config();

exports = module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("Socket connected ID:", socket.id);
        socket.on("disconnect", () => console.log("Disconnected ID:", socket.id));

        socket.on("get-document", async (docid) => {
            socket.join(docid); // Join room by docid
            socket.once("send-changes", () => {
                console.log("<= broadcasting changes");
            });
            socket.on("send-changes", (delta) => {
                // Send changes to document room on broadcast
                socket.broadcast.to(docid).emit("receive-changes", delta);
            });
        });
    });
};
