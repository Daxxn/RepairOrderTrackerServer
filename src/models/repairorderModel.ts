import mongoose, { Model, Schema, Document } from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

const repairOrderSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: 'users',
    required: true,
  },
  roNumber: Number,
  flagId: Number,
  date: Date,
  isCompleted: Boolean,
  jobs: [
    {
      type: ObjectId,
      ref: 'jobs',
    },
  ],
});

export type AllRepairOrders = {
  data: RepairOrderDoc;
};

export type RepairOrderObjects = {
  [id: string]: RepairOrderDoc;
};

export interface RepairOrderDoc extends Document {
  userId: typeof ObjectId;
  roNumber: number;
  flagId: number;
  date: Date;
  isCompleted: boolean;
  jobs: [typeof ObjectId];
}

export type RepairOrderModel = Model<RepairOrderDoc>;

export function createRepairOrderModel(
  db: typeof mongoose
): RepairOrderModel {
  return db.model<RepairOrderDoc>('repair-orders', repairOrderSchema);
}
