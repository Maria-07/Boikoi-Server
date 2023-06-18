"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const user_constance_1 = require("./user.constance");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({ required_error: 'Phone is required' }),
        role: zod_1.z.enum([...user_constance_1.role], {
            required_error: 'Role is required',
        }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
        name: zod_1.z.object({
            firstName: zod_1.z.string({ required_error: 'First name is required' }),
            lastName: zod_1.z.string({ required_error: 'First name is required' }),
        }),
        address: zod_1.z.string({ required_error: 'Address is required' }),
        budget: zod_1.z.number().optional(),
        income: zod_1.z.number().optional(),
    }),
});
exports.UserValidation = { createUserZodSchema };
