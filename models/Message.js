const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({

    sender: {
        type: String,
        required: true
    },

    room: {
        type: String,
        required: true
    },

    message: {
        type: String,
        default: ""
    },

    file: {
        url: { type: String },
        name: { type: String },
        type: { type: String },
        size: { type: Number }
    },

    status: {
        type: String,
        enum: ["sent", "delivered", "seen"],
        default: "sent"
    },

    edited: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);