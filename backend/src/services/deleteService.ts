import { deleteRepository } from '../repository/deleteRepository';
import { AuthRequest } from '../middleware/auth';

export const deleteService = async (req:AuthRequest) => {
    const todo = await deleteRepository(req);
    return todo;
}
