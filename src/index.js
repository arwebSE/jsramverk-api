// Environment vars
require('dotenv').config();

// Essential deps & config
const express = require("express");
const app = require('express')();
const server = require('http').Server(app);
const port = process.env.PORT;
const cors = require("cors");
const io = require('socket.io')(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

// Misc dependencies
const chalk = require("chalk");

// User imports
const mw = require("./middleware"); // Import middleware
const db = require("./db/db"); // Import db.js module
const auth = require("./auth"); // Import auth.js module
require('./socket')(io) // Import socket.js module, providing this io obj.

// Server setup
app.use(express.json()); // parsing application/json
app.use(express.urlencoded({ extended: true })); // parsing application/x-www-form-urlencoded
app.use(cors()); // cors

// Env mode check
console.log("Launching API in env mode:", process.env.NODE_ENV);
let testing = false;
if (process.env.NODE_ENV == "test") testing = true;
if (!testing) app.use(mw.morganMW);

/** ROUTES **/

// Index page (to check status of API)
app.get("/", function(_req, res) {
    res.json({
        data: { msg: `Index. DSN: ${db.getDSN()}`, status: "online" }
    });
});

// Refresh AccessToken using RefreshToken.
app.post("/token", async(req, res) => {
    const refreshToken = req.body.token;
    auth.getAccessToken(refreshToken, res);
});

// Login user using username and password.
app.post("/login", async(req, res) => {
    auth.login(req, res);
});

// Demo locked page unlocked using credentials
app.get("/demo", mw.authToken, async(req, res) => {
    const secrets = [{ username: "mi", data: "testin" }, { username: "admin", data: "testin2" }] // demo content
    res.json(secrets.filter(secret => secret.username === req.user.username)); // req.user added by middleware, ignore warning
});

// Logout specified user
app.delete("/logout", async(req, res) => {
    auth.logout(req.body.token, res);
})

// Get list of all users
/* app.get("/users", async (_req, res) => {
    const users = await db.getUsers();
    res.json(users);
}); */

// Register user using new username and password
app.post("/register", async(req, res) => {
    auth.register(req, res);
});

/** ROUTES END **/

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
    chalk.hex("#f78fb3").bold(`🎃 [${date.toISOString().slice(0, -5)}]`),
    chalk.hex("#ff4757").bold("DSN:"),
    chalk.hex("#34ace0").bold(db.getDSN()),
].join(" ")

// BOOTUP
server.listen(port, () => {
    console.log(`=> API now running on port ${port}!`);
    if (!testing) console.log(bootText);
});
