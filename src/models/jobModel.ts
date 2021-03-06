import mongoose, { Model, Schema, Document } from 'mongoose';
import { TechObjects } from './techModel';

const ObjectId = mongoose.Types.ObjectId;

const jobSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: 'users',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  time: Number,
  isRecall: Boolean,
  assignedTech: ObjectId,
});

export type AllJobs = {
  jobs: JobDoc;
  tech: TechObjects;
};

export type JobObjects = {
  [id: string]: JobDoc;
};

export interface JobDoc extends Document {
  userId: typeof ObjectId;
  name: string;
  description: string;
  time: number;
  isRecall: boolean;
  assignedTech: typeof ObjectId;
}

export type JobModel = Model<JobDoc>;

export function createJobModel(db: typeof mongoose): JobModel {
  return db.model<JobDoc>('jobs', jobSchema);
}
