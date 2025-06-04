import { Response } from 'express';
import { createService } from '../services/createService';
import { AuthRequest } from '../middleware/auth';

export const createController = async (req:AuthRequest, res: Response) => {
    console.log("pass auth check")
    try {
        const newtodo = await createService(req);
        console.log(newtodo);
        res.status(201).json(newtodo);
    }
    catch(err) {
        res.status(400).json({ message: "Todo not created successfully" });
    }
};
