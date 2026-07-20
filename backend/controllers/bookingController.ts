import { Response } from 'express';
import { db, Booking } from '../server/db.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getBookings = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  res.json(db.getBookings(user.id));
};

export const createBooking = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { type, title, details, price, date, image } = req.body;

  if (!type || !title || !price || !date) {
    return res.status(400).json({ error: 'Missing booking parameters.' });
  }

  const newBooking: Booking = {
    id: `book_${Date.now()}`,
    userId: user.id,
    type,
    title,
    details: details || '',
    price: Number(price),
    date,
    status: 'confirmed',
    image
  };

  db.addBooking(newBooking);

  db.addNotification(
    user.id,
    'Booking Confirmed',
    `Your booking for ${title} (${type}) has been confirmed for ${date}! Total: $${price}.`,
    'update'
  );

  res.status(201).json(newBooking);
};

export const updateBookingStatus = (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });
  const booking = db.updateBookingStatus(req.params.id, status);
  if (!booking) return res.status(404).json({ error: 'Booking not found.' });
  res.json(booking);
};
