import { createRepository } from '../repository/createRepository';
import { AuthRequest } from '../middleware/auth';

export const createService = async (req:AuthRequest) => {
    const todo = await createRepository(req);
    return todo;
}




