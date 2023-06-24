import * as z from 'zod';

const createAdminZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'Phone number is required',
    }),
    role: z.enum(['admin'] as [string, ...string[]], {
      required_error: 'Role is required',
    }),
    password: z.string(),
    name: z.object({
      firstName: z.string({
        required_error: 'First name is required',
      }),
      lastName: z.string({
        required_error: 'Last name is required',
      }),
    }),
    address: z.string(),
  }),
});

export const AdminValidation = {
  createAdminZodSchema,
};
