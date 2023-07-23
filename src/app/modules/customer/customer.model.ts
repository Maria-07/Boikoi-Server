import { Schema, model } from 'mongoose';
import { CustomerModel, ICustomer } from './customer.interface';

export const CustomerSchema = new Schema<ICustomer>(
  {
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        middleName: {
          type: String,
        },
      },
      required: true,
    },
    contact: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Customer = model<ICustomer, CustomerModel>(
  'customer',
  CustomerSchema
);
