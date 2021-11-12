require('dotenv').config();

const db = require("./db/db");
const mw = require("./middleware");

exports = module.exports = (io) => {
    io.on("connection", socket => {
        console.log("Socket connected ID:", socket.id);
        socket.on("disconnect", () => { console.log("Disconnected ID:", socket.id); })

        socket.on("get-document", async docid => {
            const document = await db.open(docid)
            socket.join(docid) // Join room by docid
            console.log("<= sending loaded doc");
            socket.emit("load-document", document);

            socket.once("send-changes", () => {
                console.log("<= broadcasting changes");
            })
            socket.on("send-changes", delta => {
                // Send changes to document room on broadcast
                socket.broadcast.to(docid).emit("receive-changes", delta);
            })
        })

        socket.on("save-document", async(docid, staticDelta) => {
            console.log("=> saving changes to DB");
            await db.update(docid, staticDelta);
            socket.emit("saved-status", "DB updated successfully.");
        })

        socket.on("create-document", async(name, data = {}, users = []) => {
            const document = await db.create(name, data, users)
            socket.emit("created-document", document);
        })

        socket.on("list-documents", async(token) => {
            const user = mw.verifyLogin(token);
            if (user) {
                console.log("=> Listing docs...")
                console.log("wud list for", user);
                //const docs = await db.listDocs(user);
                //socket.emit("list-documents", docs);
            } else {
                console.log("Login verify failed!");
            }
        })

        socket.on("resetdb", async() => {
            console.log("=> resetdb requested")
            await db.reset();
        })
    })
}
