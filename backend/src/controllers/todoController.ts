import { Response } from 'express';
import { createService,retrieveService,deleteService,retrieveUserDataService,updateService} from '../services/todoService';
import { AuthRequest } from '../middleware/auth';

export const createController = async (req:AuthRequest, res: Response) => {
    try{
        const {title,body}=req.body;
        const userid=req.user!.id;
        if (!title || typeof title !== "string" || title.trim().length === 0) {
            return res.status(400).json({ message: "Title is required and must be a non-empty string." });
        }
    
        if(!body || typeof body!== "string" || body.trim().length === 0){
            return res.status(400).json({ message: "Body is required and must be a non-empty string." });
        }
    
        if (typeof userid !== "number" || !Number.isInteger(userid) || userid <= 0)
        {
            return res.status(400).json({ message: "User ID is required and must be a positive integer" });
        }
    }
    catch(err){
        return res.status(400).json({message: "Input is not in correct format "});
    }

  
    try {
        const newtodo = await createService(req);
        res.status(201).json(newtodo);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ message: "Todo not created successfully" });
    }
};

export const deleteController=async (req:AuthRequest,res:Response)=>{
    const todoId = Number(req.params.id);
    const userid=req.user?.id;
    try{
        if (isNaN(todoId) || todoId <= 0) {
            return res.status(400).json({message:"todoId is not a natural number"})
        }
        if (typeof userid !== "number" || !Number.isInteger(userid) || userid <= 0)
        {
            return res.status(400).json({ message: "User ID is required and must be a positive integer" });
        }

    } catch (inputErr) {
        return res.status(400).json({ error: (inputErr as Error).message });
    }

    try{
        const existingTodo=await retrieveService(req);
        if(!existingTodo){
            return res.status(404).json({ error: "Todo not found or you don't have permission to delete it" });
        }
        deleteService(req);
        res.json({message:"Todo deleted successfully"});
    }catch(err){
        res.status(500).json({ error: "Failed to delete todo" });
    }
}

export const retrieveController = async (req: AuthRequest, res: Response) => {
    try {
        const todo = await retrieveService(req);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json(todo);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve todo' });
    }
};

export const retrieveUserDataController = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      const todos = await retrieveUserDataService(userId);
      return res.json(todos);
    } 
    catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
};

export const updateControllers = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const existingTodo = (await updateService(req)).existingTodo;

        if (!existingTodo) {
            return res.status(404).json({ error: "Todo not found or you don't have permission to update it" });
        }

        const updatedTodo = (await updateService(req)).updatedTodo;

        res.json(updatedTodo);
    } 

    catch (err) {
        res.status(500).json({ error: "Failed to update todo" });
    }
};
