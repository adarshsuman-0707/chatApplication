const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    online: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);