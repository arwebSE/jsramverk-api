const { Schema, model } = require("mongoose");

const DocumentSchema = new Schema({
    name: { type: String, required: true },
    data: Object,
    users: { type: Array }
})

module.exports = model("Document", DocumentSchema)
