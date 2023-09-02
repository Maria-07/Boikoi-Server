"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shop = void 0;
const mongoose_1 = require("mongoose");
const shop_constant_1 = require("./shop.constant");
const ShopSchema = new mongoose_1.Schema({
    shop_name: { type: String, required: true },
    shop_number: { type: String, required: true },
    contact_number: { type: String, required: true },
    image: { type: String },
    location: { type: String, enum: shop_constant_1.locations, required: true },
    address: {
        type: {
            street: { type: String },
            area: { type: String },
            city: { type: String },
        },
        required: true,
    },
    shop_weekend: { type: String },
    shop_open_time: { type: String },
    shop_close_time: { type: String },
    book_shop_ratings: { type: String },
    userEmail: {
        type: String,
    },
    bookShopOwner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Shop = (0, mongoose_1.model)('Shop', ShopSchema);
