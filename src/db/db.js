require("dotenv").config()

//const { MongoClient } = require("mongodb")
const mongoose = require("mongoose")
const DB_HOST = process.env.DB_HOST
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
let DSN = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
const maskedDSN = `mongodb+srv://${DB_USER}:<PASSWD>@${DB_HOST}/${DB_NAME}`;
if (process.env.NODE_ENV == "test") { DSN = "mongodb://localhost:27017/test" }
//const client = new MongoClient(DSN, { useNewUrlParser: true, useUnifiedTopology: true })
const COLLECTION = "docs";

// Mongoose
mongoose.connect(`${DSN}`)
const Document = require("./Document")

/* 
// MongoDB
const fs = require("fs")
const path = require("path")
const data = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "setup.json"), "utf8"
)) 
*/

const chalk = require("chalk");

function getDSN() {
    return maskedDSN
}

/**
 * Reset a collection by removing existing content and insert a default
 * set of documents.
 */
async function reset() {
    try {
        await client.connect()
        const col = client.db().collection(COLLECTION)
        await col.deleteMany()
        await col.insertMany(data)
    } catch (e) {
        console.log("DB reset error:", e)
    } finally {
        await client.close()
    }
}

/* async function list() {
    try {
        await client.connect()
        const cursor = client.db().collection(COLLECTION).find({})
        const allValues = await cursor.toArray()
        return allValues
    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }
} */

async function listDocs() {
    console.log("listing docs");
    return await Document.find();
}

async function create(docid, name=null) {
    if (docid == null) return
    const document = await Document.findById(docid)
    if (document) return document
    console.log("Creating new doc with ID:", docid, "and name:", name)
    return await Document.create({ _id: docid, name, data: "" }) // Create empty document
}

async function update(docid, data) {
    return await Document.findByIdAndUpdate(docid, { data })
}

/* async function create(doc) {
    try {
        await client.connect()
        const col = client.db().collection(COLLECTION)
        const result = await col.insertOne(doc)
        if (result.acknowledged) {
            console.log("Created doc ID:", result.insertedId)
            return true
        }
        return
    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }
} */

/* async function update(filter, content, options) {
    try {
        await client.connect()
        const col = client.db().collection(COLLECTION)
        const result = await col.updateOne(filter, content, options)
        console.log(`${result.matchedCount} matched, updated ${result.modifiedCount} doc(s).`)
        if (result.acknowledged) {
            console.log("Updated doc:", filter.name)
            return true
        }
        return
    } catch (err) {
        console.log(err)
        res.json(err)
    } finally {
        await client.close()
    }
} */

module.exports = { reset, listDocs, create, update, getDSN }
