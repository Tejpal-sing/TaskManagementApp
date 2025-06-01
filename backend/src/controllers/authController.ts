import {Request,Response} from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma=new PrismaClient();


export const register=async (req: Request, res: Response)=>{
    const {name,email,password}=req.body;
    const hashedPassword=await bcrypt.hash(password,10);

    try{
        const existingUser = await prisma.users.findUnique({
            where: { email }
          });  
        if(existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        } 

        const newUser=await prisma.users.create({
            data:{
                name,
                email,
                password: hashedPassword
            }
        })

        const {password: _, ...userWithoutPassword}=newUser;
        res.status(201).json(userWithoutPassword);
    }
    catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
}

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        const emailMatch = await prisma.users.findUnique({
            where: {
                email: email
            }
        });

        if (!emailMatch) {
            return res.status(401).json({ error: 'Invalid email id' });
        }

        const matchPassword = await bcrypt.compare(password, emailMatch.password);
        
        if (!matchPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const accessToken = jwt.sign(
            { id: emailMatch.id, email: emailMatch.email },
            'your_jwt_secret',  // Hardcoded secret
            { expiresIn: '1h' }
        );

        res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ error: 'Login Failed' });
    }
}

export const logout=(req: Request, res: Response)=>{
    console.log("logout api hits");
    res.clearCookie("accessToken", {
        secure:true,
        sameSite: "none", // adjust as needed
    }).status(200).json("User has been logged out.");
}