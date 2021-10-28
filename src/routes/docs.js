const { decodeBase64 } = require('bcryptjs');
const express = require('express');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const db = require('../db/db.js');

/* ROUTES */
router.get('/reset', async(req, res) => {
    await db.reset()
    res.json("Reset DB!")
})

// List all docs
router.get("/list", async(req, res) => {
    let result = await db.list()
    res.status(200).json(result)
})

// Create doc
router.post('/create', async(req, res) => {
    const doc = {
        name: req.body.name,
        content: req.body.content
    }
    let result = await db.create(doc)
    if (result) {
        res.status(201).json("Created doc successfully!")
    }
})

// Update doc
router.post('/update', async(req, res) => {
    const filter = { name: req.body.name }
    const content = { $set: { content: req.body.content } }
    const options = { upsert: true }
    let result = await db.update(filter, content, options)
    if (result) {
        res.status(201).json("Updated doc successfully!")
    }
})


module.exports = router;
