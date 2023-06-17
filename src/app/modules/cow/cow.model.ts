import { Schema, model } from 'mongoose';
import { CowModel, ICow } from './cow.interface';
import { Breed, Category, Label, Location } from './cow.constance';

const CowSchema = new Schema<ICow>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    price: { type: Number, required: true },
    location: { type: String, enum: Location, required: true },
    breed: { type: String, enum: Breed, required: true },
    weight: { type: Number, required: true },
    label: { type: String, enum: Label, required: true },
    category: { type: String, enum: Category, required: true },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Cow = model<ICow, CowModel>('Cow', CowSchema);
