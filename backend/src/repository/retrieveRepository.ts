import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';


export const retrieveRepository=async (req:AuthRequest)=> {
    const { id } = req.params;
    const userId2=req.user!.id;
    console.log('Received ID:', id); 

    const todoId = Number(id);
    const todo=await prisma.todos.findMany({
        where: {
            id: todoId,
            userId:userId2
        }
    });
    return todo;
};
