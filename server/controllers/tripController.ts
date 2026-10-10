import { Request, Response } from 'express';
import { dbStore, StoredTrip } from '../storage/dbStore';
import { TripModel } from '../models/Trip';
import { isConnected } from '../config/db';

export async function getTrips(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { status, search, sort } = req.query;

    let trips: StoredTrip[] = [];

    if (isConnected()) {
      try {
        const query: Record<string, unknown> = { userId };
        if (status && status !== 'all') {
          query.status = status;
        }
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { destination: { $regex: search, $options: 'i' } },
            { origin: { $regex: search, $options: 'i' } },
          ];
        }

        const sortOption: Record<string, 1 | -1> =
          sort === 'budget-desc' ? { budget: -1 } :
          sort === 'budget-asc' ? { budget: 1 } :
          sort === 'date-desc' ? { startDate: -1 } :
          { startDate: 1 };

        const mongoTrips = await TripModel.find(query).sort(sortOption);
        trips = mongoTrips.map((t) => ({
          _id: t._id.toString(),
          userId: t.userId.toString(),
          title: t.title,
          origin: t.origin,
          destination: t.destination,
          startDate: t.startDate,
          endDate: t.endDate,
          travellers: t.travellers,
          budget: t.budget,
          currency: t.currency,
          notes: t.notes || '',
          status: t.status,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
        }));
      } catch {
        trips = dbStore.getTripsByUser(userId);
      }
    } else {
      trips = dbStore.getTripsByUser(userId);
      if (status && status !== 'all') {
        trips = trips.filter((t) => t.status === status);
      }
      if (search) {
        const s = (search as string).toLowerCase();
        trips = trips.filter(
          (t) =>
            t.title.toLowerCase().includes(s) ||
            t.destination.toLowerCase().includes(s) ||
            t.origin.toLowerCase().includes(s)
        );
      }
      if (sort === 'budget-desc') {
        trips.sort((a, b) => b.budget - a.budget);
      } else if (sort === 'budget-asc') {
        trips.sort((a, b) => a.budget - b.budget);
      } else if (sort === 'date-desc') {
        trips.sort((a, b) => b.startDate.localeCompare(a.startDate));
      } else {
        trips.sort((a, b) => a.startDate.localeCompare(b.startDate));
      }
    }

    // Attach real financial totals to each trip
    const tripsWithSummary = trips.map((trip) => {
      const expenses = dbStore.getExpensesByTrip(trip._id);
      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
      const remainingBudget = trip.budget - totalExpenses;
      const budgetUsedPercentage = trip.budget > 0 ? +((totalExpenses / trip.budget) * 100).toFixed(1) : 0;
      const activities = dbStore.getActivitiesByTrip(trip._id);

      return {
        ...trip,
        totalExpenses,
        remainingBudget,
        budgetUsedPercentage,
        isOverBudget: totalExpenses > trip.budget,
        activityCount: activities.length,
        expenseCount: expenses.length,
      };
    });

    res.status(200).json({ success: true, count: tripsWithSummary.length, data: tripsWithSummary });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch trips.', error: (error as Error).message });
  }
}

export async function getTripById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    let trip: StoredTrip | undefined;

    if (isConnected()) {
      try {
        const t = await TripModel.findById(id);
        if (t) {
          trip = {
            _id: t._id.toString(),
            userId: t.userId.toString(),
            title: t.title,
            origin: t.origin,
            destination: t.destination,
            startDate: t.startDate,
            endDate: t.endDate,
            travellers: t.travellers,
            budget: t.budget,
            currency: t.currency,
            notes: t.notes || '',
            status: t.status,
            createdAt: t.createdAt.toISOString(),
            updatedAt: t.updatedAt.toISOString(),
          };
        }
      } catch {
        trip = dbStore.getTripById(id);
      }
    } else {
      trip = dbStore.getTripById(id);
    }

    if (!trip) {
      res.status(404).json({ success: false, message: 'Trip not found.' });
      return;
    }

    // Enforce ownership: user must own trip or be admin
    if (trip.userId !== userId && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this trip.' });
      return;
    }

    const expenses = dbStore.getExpensesByTrip(trip._id);
    const activities = dbStore.getActivitiesByTrip(trip._id);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remainingBudget = trip.budget - totalExpenses;
    const budgetUsedPercentage = trip.budget > 0 ? +((totalExpenses / trip.budget) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      data: {
        ...trip,
        totalExpenses,
        remainingBudget,
        budgetUsedPercentage,
        isOverBudget: totalExpenses > trip.budget,
        activities,
        expenses,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch trip details.', error: (error as Error).message });
  }
}

