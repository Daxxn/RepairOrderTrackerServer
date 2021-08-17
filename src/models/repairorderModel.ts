import mongoose, { Model, Schema, Document} from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

const repairOrderSchema = new Schema({
  roNumber: Number,
  date: Date,
  isCompleted: Boolean,
  jobs: [
    {
      type: ObjectId,
      ref: 'Job'
    }
  ]
});

export type AllRepairOrders = {
  data: RepairOrderDoc;
};

export type RepairOrderObjects = {
  [id: string]: RepairOrderDoc;
}

export interface RepairOrderDoc extends Document {
  roNumber: number;
  date: Date;
  isCompleted: boolean;
  jobs: [typeof ObjectId];
}

export type RepairOrderModel = Model<RepairOrderDoc>;

export function createRepairOrderModel(db: typeof mongoose): RepairOrderModel {
  return db.model<RepairOrderDoc>('RepairOrder', repairOrderSchema);
}