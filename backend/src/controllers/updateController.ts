// backend/src/controllers/updateController.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const updateControllers = async (req: AuthRequest, res: Response) => {
    try {
        const todoId = parseInt(req.params.id);
        console.log(todoId);
        const { title, body } = req.body;
        const userId = req.user!.id;

        console.log(userId);
        console.log(todoId);
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        // First check if todo exists and belongs to the user
        const existingTodo = await prisma.todos.findFirst({
            where: {
                id: todoId,
                userId: userId
            }
        });

        if (!existingTodo) {
            return res.status(404).json({ error: "Todo not found or you don't have permission to update it" });
        }

        // If todo exists and belongs to user, update it
        const updatedTodo = await prisma.todos.update({
            where: {
                id: todoId
            },
            data: {
                title,
                body
            }
        });

        res.json(updatedTodo);
    } catch (err) {
        console.error("Error updating todo:", err);
        res.status(500).json({ error: "Failed to update todo" });
    }
};

