const { Schema, model } = require("mongoose");

const RefreshToken = new Schema({
    token: {type: String, unique: true, required: true }
})

module.exports = model("RefreshToken", RefreshToken)
