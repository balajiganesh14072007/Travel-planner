import { Request, Response } from 'express';
import { dbStore } from '../storage/dbStore';
import { isConnected } from '../config/db';
import { UserModel } from '../models/User';
import { TripModel } from '../models/Trip';

export async function getAdminOverview(req: Request, res: Response): Promise<void> {
  try {
    let totalUsers = 0;
    let totalTrips = 0;

    if (isConnected()) {
      try {
        totalUsers = await UserModel.countDocuments();
        totalTrips = await TripModel.countDocuments();
      } catch {
        totalUsers = dbStore.getAllUsers().length;
        totalTrips = dbStore.getAllTrips().length;
      }
    } else {
      totalUsers = dbStore.getAllUsers().length;
      totalTrips = dbStore.getAllTrips().length;
    }

    const allExpenses = dbStore.getAllExpenses();
    const totalExpensesAmount = allExpenses.reduce((sum, e) => sum + e.amount, 0);

    const allTrips = dbStore.getAllTrips();
    const totalBudgetSum = allTrips.reduce((sum, t) => sum + t.budget, 0);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalTrips,
        totalExpensesCount: allExpenses.length,
        totalExpensesAmount,
        totalBudgetSum,
        databaseMode: isConnected() ? 'MongoDB Atlas (Connected)' : 'Persistent MERN Storage Adapter (Active)',
        uptime: process.uptime(),
        serverTimestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Admin overview failed.', error: (error as Error).message });
  }
}

export async function getAdminUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = dbStore.getAllUsers().map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }));

    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin users.', error: (error as Error).message });
  }
}

export async function getAdminTrips(req: Request, res: Response): Promise<void> {
  try {
    const trips = dbStore.getAllTrips();
    res.status(200).json({ success: true, count: trips.length, data: trips });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin trips.', error: (error as Error).message });
  }
}
