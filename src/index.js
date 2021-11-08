require('dotenv').config();
const express = require("express");
const app = require('express')();
const server = require('http').Server(app);
const port = process.env.PORT;
const cors = require("cors");
const io = require('socket.io')(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

const auth = require("./auth"); // Import auth.js module
require('./socket')(io) // Import socket.js module, providing this io obj.

// SETUP
app.use(express.json()); // parsing application/json
app.use(express.urlencoded({ extended: true })); // parsing application/x-www-form-urlencoded
app.use(cors()); // cors

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
console.log("Launching in env mode:", process.env.NODE_ENV);
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

/**
 * Return new AccessToken if provided RefreshToken exists in DB.
 */
app.post("/token", async(req, res) => {
    const refreshToken = req.body.token;
    auth.getAccessToken(refreshToken, res);
});

app.post("/login", async(req, res) => {
    auth.login(req.body.username, res);
});

app.get("/demo", auth.authToken, async(req, res) => {
    const secrets = [{ username: "mi", data: "testin" }, { username: "admin", data: "testin2" }] // demo content
    res.json(secrets.filter(secret => secret.username === req.user.name));
});

app.delete("/logout", async(req, res) => {
    auth.logout(req.body.token, res);
})

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


// BOOT TEXT
let date = new Date();
bootText = [
    chalk.hex("#f78fb3").bold("🎃", date.toISOString().slice(0, -5)),
    chalk.hex("#ff4757").bold("DSN:"),
    chalk.hex("#34ace0").bold(db.getDSN()),
].join(" ")

// BOOTUP
server.listen(port, () => {
    console.log(`=> Running API on port ${port}!`);
    if (process.env.NODE_ENV !== "test") {
        console.log(bootText);
    }
}); // Start up server
