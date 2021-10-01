require('dotenv').config()

const { MongoClient } = require('mongodb')
const DB_HOST = process.env.DB_HOST
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const dsn = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
if (process.env.NODE_ENV == "test") { dsn = "mongodb://localhost:27017/test" }
const client = new MongoClient(dsn, { useNewUrlParser: true, useUnifiedTopology: true })
const COLLECTION = "docs";

const fs = require("fs")
const path = require("path")
const data = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "setup.json"), "utf8"
))

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

async function list() {
    try {
        await client.connect()
        const cursor = client.db().collection(COLLECTION).find({})
        const allValues = await cursor.toArray()
        return allValues
    } catch (err) {
        console.log(err)
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close()
    }
}

async function create(doc) {
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
}

async function update(filter, content, options) {
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
}

module.exports = { reset, list, create, update }
