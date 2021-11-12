const { Schema, model } = require("mongoose");

const DocumentSchema = new Schema({
    name: { type: String, required: true },
    data: Object,
    users: [String]
})

module.exports = model("Document", DocumentSchema)
