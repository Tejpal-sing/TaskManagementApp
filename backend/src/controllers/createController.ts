import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export const createController = async (req: Request, res: Response) => {
  const { title, body,userId } = req.body;
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