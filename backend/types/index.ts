import { Request } from 'express';
import { User } from '../server/db.js';

export interface AuthenticatedRequest extends Request {
  user?: User;
}
