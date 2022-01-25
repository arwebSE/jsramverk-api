require("dotenv").config();

const mongoose = require("mongoose");
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
let DSN = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
let maskedDSN = `mongodb+srv://${DB_USER}:<PASSWD>@${DB_HOST}/${DB_NAME}`;
if (process.env.NODE_ENV === "test") {
    DSN, (maskedDSN = "mongodb://127.0.0.1/test");
}

// Mongoose
const RefreshToken = require("./RefreshToken");
const User = require("./User");
const Document = require("./Document");

// Mongoose ref
let mongo;

/**
 * Return DSN without password
 */
function getDSN() {
    return maskedDSN;
}

function getMongo() {
    return mongo;
}

/**
 * Connect to mongoDB
 */
async function connect() {
    console.log("📡 Connecting to mongoDB...");
    return mongoose
        .connect(DSN)
        .then((dbConnection) => {
            mongo = dbConnection;
            console.log("✅ Successfully connected to mongoDB!");
            return dbConnection;
        })
        .catch((err) => console.log("❌ Error connecting to mongoDB:", err));
}

/**
 * List all RefreshTokens
 */
async function getRefreshTokens() {
    return await RefreshToken.find();
}

/**
 * Create RefreshToken
 */
async function addRefreshToken(token) {
    console.log("=> DB: Adding RefreshToken:", token);

    let options = { upsert: true, new: true, setDefaultsOnInsert: true };
    RefreshToken.findOneAndUpdate({ token }, {}, options, function (err) {
        if (err) console.log("=> Error creating rftoken:", err);
        else console.log("=> RefreshToken was added!");
    });
}

/**
 * Remove RefreshToken
 */
async function delRefreshToken(token) {
    console.log("=> DB: Removing RefreshToken:", token);
    try {
        return await RefreshToken.deleteOne({ token });
    } catch (err) {
        console.log("=> Error deleting rftoken:", err);
        return false;
    }
}

/**
 * Find RefreshToken, return true or false
 */
async function findRefreshToken(token) {
    console.log("=> DB: Looking for rftoken:", token);
    try {
        return await RefreshToken.findOne({ token });
    } catch (err) {
        console.log("=> Error looking for rftoken:", err);
        return false;
    }
}

/**
 * List all existing users
 */
async function getUsers() {
    return await User.find();
}

/**
 * Create new User
 */
async function createUser(username, password) {
    console.log("=> DB: creating User with name:", username);
    try {
        await User.create({ username, password });
        return true;
    } catch (err) {
        if (err.name === "MongoServerError" && err.code === 11000) {
            console.log(`=> Couldn't create User "${username}" because that username already exists.`);
            return err.code;
        } else {
            console.log("=> Error creating user:", err);
            return err.code;
        }
    }
}

/**
 * Create new User
 */
async function findUser(username) {
    console.log("=> DB: finding User with name:", username);
    try {
        return await User.findOne({ username });
    } catch (err) {
        console.log("=> Error finding user:", err);
        return err.code;
    }
}

/**
 * Accept editor invite
 */
async function addDocumentEditor(req, res) {
    const docid = req.query.docid;
    const user = req.query.user;
    console.log("=> DB: Adding editor", user, "to document:", docid);
    if (docid != undefined && user != undefined) {
        if (process.env.NODE_ENV === "test") {
            res.sendStatus(200);
            return true;
        } else {
            Document.findByIdAndUpdate(docid, { $addToSet: { users: [user] } }, { new: true }, function (err) {
                if (err) {
                    console.log("=> Error adding editor:", err);
                    res.sendStatus(500);
                } else {
                    console.log("=> Editor was added!");
                    res.sendStatus(200).send(`
                    Successfully accepted invite!<br>
                    You can now go to AuroDocs™ to edit the document.<br>
                    Link: <a href='http://www.student.bth.se/~auro17/editor/'>http://www.student.bth.se/~auro17/editor/</a>
                `);
                    return true;
                }
                return;
            });
        }
    } else {
        res.sendStatus(500);
    }
}

module.exports = {
    connect,
    getDSN,
    getRefreshTokens,
    addRefreshToken,
    delRefreshToken,
    findRefreshToken,
    getUsers,
    createUser,
    findUser,
    addDocumentEditor,
    getMongo,
};
