import {updateRepository } from '../repository/updateRepository';
import { AuthRequest } from '../middleware/auth';

export const updateService = async (req:AuthRequest) => {
    const todo = await updateRepository(req);
    return todo;
}