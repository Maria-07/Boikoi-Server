import { Schema, Types, model } from 'mongoose';
import { IOrder, OrderModel } from './order.interface';

const OrderSchema: Schema<IOrder> = new Schema<IOrder>({
  cow: { type: Types.ObjectId, ref: 'Cow', required: true },
  buyer: { type: Types.ObjectId, ref: 'User', required: true },
});

export const Order = model<IOrder, OrderModel>('Order', OrderSchema);
