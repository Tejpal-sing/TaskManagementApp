import { AuthRequest } from "../middleware/auth";
import {Request,Response} from 'express';
import { PrismaClient } from "@prisma/client";
import {deleteService} from "../services/deleteService";
import { retrieveService } from "../services/retrieveService";
const prisma =new PrismaClient();


export const deleteController=async (req:AuthRequest,res:Response)=>{
    const userId=req.user!.id;
    const todoId=Number(req.params.id);
    try{
        const existingTodo=await retrieveService(req);

        if(!existingTodo){
            return res.status(404).json({ error: "Todo not found or you don't have permission to delete it" });
        }
        deleteService(req);

        res.json({message:"Todo deleted successfully"});
    }catch(err){
        console.error("Error deleting todo:", err);
        res.status(500).json({ error: "Failed to delete todo" });
    }
}