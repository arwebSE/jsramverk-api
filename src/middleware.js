const morgan = require("morgan");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");

/**
 * Creates boot text using chalk & morgan
 */
const morganMW = morgan(function(tokens, req, res) {
    return [
        chalk.hex("#ff4757").bold("🎃"),
        chalk.hex("#f78fb3").bold(`[${tokens.date(req, res, "iso").slice(0, -5)}]`),
        chalk.hex("#34ace0").bold(tokens.method(req, res)),
        chalk.hex("#ffb142").bold(tokens.status(req, res)),
        chalk.hex("#ff5252").bold(tokens.url(req, res)),
        chalk.yellow(tokens["remote-addr"](req, res)),
        chalk.hex("#2ed573").bold(tokens["response-time"](req, res) + " ms"),
    ].join(" ")
});

/**
 * Verifies auth header (accessToken), sets user based on token.
 */
function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // has token but no longer valid
        req.user = user
        next()
    });
}

/**
 * Verifies accessToken, sets user.
 */
function verifyLogin(token) {
    console.log("Verifying token:", token);
    if (token == null) return false;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) console.log("Error verify:", err);
        return user;
    });
}

module.exports = { morganMW, authToken, verifyLogin }
