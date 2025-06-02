import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';


export const deleteRepository=async (req:AuthRequest)=> {
    const todoId=Number(req.params.id);

    await prisma.todos.delete({
        where:{
            id:todoId
        }
    });

};


