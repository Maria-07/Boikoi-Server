"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    cow: { type: mongoose_1.Types.ObjectId, ref: 'Cow', required: true },
    buyer: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true },
});
exports.Order = (0, mongoose_1.model)('Order', OrderSchema);
