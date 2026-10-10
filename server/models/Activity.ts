import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IActivity extends Document {
  tripId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  estimatedCost: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ActivitySchema = new Schema<IActivity>(
  {
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    location: { type: String, default: '' },
    description: { type: String, default: '' },
    estimatedCost: { type: Number, default: 0, min: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const ActivityModel = mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);
