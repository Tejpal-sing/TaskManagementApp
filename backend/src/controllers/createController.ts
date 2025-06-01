import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';


const prisma = new PrismaClient();

export const createController = async (req:AuthRequest, res: Response) => {
  const { title, body } = req.body;
  const userId=req.user!.id;

  console.log("Creating todo table...");
  try{
    const newTodo=await prisma.todos.create({
        data:{
            title,
            body,
            userId
        }
    }
    )
    res.json(newTodo);
  }
  catch(err){
    res.json(err);
  }
  
};