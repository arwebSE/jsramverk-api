require("dotenv").config()
const jwt = require("jsonwebtoken");
const db = require("../db/db");
const bcrypt = require("bcrypt");

/* HELPER FUNCTIONS */

// Gen secrets: require("crypto").randomBytes(64).toString("hex")

/**
 * Generate AccessToken using RefreshToken,
 * return AccessToken to client.
 */
async function getAccessToken(refreshToken, res) {
    if (refreshToken == null) return res.sendStatus(401);

    const results = await db.findRefreshToken(refreshToken);
    if (results === null) {
        return res.sendStatus(403); // If not found (RefreshToken expired)
    }
    if (!results) return res.sendStatus(500); // Error searching for rftoken

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ id: user._id, username: user.username });
        res.json({ accessToken })
    });
}

/**
 * Returns an AccessToken for given user,
 * that expires in 30 seconds.
 */
function generateAccessToken(user) {
    return jwt.sign({ id: user._id, username: user.username },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s' }
    );
}

/* HELPER FUNCTIONS END */

/* EXPORTED FUNCTIONS */

async function login(req, res) {
    const user = await db.findUser(req.body.username);
    try {
        // If username exists and password correct
        if (user !== null && await user.comparePassword(req.body.password)) {
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign({ id: user._id, username: user.username }, process.env.REFRESH_TOKEN_SECRET);
            await db.addRefreshToken(refreshToken);

            res.json({ accessToken, refreshToken });
        } else {
            res.status(401).json("Wrong username or password!")
        }
    } catch (err) {
        console.log("=> Error logging in:", err);
        res.status(500).send()
    }
}

async function register(req, res) {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        const results = await db.createUser(req.body.username, hashedPass);
        if (results === true) {
            res.status(201).json(`Successfully registered user: ${req.body.username}`)
        } else {
            throw results;
        }
    } catch (err) {
        res.status(500).json({ status: 500, message: "User already exist!", error: err });
    }
}

async function logout(req, res) {
    const results = await db.delRefreshToken(req.body.token);
    if (results) {
        console.log("=> Deleted count:", results.deletedCount);
    }
    res.sendStatus(204);
}

/* EXPORTED FUNCTIONS END */

module.exports = { login, logout, getAccessToken, register }
