import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();

export const retrieveController = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId2=req.user!.id;
    console.log('Received ID:', id); 

    const todoId = Number(id);

    try {
        const todo = await prisma.todos.findUnique({
            where: {
                id: todoId,
                userId:userId2
            }
        });

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.status(200).json(todo);
    } catch (err) {
        console.error('Error retrieving todo:', err);
        res.status(500).json({ error: 'Failed to retrieve todo' });
    }
};