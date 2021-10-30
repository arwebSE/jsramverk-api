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
const Document = require("./Document")

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
    Document.remove({}, function(err) {
        if (err) {
            console.log("error resetting db:", err);
            return;
        } else {
            console.log('db reset')
            return true;
        }
    });
}

/**
 * List all existing documents
 */
async function listDocs() {
    console.log("listing docs");
    return await Document.find();
}

/**
 * Create new document or if it exists, return it
 */
async function create(docid, name = "", data={}) {
    if (docid == null) return
    const document = await Document.findById(docid)
    if (document) return document // return existing doc
    console.log("Creating new doc with ID:", docid, "and name:", name)
    return await Document.create({ _id: docid, name, data }) // Create empty doc
}

/**
 * Update existing document
 */
async function update(docid, data) {
    console.log("in db updating", data);
    return await Document.findByIdAndUpdate(docid, { data })
}

module.exports = { reset, listDocs, create, update, getDSN }
