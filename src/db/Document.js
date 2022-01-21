const { Schema, model } = require("mongoose");

const DocumentSchema = new Schema({
    name: { type: String, required: true },
    data: String,
    users: [String],
    comments: [String],
    type: String,
    createdAt: { type: Date, default: Date.now },
});

// Sets the createdAt parameter equal to the current time
DocumentSchema.pre("save", (next) => {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = model("Document", DocumentSchema);
