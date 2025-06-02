import { retrieveRepository } from '../repository/retrieveRepository';
import { AuthRequest } from '../middleware/auth';

export const retrieveService = async (req:AuthRequest) => {
    const todo = await retrieveRepository(req);
    return todo;
}

