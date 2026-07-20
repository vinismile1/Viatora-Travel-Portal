import { Response, NextFunction } from 'express';
import { db } from '../server/db.js';
import { AuthenticatedRequest } from '../types/index.js';

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const parts = token.split('_');
    if (parts[0] !== 'token' || parts.length < 3) {
      return res.status(403).json({ error: 'Invalid token structure.' });
    }
    const email = Buffer.from(parts[1], 'base64').toString('ascii');
    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(403).json({ error: 'User not found.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token validation failed.' });
  }
}
