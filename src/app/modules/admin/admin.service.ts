import mongoose from 'mongoose';
import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';

const createAdmin = async (admin: IAdmin): Promise<IAdmin | null> => {
  let newAdminAllData = null;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const newAdmin = await Admin.create([admin], { session });

    if (!newAdmin.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    newAdminAllData = newAdmin[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return newAdminAllData;
};

export const AdminService = {
  createAdmin,
};
