import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';


export const updateRepository=async (req:AuthRequest)=> {
    const todoId = parseInt(req.params.id);
    console.log(todoId);
    const { title, body } = req.body;
    const userId = req.user!.id;

    const existingTodo = await prisma.todos.findFirst({
        where: {
            id: todoId,
            userId: userId
        }
    });

    const updatedTodo = await prisma.todos.update({
        where: {
            id: todoId
        },
        data: {
            title,
            body
        }
    });

    return {existingTodo,updatedTodo};
};
