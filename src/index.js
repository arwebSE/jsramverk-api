require("dotenv").config()

const express = require("express");
const app = require('express')();
const server = require('http').Server(app);
const port = process.env.PORT;
const cors = require("cors");
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const morgan = require("morgan");
const chalk = require("chalk");
const morganMiddleware = morgan(function(tokens, req, res) {
    return [
        chalk.hex("#ff4757").bold("🎃"),
        chalk.hex("#f78fb3").bold(`[${tokens.date(req, res, "iso").slice(0, -5)}]`),
        chalk.hex("#34ace0").bold(tokens.method(req, res)),
        chalk.hex("#ffb142").bold(tokens.status(req, res)),
        chalk.hex("#ff5252").bold(tokens.url(req, res)),
        chalk.yellow(tokens["remote-addr"](req, res)),
        chalk.hex("#2ed573").bold(tokens["response-time"](req, res) + " ms"),
    ].join(" ")
})
if (process.env.NODE_ENV !== "test") {
    app.use(morganMiddleware)
} else {
    console.log("testing!");
}

const db = require("./db/db");

/** Routes **/
app.get("/", function(_req, res) {
    res.json({
        data: { msg: `Index. DSN: ${db.getDSN()}`, status: "online" }
    });
});


// ERROR HANDLING
app.use((_req, _res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});
app.use((err, _req, res, next) => {
    if (res.headersSent) { return next(err); }
    res.status(err.status || 500).json({
        "errors": [{
            "status": err.status,
            "title": err.message,
            "detail": err.message
        }]
    });
});

// PARSING SETUP
app.use(express.json()); // application/json
app.use(express.urlencoded({ extended: true })); // application/x-www-form-urlencoded

// BOOT TEXT
let date = new Date();
bootText = [
    chalk.hex("#f78fb3").bold("🎃", date.toISOString().slice(0, -5)),
    chalk.hex("#ff4757").bold("DSN:"),
    chalk.hex("#34ace0").bold(db.getDSN()),
].join(" ")

// SOCKET SERVER
io.on("connection", socket => {
    console.log("Socket connected ID:", socket.id);
    socket.on("disconnect", () => { console.log("Disconnected ID:", socket.id); })

    socket.on("get-document", async docid => {
        const document = await db.create(docid)
        socket.join(docid) // Join room by docid
        socket.emit("load-document", document.data);

        socket.on("send-changes", delta => {
            // Send changes to document room on broadcast
            socket.broadcast.to(docid).emit("receive-changes", delta);
            console.log("received changes:", delta);
        })

        socket.on("save-document", async delta => {
            console.log("request to save received");
            const results = await db.update(docid, delta);
            socket.emit("saved-status", results);
        })
    })

    socket.on("create-document", async (docid, name) => {
        const document = await db.create(docid, name)
        socket.emit("created-document", document);
    })

    socket.on("list-documents", async (msg) => {
        console.log("received listdocuments", msg)
        const docs = await db.listDocs();
        socket.emit("listed-documents",  docs);
    })

    socket.on("resetdb", async () => {
        console.log("received resetdb")
        const results = await db.reset();
        if (results) {
            socket.emit("resetdb");
        } else {
            console.log("resetdb error!");
        }
    })
})

// BOOTUP
server.listen(port, () => {
    console.log(`Running API on port ${port}!`);
    if (process.env.NODE_ENV !== "test") {
        console.log(bootText);
    }
}); // Start up server
