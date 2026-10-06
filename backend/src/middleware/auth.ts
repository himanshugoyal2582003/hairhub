import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request { user?: { id: string; email: string; role: string; name: string } }

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) { res.status(401).json({ error: 'Not authorized, no token' }); return; }
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) { res.status(401).json({ error: 'User no longer exists' }); return; }
    req.user = { id: user._id, email: user.email, role: user.role, name: user.name };
    next();
  } catch { res.status(401).json({ error: 'Token is invalid or expired' }); }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') { res.status(403).json({ error: 'Admin access only' }); return; }
  next();
};
