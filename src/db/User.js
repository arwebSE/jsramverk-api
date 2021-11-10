const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
})

UserSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = model("User", UserSchema)
