import { Request, Response } from 'express';
import { dbStore, StoredExpense } from '../storage/dbStore';
import { ExpenseModel } from '../models/Expense';
import { isConnected } from '../config/db';

export async function getExpensesByTrip(req: Request, res: Response): Promise<void> {
  try {
    const { tripId } = req.params;
    const userId = req.user!.id;

    const trip = dbStore.getTripById(tripId);
    if (!trip) {
      res.status(404).json({ success: false, message: 'Trip not found.' });
      return;
    }

    if (trip.userId !== userId && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this trip.' });
      return;
    }

    let expenses: StoredExpense[] = [];

    if (isConnected()) {
      try {
        const mongoExp = await ExpenseModel.find({ tripId }).sort({ date: -1 });
        expenses = mongoExp.map((e) => ({
          _id: e._id.toString(),
          tripId: e.tripId.toString(),
          userId: e.userId.toString(),
          category: e.category,
          amount: e.amount,
          currency: e.currency,
          date: e.date,
          description: e.description,
          createdAt: e.createdAt.toISOString(),
          updatedAt: e.updatedAt.toISOString(),
        }));
      } catch {
        expenses = dbStore.getExpensesByTrip(tripId);
      }
    } else {
      expenses = dbStore.getExpensesByTrip(tripId);
    }

    // Formulas as specified in Problem Statement
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalBudget = trip.budget;
    const remainingBudget = totalBudget - totalExpenses;
    const budgetUsedPercentage = totalBudget > 0 ? +((totalExpenses / totalBudget) * 100).toFixed(1) : 0;
    const isOverBudget = totalExpenses > totalBudget;

    // Category breakdown
    const categoryTotals: Record<string, number> = {};
    for (const exp of expenses) {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    }

    res.status(200).json({
      success: true,
      data: expenses,
      summary: {
        totalBudget,
        totalExpenses,
        remainingBudget,
        budgetUsedPercentage,
        isOverBudget,
        currency: trip.currency,
        categoryTotals,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch expenses.', error: (error as Error).message });
  }
}

export async function createExpense(req: Request, res: Response): Promise<void> {
  try {
    const { tripId } = req.params;
    const userId = req.user!.id;
    const { category, amount, currency, date, description } = req.body;

    const trip = dbStore.getTripById(tripId);
    if (!trip) {
      res.status(404).json({ success: false, message: 'Trip not found.' });
      return;
    }

    if (trip.userId !== userId && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this trip.' });
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      res.status(400).json({ success: false, message: 'Amount must be a positive number.' });
      return;
    }

    if (!category || !date) {
      res.status(400).json({ success: false, message: 'Category and date are required.' });
      return;
    }

    const expenseData = {
      tripId,
      userId,
      category,
      amount: numAmount,
      currency: (currency || trip.currency || 'INR').toUpperCase(),
      date,
      description: description || '',
    };

    let created: StoredExpense;

    if (isConnected()) {
      try {
        const mongoExp = await ExpenseModel.create(expenseData);
        created = {
          _id: mongoExp._id.toString(),
          tripId: mongoExp.tripId.toString(),
          userId: mongoExp.userId.toString(),
          category: mongoExp.category,
          amount: mongoExp.amount,
          currency: mongoExp.currency,
          date: mongoExp.date,
          description: mongoExp.description,
          createdAt: mongoExp.createdAt.toISOString(),
          updatedAt: mongoExp.updatedAt.toISOString(),
        };
      } catch {
        created = dbStore.createExpense(expenseData);
      }
    } else {
      created = dbStore.createExpense(expenseData);
    }

    res.status(201).json({
      success: true,
      message: 'Expense recorded successfully.',
      data: created,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to record expense.', error: (error as Error).message });
  }
}

export async function updateExpense(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existing = dbStore.getExpenseById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Expense record not found.' });
      return;
    }

    if (existing.userId !== userId && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this expense.' });
      return;
    }

    const { category, amount, currency, date, description } = req.body;

    const updates: Partial<StoredExpense> = {};
    if (category !== undefined) updates.category = category;
    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        res.status(400).json({ success: false, message: 'Amount must be a positive number.' });
        return;
      }
      updates.amount = numAmount;
    }
    if (currency !== undefined) updates.currency = currency.toUpperCase();
    if (date !== undefined) updates.date = date;
    if (description !== undefined) updates.description = description;

    if (isConnected()) {
      try {
        await ExpenseModel.findByIdAndUpdate(id, updates);
      } catch {
        // Fallback store update handles it
      }
    }

    const updated = dbStore.updateExpense(id, updates);

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully.',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update expense.', error: (error as Error).message });
  }
}

export async function deleteExpense(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existing = dbStore.getExpenseById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Expense record not found.' });
      return;
    }

    if (existing.userId !== userId && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this expense.' });
      return;
    }

    if (isConnected()) {
      try {
        await ExpenseModel.findByIdAndDelete(id);
      } catch {
        // Store delete handles persistence
      }
    }

    dbStore.deleteExpense(id);

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete expense.', error: (error as Error).message });
  }
}

export async function getUserFinancialOverview(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const trips = dbStore.getTripsByUser(userId);

    let totalPlannedBudget = 0;
    let totalExpenses = 0;
    const categoryTotals: Record<string, number> = {
      'Transportation': 0,
      'Accommodation': 0,
      'Food': 0,
      'Tourist attractions': 0,
      'Shopping': 0,
      'Other': 0,
    };

    const tripComparisonData: {
      tripId: string;
      title: string;
      budget: number;
      spent: number;
      remaining: number;
    }[] = [];

    const allExpenses: (StoredExpense & { tripTitle: string })[] = [];

    for (const trip of trips) {
      totalPlannedBudget += trip.budget;
      const tripExp = dbStore.getExpensesByTrip(trip._id);
      const spentForTrip = tripExp.reduce((s, e) => s + e.amount, 0);
      totalExpenses += spentForTrip;

      tripComparisonData.push({
        tripId: trip._id,
        title: trip.title,
        budget: trip.budget,
        spent: spentForTrip,
        remaining: Math.max(0, trip.budget - spentForTrip),
      });

      for (const e of tripExp) {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
        allExpenses.push({ ...e, tripTitle: trip.title });
      }
    }

    const remainingBudget = totalPlannedBudget - totalExpenses;
    const budgetUsedPercentage = totalPlannedBudget > 0 ? +((totalExpenses / totalPlannedBudget) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      overview: {
        totalTrips: trips.length,
        totalPlannedBudget,
        totalExpenses,
        remainingBudget,
        budgetUsedPercentage,
        isOverBudget: totalExpenses > totalPlannedBudget,
        categoryTotals,
        tripComparisonData,
        recentExpenses: allExpenses.slice(0, 10),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch financial overview.', error: (error as Error).message });
  }
}
