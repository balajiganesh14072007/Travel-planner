import { Request, Response } from 'express';
import { dbStore, StoredActivity } from '../storage/dbStore';
import { ActivityModel } from '../models/Activity';
import { isConnected } from '../config/db';

export async function getActivitiesByTrip(req: Request, res: Response): Promise<void> {
  try {
    const { tripId } = req.params;
    const userId = req.user!.id;

    // Verify trip exists and user has access
    const trip = dbStore.getTripById(tripId);
    if (!trip) {
      res.status(404).json({ success: false, message: 'Trip not found.' });
      return;
    }

    if (trip.userId !== userId && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this trip.' });
      return;
    }

    let activities: StoredActivity[] = [];

    if (isConnected()) {
      try {
        const mongoActs = await ActivityModel.find({ tripId }).sort({ date: 1, startTime: 1 });
        activities = mongoActs.map((a) => ({
          _id: a._id.toString(),
          tripId: a.tripId.toString(),
          userId: a.userId.toString(),
          title: a.title,
          date: a.date,
          startTime: a.startTime || '',
          endTime: a.endTime || '',
          location: a.location || '',
          description: a.description || '',
          estimatedCost: a.estimatedCost,
          notes: a.notes || '',
          createdAt: a.createdAt.toISOString(),
          updatedAt: a.updatedAt.toISOString(),
        }));
      } catch {
        activities = dbStore.getActivitiesByTrip(tripId);
      }
    } else {
      activities = dbStore.getActivitiesByTrip(tripId);
    }

    res.status(200).json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch activities.', error: (error as Error).message });
  }
}

export async function createActivity(req: Request, res: Response): Promise<void> {
  try {
    const { tripId } = req.params;
    const userId = req.user!.id;
    const { title, date, startTime, endTime, location, description, estimatedCost, notes } = req.body;

    const trip = dbStore.getTripById(tripId);
    if (!trip) {
      res.status(404).json({ success: false, message: 'Trip not found.' });
      return;
    }

    if (trip.userId !== userId && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this trip.' });
      return;
    }

    if (!title || !date) {
      res.status(400).json({ success: false, message: 'Activity title and date are required.' });
      return;
    }

    const activityData = {
      tripId,
      userId,
      title: title.trim(),
      date,
      startTime: startTime || '',
      endTime: endTime || '',
      location: location || '',
      description: description || '',
      estimatedCost: Math.max(0, Number(estimatedCost) || 0),
      notes: notes || '',
    };

    let created: StoredActivity;

    if (isConnected()) {
      try {
        const mongoAct = await ActivityModel.create(activityData);
        created = {
          _id: mongoAct._id.toString(),
          tripId: mongoAct.tripId.toString(),
          userId: mongoAct.userId.toString(),
          title: mongoAct.title,
          date: mongoAct.date,
          startTime: mongoAct.startTime || '',
          endTime: mongoAct.endTime || '',
          location: mongoAct.location || '',
          description: mongoAct.description || '',
          estimatedCost: mongoAct.estimatedCost,
          notes: mongoAct.notes || '',
          createdAt: mongoAct.createdAt.toISOString(),
          updatedAt: mongoAct.updatedAt.toISOString(),
        };
      } catch {
        created = dbStore.createActivity(activityData);
      }
    } else {
      created = dbStore.createActivity(activityData);
    }

    res.status(201).json({
      success: true,
      message: 'Activity added to itinerary successfully.',
      data: created,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create activity.', error: (error as Error).message });
  }
}

export async function updateActivity(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existing = dbStore.getActivityById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Activity not found.' });
      return;
    }

    if (existing.userId !== userId && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this activity.' });
      return;
    }

    const { title, date, startTime, endTime, location, description, estimatedCost, notes } = req.body;

    const updates: Partial<StoredActivity> = {};
    if (title !== undefined) updates.title = title.trim();
    if (date !== undefined) updates.date = date;
    if (startTime !== undefined) updates.startTime = startTime;
    if (endTime !== undefined) updates.endTime = endTime;
    if (location !== undefined) updates.location = location;
    if (description !== undefined) updates.description = description;
    if (estimatedCost !== undefined) updates.estimatedCost = Math.max(0, Number(estimatedCost) || 0);
    if (notes !== undefined) updates.notes = notes;

    if (isConnected()) {
      try {
        await ActivityModel.findByIdAndUpdate(id, updates);
      } catch {
        // Fallback store update handles it
      }
    }

    const updated = dbStore.updateActivity(id, updates);

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully.',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update activity.', error: (error as Error).message });
  }
}

export async function deleteActivity(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existing = dbStore.getActivityById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Activity not found.' });
      return;
    }

    if (existing.userId !== userId && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this activity.' });
      return;
    }

    if (isConnected()) {
      try {
        await ActivityModel.findByIdAndDelete(id);
      } catch {
        // Fallback store handles it
      }
    }

    dbStore.deleteActivity(id);

    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete activity.', error: (error as Error).message });
  }
}
