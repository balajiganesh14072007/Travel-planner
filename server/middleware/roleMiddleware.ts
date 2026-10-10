import { Request, Response, NextFunction } from 'express';

export function requireRole(role: 'admin' | 'user') {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    if (req.user.role !== role && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: `Forbidden. Requires ${role} privileges.`,
      });
      return;
    }

    next();
  };
}
