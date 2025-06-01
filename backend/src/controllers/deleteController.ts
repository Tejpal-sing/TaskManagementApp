import { AuthRequest } from "../middleware/auth";
import {Request,Response} from 'express';
import { PrismaClient } from "@prisma/client";
const prisma =new PrismaClient();


export const deleteController=async (req:AuthRequest,res:Response)=>{
    const userId=req.user!.id;
    const todoId=Number(req.params.id);

    try{
        const  existingTodo=await prisma.todos.findFirst({
            where:{
                id:todoId,
                userId:userId
            }
        });

        if(!existingTodo){
            return res.status(404).json({ error: "Todo not found or you don't have permission to delete it" });
        }

        await prisma.todos.delete({
            where:{
                id:todoId
            }
        });

        res.json({message:"Todo deleted successfully"});
    }catch(err){
        console.error("Error deleting todo:", err);
        res.status(500).json({ error: "Failed to delete todo" });
    }
}