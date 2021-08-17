import mongoose, { Model, Schema, Document} from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

const payPeriodSchema = new Schema({
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: Date.now
  },
  repairOrders: [
    {
      type: ObjectId,
      ref: 'RepairOrder'
    }
  ]
});

export type PayPeriodObjects = {
  [id: string]: PayPeriodDoc;
};

export type AllPayPeriods = {
  payPeriods: PayPeriodDoc;
};

export interface PayPeriodDoc extends Document {
  startDate: Date,
  endDate: Date,
  repairOrders: [typeof ObjectId]
}

export type PayPeriodModel = Model<PayPeriodDoc>;

/**
 * Creates a `PayPeriod` model from a given connected mongoose MongoDB database.
 * @param {mongoose} db The mongoDB connection
 * @returns {PayPeriodModel} the UserModel class
 */
export function createPayPeriodModel(db: typeof mongoose): PayPeriodModel {
  return db.model<PayPeriodDoc>('PayPeriod', payPeriodSchema);
}