"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OldBook = void 0;
const mongoose_1 = require("mongoose");
const OldBookSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    image: { type: String },
    author_name: { type: String },
    publisher_name: { type: String },
    class_level: { type: String },
    faculty_name: { type: String },
    description: { type: String },
    price: { type: Number },
    Last_edition: { type: String },
    userEmail: {
        type: String,
    },
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.OldBook = (0, mongoose_1.model)('OldBook', OldBookSchema);
