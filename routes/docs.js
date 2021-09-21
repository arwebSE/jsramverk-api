const express = require('express');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
require('dotenv').config()

const { MongoClient } = require('mongodb')
const DB_HOST = process.env.DB_HOST
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const dsn = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
if (process.env.NODE_ENV == "test") {
    dsn = "mongodb://localhost:27017/test";
}
const client = new MongoClient(dsn, { useNewUrlParser: true, useUnifiedTopology: true });
const COLLECTION = "docs"

const fs = require("fs");
const path = require("path");
const data = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "../db/setup.json"),
    "utf8"
));

/**
 * Reset a collection by removing existing content and insert a default
 * set of documents.
 */
async function resetDB(data) {
    try {
        await client.connect();
        const col = client.db().collection(COLLECTION);
        await col.deleteMany();
        await col.insertMany(data);
    } finally {
        await client.close();
    }
}

/* ROUTES */

router.get('/reset', (req, res) => {
    resetDB(data)
        .catch(err => console.log("DB reset error:", err));
    res.json("Reset DB!");
});

// Return a JSON object with list of all documents within the collection.
router.get("/list", async(req, res) => {
    try {
        await client.connect();
        const cursor = client.db().collection(COLLECTION).find({});
        const allValues = await cursor.toArray();
        console.log("Listed all docs.");
        res.status(200).json(allValues);
    } catch (err) {
        console.log(err);
        res.json(err);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});

router.post('/create', async(req, res) => {
    const doc = {
        name: req.body.name,
        content: req.body.content
    }
    try {
        await client.connect();
        const col = client.db().collection(COLLECTION);
        const result = await col.insertOne(doc);
        if (result.acknowledged) {
            return res.status(201).json(`Created doc with ID: ${result.insertedId}`);
        }
    } catch (err) {
        console.log(err);
        res.json(err);
    } finally {
        await client.close();
    }
});

router.post('/update', async(req, res) => {
    const content = { $set: { content: req.body.content } }
    const filter = { name: req.body.name };
    const options = { upsert: true };
    try {
        await client.connect();
        const col = client.db().collection(COLLECTION);
        const result = await col.updateOne(filter, content, options);
        console.log(
            `${result.matchedCount} doc(s) matched, updated ${result.modifiedCount} doc(s).`,
        );
        if (result.acknowledged) {
            return res.status(204).json(`Updated doc ${req.body.name}.`);
        }
    } catch (err) {
        console.log(err);
        res.json(err);
    } finally {
        await client.close();
    }
});

module.exports = router;
