import mongoose, { Schema, Document, Types } from 'mongoose';

export type ExpenseCategory =
  | 'Transportation'
  | 'Accommodation'
  | 'Food'
  | 'Tourist attractions'
  | 'Shopping'
  | 'Other';

export interface IExpense extends Document {
  tripId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  date: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ExpenseSchema = new Schema<IExpense>(
  {
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ['Transportation', 'Accommodation', 'Food', 'Tourist attractions', 'Shopping', 'Other'],
      default: 'Other',
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR', uppercase: true },
    date: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export const ExpenseModel = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
