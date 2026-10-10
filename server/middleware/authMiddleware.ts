import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbStore } from '../storage/dbStore';
import { UserModel } from '../models/User';
import { isConnected } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'travelmate_super_secret_jwt_key_2026';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: 'user' | 'admin' };

    let userFound: AuthenticatedUser | null = null;

    if (isConnected()) {
      try {
        const u = await UserModel.findById(decoded.id);
        if (u) {
          userFound = {
            id: u._id.toString(),
            name: u.name,
            email: u.email,
            role: u.role,
          };
        }
      } catch {
        // Fallback to store if query fails
      }
    }

    if (!userFound) {
      const u = dbStore.findUserById(decoded.id);
      if (u) {
        userFound = {
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
        };
      }
    }

    if (!userFound) {
      res.status(401).json({ success: false, message: 'Invalid token: User no longer exists.' });
      return;
    }

    req.user = userFound;
    next();
  } catch {
    res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
}
