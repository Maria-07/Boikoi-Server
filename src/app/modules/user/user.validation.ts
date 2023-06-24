import { z } from 'zod';
import { role } from './user.constance';

const createUserZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({ required_error: 'Phone is required' }),
    role: z.enum([...role] as [string, ...string[]], {
      required_error: 'Role is required',
    }),
    password: z.string({ required_error: 'Password is required' }).optional(),
    name: z.object({
      firstName: z.string({ required_error: 'First name is required' }),
      lastName: z.string({ required_error: 'First name is required' }),
    }),
    address: z.string({ required_error: 'Address is required' }),
    budget: z.number().optional(),
    income: z.number().optional(),
  }),
});

export const UserValidation = { createUserZodSchema };
