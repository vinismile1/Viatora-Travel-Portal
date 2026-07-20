import { Response } from 'express';
import { db, User } from '../server/db.js';
import { AuthenticatedRequest } from '../types/index.js';
import { hashPassword } from '../utils/crypto.js';

export const register = (req: AuthenticatedRequest, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  const existingUser = db.getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered.' });
  }

  const passwordHash = hashPassword(password);
  const newUser: User = {
    id: `usr_${Date.now()}`,
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  db.addUser(newUser);

  // Generate session token
  const emailBase64 = Buffer.from(email).toString('base64');
  const token = `token_${emailBase64}_${Date.now()}`;

  // Create welcome notification
  db.addNotification(
    newUser.id,
    'Welcome to Viatora!',
    `Hello ${name}, welcome to Viatora! Try searching for destinations or chatting with our AI to plan your next trip!`,
    'update'
  );

  res.status(201).json({
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
    token
  });
};

export const login = (req: AuthenticatedRequest, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password.' });
  }

  const passwordHash = hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    return res.status(400).json({ error: 'Invalid email or password.' });
  }

  const emailBase64 = Buffer.from(email).toString('base64');
  const token = `token_${emailBase64}_${Date.now()}`;

  res.json({
    user: { id: user.id, name: user.name, email: user.email },
    token
  });
};

export const getMe = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
};

export const getPreferences = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const preferences = db.getPreferences(user.id);
  res.json(preferences);
};

export const updatePreferences = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const updated = db.updatePreferences(user.id, req.body);
  res.json(updated);
};
