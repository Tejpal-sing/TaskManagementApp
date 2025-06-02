import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { retrieveService } from "../services/retrieveService";

const prisma = new PrismaClient();

export const retrieveController = async (req: AuthRequest, res: Response) => {
    try {
        const todo = await retrieveService(req);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        console.log(todo);
        res.status(200).json(todo);
    } catch (err) {
        console.error('Error retrieving todo:', err);
        res.status(500).json({ error: 'Failed to retrieve todo' });
    }
};