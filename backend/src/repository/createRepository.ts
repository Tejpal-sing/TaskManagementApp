import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';


export const createRepository=async (req:AuthRequest)=> {
        const {title,body}=req.body;
        const userId=req.user!.id;
        return await prisma.todos.create({
            data: {
                title,
                body,
                userId
            }
        });
};
