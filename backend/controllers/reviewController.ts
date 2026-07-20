import { Response } from 'express';
import { db, Review } from '../server/db.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getReviews = (req: AuthenticatedRequest, res: Response) => {
  res.json(db.getReviews(req.params.placeId));
};

export const createReview = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { placeId, type, rating, comment } = req.body;

  if (!placeId || !type || rating === undefined || !comment) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const review: Review = {
    id: `rev_${Date.now()}`,
    userId: user.id,
    userName: user.name,
    placeId,
    type,
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString()
  };

  db.addReview(review);
  res.status(201).json(review);
};
