import { Schema, model } from 'mongoose';
import { CowModel, ICow } from './cow.interface';
import { Location } from './cow.constance';

const CowSchema: Schema<ICow> = new Schema<ICow>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  price: { type: Number, required: true },
  location: { type: String, enum: Location, required: true },
  password: { type: String, required: true },
  name: {
    required: true,
    type: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
  },
  address: { type: String, required: true },
  budget: { type: Number, required: true },
  income: { type: Number, required: true },
  //   student: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'User',
  //   },
});

export const Cow = model<ICow, CowModel>('Cow', CowSchema);
