require("dotenv").config()
const jwt = require("jsonwebtoken");
const db = require("./db/db");

/* HELPER FUNCTIONS */

/**
 * MIDDLEWARE, generates AuthToken.
 * @param {*} options
 * @returns void
 */
function authToken(options) {
    return function(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401);
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403); // has token but no longer valid
            req.user = user
            next()
        });
    }
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

async function login(username, res) {
    const user = { name: username };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    await db.addRefreshToken(refreshToken);

    res.json({ accessToken, refreshToken });
}

async function logout(token, res) {
    await db.delRefreshToken(req.body.token);
    res.sendStatus(204);
}

/* EXPORTED FUNCTIONS END */

module.exports = { login, logout, authToken, getAccessToken }
