import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const retrieveController = async (req: Request, res: Response) => {
    const { id } = req.params;

    console.log('Received ID:', id); 
    if (!id || isNaN(Number(id[1]))) {
        console.error('Invalid ID format:', id);
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    const todoId = Number(id[1]);

    try {
        const todo = await prisma.todos.findUnique({
            where: {
                id: todoId
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