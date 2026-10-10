import mongoose, { Schema, Document, Types } from 'mongoose';

export type TripStatus = 'planning' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface ITrip extends Document {
  userId: Types.ObjectId | string;
  title: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travellers: number;
  budget: number;
  currency: string;
  notes?: string;
  status: TripStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const TripSchema = new Schema<ITrip>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    origin: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    travellers: { type: Number, required: true, default: 1, min: 1 },
    budget: { type: Number, required: true, default: 0, min: 0 },
    currency: { type: String, default: 'INR', uppercase: true },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['planning', 'upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'planning',
      index: true,
    },
  },
  { timestamps: true }
);

export const TripModel = mongoose.models.Trip || mongoose.model<ITrip>('Trip', TripSchema);