export async function createTrip(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { title, origin, destination, startDate, endDate, travellers, budget, currency, notes, status } = req.body;

    if (!title || !origin || !destination || !startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Title, origin, destination, start date, and end date are required.',
      });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      res.status(400).json({ success: false, message: 'End date cannot be earlier than start date.' });
      return;
    }

    const tripData = {
      userId,
      title: title.trim(),
      origin: origin.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      travellers: Math.max(1, Number(travellers) || 1),
      budget: Math.max(0, Number(budget) || 0),
      currency: (currency || 'INR').toUpperCase(),
      notes: notes || '',
      status: status || 'planning',
    };

    let createdTrip: StoredTrip;

    if (isConnected()) {
      try {
        const mongoTrip = await TripModel.create(tripData);
        createdTrip = {
          _id: mongoTrip._id.toString(),
          userId: mongoTrip.userId.toString(),
          title: mongoTrip.title,
          origin: mongoTrip.origin,
          destination: mongoTrip.destination,
          startDate: mongoTrip.startDate,
          endDate: mongoTrip.endDate,
          travellers: mongoTrip.travellers,
          budget: mongoTrip.budget,
          currency: mongoTrip.currency,
          notes: mongoTrip.notes || '',
          status: mongoTrip.status,
          createdAt: mongoTrip.createdAt.toISOString(),
          updatedAt: mongoTrip.updatedAt.toISOString(),
        };
      } catch {
        createdTrip = dbStore.createTrip(tripData);
      }
    } else {
      createdTrip = dbStore.createTrip(tripData);
    }

    res.status(201).json({
      success: true,
      message: 'Trip created successfully.',
      data: createdTrip,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create trip.', error: (error as Error).message });
  }
}

export async function updateTrip(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existing = dbStore.getTripById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Trip not found.' });
      return;
    }

    if (existing.userId !== userId && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this trip.' });
      return;
    }

    const { title, origin, destination, startDate, endDate, travellers, budget, currency, notes, status } = req.body;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      res.status(400).json({ success: false, message: 'End date cannot be earlier than start date.' });
      return;
    }

    const updates: Partial<StoredTrip> = {};
    if (title !== undefined) updates.title = title.trim();
    if (origin !== undefined) updates.origin = origin.trim();
    if (destination !== undefined) updates.destination = destination.trim();
    if (startDate !== undefined) updates.startDate = startDate;
    if (endDate !== undefined) updates.endDate = endDate;
    if (travellers !== undefined) updates.travellers = Math.max(1, Number(travellers) || 1);
    if (budget !== undefined) updates.budget = Math.max(0, Number(budget) || 0);
    if (currency !== undefined) updates.currency = currency.toUpperCase();
    if (notes !== undefined) updates.notes = notes;
    if (status !== undefined) updates.status = status;

    if (isConnected()) {
      try {
        await TripModel.findByIdAndUpdate(id, updates);
      } catch {
        // Fallback store update handles it
      }
    }

    const updated = dbStore.updateTrip(id, updates);

    res.status(200).json({
      success: true,
      message: 'Trip updated successfully.',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update trip.', error: (error as Error).message });
  }
}

export async function deleteTrip(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existing = dbStore.getTripById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Trip not found.' });
      return;
    }

    if (existing.userId !== userId && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this trip.' });
      return;
    }

    if (isConnected()) {
      try {
        await TripModel.findByIdAndDelete(id);
      } catch {
        // Store delete handles persistence
      }
    }

    dbStore.deleteTrip(id);

    res.status(200).json({
      success: true,
      message: 'Trip and associated activities and expenses deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete trip.', error: (error as Error).message });
  }
}
