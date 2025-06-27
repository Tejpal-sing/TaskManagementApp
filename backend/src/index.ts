import express from "express";
import type { Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");
import cors from "cors";
import todoRoutes from "../src/routes/todoRoutes";
import authRoutes from "../src/routes/authRoutes";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();
const app = express();

// CORS configuration - Allow all origins for cross-origin requests
app.use(cors({
	origin: true, // Allow all origins
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.json({ message: "Server is running!" });
});

app.get("/todos", async (req: Request, res: Response) => {
	try {
		const todos = await prisma.todos.findMany();
		res.json(todos);
	} catch (error) {
		res.status(500).json({ error: "Error fetching todos" });
	}
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
