import express from 'express';
import {Request,Response,NextFunction} from 'express';
const { PrismaClient } = require('@prisma/client');
import cors from 'cors';
import createRoutes from '../src/routes/createRoutes';
import authRoutes from '../src/routes/authRoutes';
import retrieveRoutes from '../src/routes/retrieveRoutes';
import updateRoutes from '../src/routes/updateRoutes';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// Basic health check route
app.get('/', (req:Request , res:Response) => {
  res.json({ message: 'Server is running!' });
});

// Example route using Prisma
app.get('/todos', async (req:Request, res:Response) => {
  try {
    const todos = await prisma.todos.findMany();
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Error fetching todos' });
  }
});



app.use("/api/auth",authRoutes);
app.use("/api", createRoutes);
app.use("/api/users:id/",retrieveRoutes);
app.use("/api",updateRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
