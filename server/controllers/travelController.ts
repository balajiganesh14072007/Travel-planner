import { Request, Response } from 'express';
import { searchSmartRoute } from '../services/travelService';

export async function getSmartRoute(req: Request, res: Response): Promise<void> {
  try {
    const origin = (req.query.origin as string) || 'Hyderabad, Telangana';
    const destination = (req.query.destination as string) || 'Goa, India';
    const travellers = Math.max(1, Number(req.query.travellers) || 1);

    if (!origin || !destination) {
      res.status(400).json({ success: false, message: 'Both origin and destination are required.' });
      return;
    }

    const result = searchSmartRoute(origin, destination, travellers);

    res.status(200).json({
      success: true,
      data: result,
      meta: {
        note: 'Routes, distance, and travel time are calculated via road network geometry. Booking provider links connect to live ticketing portals.',
        isEstimated: true,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Route search failed.', error: (error as Error).message });
  }
}

export async function getPlaces(req: Request, res: Response): Promise<void> {
  try {
    const destination = (req.query.destination as string) || 'Goa';
    const result = searchSmartRoute('Current Location', destination, 1);

    res.status(200).json({
      success: true,
      destination: result.destination,
      attractions: result.attractions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch places.', error: (error as Error).message });
  }
}

export async function getTransportComparison(req: Request, res: Response): Promise<void> {
  try {
    const origin = (req.query.origin as string) || 'Hyderabad';
    const destination = (req.query.destination as string) || 'Goa';
    const travellers = Math.max(1, Number(req.query.travellers) || 1);

    const result = searchSmartRoute(origin, destination, travellers);

    res.status(200).json({
      success: true,
      origin: result.origin,
      destination: result.destination,
      distanceKm: result.distanceKm,
      options: result.transportOptions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch transport comparison.', error: (error as Error).message });
  }
}
