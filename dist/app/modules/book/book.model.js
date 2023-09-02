"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const book_constance_1 = require("./book.constance");
const BookSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    image: { type: String },
    author_name: { type: String },
    publisher_name: { type: String },
    genre: { type: String, enum: book_constance_1.bookGenres },
    class_level: { type: String },
    faculty_name: { type: String },
    quantity: { type: Number },
    description: { type: String },
    price: { type: Number, required: true },
    is_sale: { type: Boolean, default: false },
    Last_edition: { type: String },
    shop: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
    },
    userEmail: {
        type: String,
    },
    reviews: [
        {
            name: { type: String },
            review: { type: String },
            date: { type: Date },
            rating: { type: Number },
        },
    ],
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Book = (0, mongoose_1.model)('Book', BookSchema);
