import { Response } from 'express';
import { db } from '../server/db.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getNotifications = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  res.json(db.getNotifications(user.id));
};

export const markAsRead = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const n = db.markNotificationAsRead(req.params.id);
  if (!n) return res.status(404).json({ error: 'Notification not found' });
  res.json(n);
};

export const markAllAsRead = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  db.markAllNotificationsRead(user.id);
  res.json({ success: true });
};
