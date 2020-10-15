import { model, Schema, Document } from 'mongoose';

export interface Metric extends Document {
  repository_id: string;
  issues_open: number;
  average: number;
  deviation: number;
}

export default model<Metric>(
  'Metric',
  new Schema(
    {
      repositories: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      issues_open: {
        type: Number,
        required: true,
        default: 0,
      },
      average: {
        type: Number,
        required: true,
        default: 0,
      },
      deviation: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    { timestamps: true },
  ),
);
