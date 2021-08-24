import mongoose, { Model, Schema, Document } from 'mongoose';
import { JobObjects } from './jobModel';
import { PayPeriodObjects } from './payperiodModel';
import { RepairOrderObjects } from './repairOrderModel';

const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,
  dateCreated: { type: Date, default: Date.now },
  isAdmin: Boolean,
  payPeriods: [
    {
      type: ObjectId,
      ref: 'pay-periods',
    },
  ],
});

export type UserData = {
  user: UserDoc;
  payPeriods: PayPeriodObjects;
  repairOrders: RepairOrderObjects;
  jobs: JobObjects;
};

export interface UserDoc extends Document {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  dateCreated: Date;
  isAdmin: boolean;
  payPeriods: [typeof ObjectId];
}

export type UserModel = Model<UserDoc>;

export function createUserModel(db: typeof mongoose): UserModel {
  return db.model<UserDoc>('users', userSchema);
}
