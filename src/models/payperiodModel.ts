import mongoose, { Model, Schema, Document, ObjectId } from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

const payPeriodSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: 'users',
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: Date.now,
  },
  repairOrders: [
    {
      type: ObjectId,
      ref: 'repair-orders',
    },
  ],
});

export type PayPeriodObjects = {
  [id: string]: PayPeriodDoc;
};

export type AllPayPeriods = {
  payPeriods: PayPeriodDoc;
};

export interface PayPeriodDoc extends Document {
  userId: typeof ObjectId;
  startDate: Date;
  endDate: Date;
  repairOrders: [typeof ObjectId];
}

export type PayPeriodModel = Model<PayPeriodDoc>;

/**
 * Creates a `PayPeriod` model from a given connected mongoose MongoDB database.
 * @param {mongoose} db The mongoDB connection
 * @returns {PayPeriodModel} the UserModel class
 */
export function createPayPeriodModel(db: typeof mongoose): PayPeriodModel {
  return db.model<PayPeriodDoc>('pay-periods', payPeriodSchema);
}
