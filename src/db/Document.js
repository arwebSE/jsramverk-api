const { Schema, model } = require("mongoose");

const DocumentSchema = new Schema({
    name: { type: String, required: true },
    data: String,
    users: [String],
    comments: [String]
})

module.exports = model("Document", DocumentSchema)
