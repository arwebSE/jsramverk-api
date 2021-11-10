require("dotenv").config()

const chalk = require("chalk");
const mongoose = require("mongoose")
const DB_HOST = process.env.DB_HOST
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
let DSN = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
const maskedDSN = `mongodb+srv://${DB_USER}:<PASSWD>@${DB_HOST}/${DB_NAME}`;
if (process.env.NODE_ENV == "test") { DSN = "mongodb://localhost:27017/test" }

// Mongoose
mongoose.connect(`${DSN}`)
const Document = require("./Document");
const RefreshToken = require("./RefreshToken");
const User = require("./User");

/**
 * Return DSN without password
 */
function getDSN() {
    return maskedDSN
}

/**
 * Reset collection
 */
async function reset() {
    Document.deleteMany({}, function(err) {
        if (err) {
            console.log("=> DB: error resetting:", err);
            return;
        } else {
            console.log('=> DB: successfully reset!')
            return true;
        }
    });
}

/**
 * List all existing documents
 */
async function listDocs() {
    return await Document.find();
}

/**
 * Create new document
 */
async function create(name, data = {}, users = []) {
    console.log("=> DB: creating doc with name:", name)
    const doc = await Document.create({ name, data, users }) // Create empty doc
    return doc
}


/**
 * Fetch existing document
 */
async function open(docid) {
    console.log("=> DB: opening doc by id:", docid);
    return await Document.findById(docid)
}

/**
 * Update existing document
 */
async function update(docid, data) {
    return await Document.findByIdAndUpdate(docid, { data })
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
    console.log("=> DB: Adding RefreshToken:", token)

    let options = { upsert: true, new: true, setDefaultsOnInsert: true };
    RefreshToken.findOneAndUpdate({ token }, {}, options, function(err) {
        if (err) console.log("=> Error creating rftoken:", err)
        else console.log("=> RefreshToken was added!");
    });
}

/**
 * Remove RefreshToken
 */
async function delRefreshToken(token) {
    console.log("=> DB: Removing RefreshToken:", token)
    RefreshToken.deleteOne({ token }, function(err) {
        if (err) console.log("=> Error deleting rftoken:", err)
        else console.log("=> Successfully deleted rftoken.");
    });
}

/**
 * Find RefreshToken, return true or false
 */
async function findRefreshToken(token, callback) {
    console.log("=> DB: Looking for rftoken:", token)
    RefreshToken.findOne({ token }, function(err, results) {
        if (err) {
            console.log("=> Error deleting rftoken:", err)
            callback && callback(false);
        }
        if (results === null) {
            console.log("=> DB: rftoken was not found...")
            callback && callback(false);
        } else {
            console.log("=> DB: rftoken found!")
            callback && callback(true);
        }
    });
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
    console.log("=> DB: creating User with name:", username)
    try {
        await User.create({ username, password })
        return true;
    } catch (err) {
        if (err.name === 'MongoServerError' && err.code === 11000) {
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
    console.log("=> DB: finding User with name:", username)
    try {
        return await User.findOne({ username })
    } catch (err) {
        console.log("=> Error finding user:", err);
        return err.code;
    }
}



module.exports = {
    reset,
    listDocs,
    create,
    update,
    open,
    getDSN,
    getRefreshTokens,
    addRefreshToken,
    delRefreshToken,
    findRefreshToken,
    getUsers,
    createUser,
    findUser
}
