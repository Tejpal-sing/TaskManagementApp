import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';


export const createRepository=async (req:AuthRequest)=> {
        console.log(req.body);
        const {title,body}=req.body;
        const userId=req.user!.id;
        try{
            const res=await prisma.todos.create({
                data: {
                    title,
                    body,
                    userId
                }
            });
            console.log(res);
            return res;
        }catch(err){
            console.log(err);
        }
};
