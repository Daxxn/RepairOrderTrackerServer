import mongoose, { Model, Schema, Document } from 'mongoose';
import { JobObjects } from './jobModel';

const ObjectId = mongoose.Types.ObjectId;

const techSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: 'users',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  techNumber: {
    type: Number,
    required: true,
  },
});

export type AllTechs = {
  data: TechDoc;
  activeJobs: JobObjects;
};

export type TechObjects = {
  [id: string]: TechDoc;
};

export interface TechDoc extends Document {
  userId: typeof ObjectId;
  name: string;
  techNumber: string;
}

export type TechModel = Model<TechDoc>;

export function createTechModel(db: typeof mongoose): TechModel {
  return db.model<TechDoc>('techs', techSchema);
}
