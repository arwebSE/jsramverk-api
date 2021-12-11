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
const RefreshToken = require("./RefreshToken");
const User = require("./User");

/**
 * Return DSN without password
 */
function getDSN() {
    return maskedDSN
}

/**
 * Connect to mongoDB
 */
async function connect() {
    console.log("=> Connecting to mongoDB");
    return await mongoose.connect(`${DSN}`);
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
    try {
        return await RefreshToken.deleteOne({ token })
    } catch (err) {
        console.log("=> Error deleting rftoken:", err);
        return false;
    }
}

/**
 * Find RefreshToken, return true or false
 */
async function findRefreshToken(token) {
    console.log("=> DB: Looking for rftoken:", token)
    try {
        return await RefreshToken.findOne({ token })
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
    connect,
    getDSN,
    getRefreshTokens,
    addRefreshToken,
    delRefreshToken,
    findRefreshToken,
    getUsers,
    createUser,
    findUser
}
