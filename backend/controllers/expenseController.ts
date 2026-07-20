import { Response } from 'express';
import { db, Expense } from '../server/db.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getExpenses = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const tripId = req.query.tripId as string;
  if (tripId) {
    res.json(db.getTripExpenses(tripId));
  } else {
    res.json(db.getExpenses(user.id));
  }
};

export const createExpense = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { tripId, category, title, amount, date } = req.body;

  if (!tripId || !category || !title || amount === undefined || !date) {
    return res.status(400).json({ error: 'All expense fields are required.' });
  }

  const newExpense: Expense = {
    id: `exp_${Date.now()}`,
    userId: user.id,
    tripId,
    category,
    title,
    amount: Number(amount),
    date
  };

  db.addExpense(newExpense);
  res.status(201).json(newExpense);
};

export const deleteExpense = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  db.deleteExpense(req.params.id);
  res.json({ success: true, message: 'Expense deleted.' });
};
