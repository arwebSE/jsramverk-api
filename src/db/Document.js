const { Schema, model } = require("mongoose");

const Document = new Schema({
    name: String,
    data: Object
})

module.exports = model("Document", Document)
