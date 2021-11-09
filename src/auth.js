require("dotenv").config()
const jwt = require("jsonwebtoken");
const db = require("./db/db");
const bcrypt = require("bcrypt");

/* HELPER FUNCTIONS */

/**
 * MIDDLEWARE, verifies auth header (accessToken), sets user based on token.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns void
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
 * Generate AccessToken using RefreshToken,
 * return AccessToken to client.
 */
function getAccessToken(refreshToken, res) {
    if (refreshToken == null) return res.sendStatus(401);
    if (!db.findRefreshToken(refreshToken)) return res.sendStatus(403); // If RefreshToken expired

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name });
        res.json({ accessToken })
    });
}

/**
 * Returns an AccessToken for given user,
 * that expires in 30 seconds.
 */
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
}

/* HELPER FUNCTIONS END */

/* EXPORTED FUNCTIONS */

async function login(req, res) {
    const user = users.find(user => user.name === req.body.username)
    if (user === null) {
        return res.status(400).send("Cannot find user")
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
            await db.addRefreshToken(refreshToken);

            res.json({ accessToken, refreshToken });
        } else {
            res.status(403).send("Not allowed")
        }
    } catch (err) {
        res.status(500).send()
    }
}

async function register(req, res) {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        const results = await db.createUser(req.body.name, hashedPass);
        if (results === true) {
            res.status(201).send() // If creation successful
        } else {
            throw results;
        }
    } catch (err) {
        res.status(500).send(`${err}`)
    }
}

async function logout(token, res) {
    await db.delRefreshToken(token);
    res.sendStatus(204);
}

/* EXPORTED FUNCTIONS END */

module.exports = { login, logout, authToken, getAccessToken, register }
