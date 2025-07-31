import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { StaffAccount } from '../models/StaffAccount';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    const staffAccount = await StaffAccount.findById(decoded.id);
    if (!staffAccount || staffAccount.status !== 'active') {
      return res.status(401).json({ error: 'Invalid or inactive account' });
    }

    req.user = {
      id: (staffAccount._id as any).toString(),
      email: staffAccount.email,
      role: staffAccount.role
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export const editorMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !['admin', 'editor'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Editor access required' });
  }
  next();
};
