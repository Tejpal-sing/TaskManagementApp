import prisma from "../utils/prisma";
import {Request} from 'express';
import bcrypt from 'bcryptjs';
export const findExistingUser=async (req:Request)=>{
    const {name,email,password}=req.body;
    
    const existingUser = await prisma.users.findUnique({
        where: { email }
      });  
    return existingUser;
}


export const createUser=async(req:Request)=>{
    const {name,email,password}=req.body;
    const hashedPassword=await bcrypt.hash(password,10);
    const newUser=await prisma.users.create({
        data:{
            name,
            email,
            password: hashedPassword
        }
    })
    const {password: _, ...userWithoutPassword}=newUser;
    return newUser;
}