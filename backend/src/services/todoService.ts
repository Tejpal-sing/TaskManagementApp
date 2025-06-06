import { AuthRequest } from '../middleware/auth';
import {createRepository,deleteRepository,retrieveRepository, retrieveUserDataRepository,updateRepository} from "../repository/todoRepository";

export const createService = async (req:AuthRequest) => {
    const todo = await createRepository(req);
    return todo;
}

export const deleteService = async (req:AuthRequest) => {
    const todo = await deleteRepository(req);
    return todo;
}

export const retrieveService = async (req:AuthRequest) => {
    const todo = await retrieveRepository(req);
    return todo;
}

export const retrieveUserDataService = async (userId: number) => {
    return await retrieveUserDataRepository(userId);
  };
  
export const updateService = async (req:AuthRequest) => {
    const todo = await updateRepository(req);
    return todo;
}

