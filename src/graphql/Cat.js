const { Schema, model } = require("mongoose");

const CatSchema = new Schema({
    name: String
})

module.exports = model("Cat", CatSchema)
