const { Schema, model } = require("mongoose");

const RefreshTokenSchema = new Schema({
    token: {type: String, unique: true, required: true }
})

module.exports = model("RefreshToken", RefreshTokenSchema)
