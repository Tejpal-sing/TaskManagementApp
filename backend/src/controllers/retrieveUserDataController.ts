import { Request, Response } from 'express';
import { retrieveUserDataService } from '../services/retrieveUserDataService';
import { AuthRequest } from '../middleware/auth';

export const retrieveUserDataController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const todos = await retrieveUserDataService(userId);
    return res.json(todos);
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
