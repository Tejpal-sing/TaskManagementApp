"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { PrismaClient } = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const todoRoutes_1 = __importDefault(require("../src/routes/todoRoutes"));
const authRoutes_1 = __importDefault(require("../src/routes/authRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new PrismaClient();
const app = (0, express_1.default)();
// CORS configuration - Allow all origins for cross-origin requests
app.use((0, cors_1.default)({
    origin: true, // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({ message: "Server is running!" });
});
app.get("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield prisma.todos.findMany();
        res.json(todos);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching todos" });
    }
}));
app.use("/api/auth", authRoutes_1.default);
app.use("/api/todos", todoRoutes_1.default);
app.use("/api/todos", todoRoutes_1.default);
app.use("/api/todos", todoRoutes_1.default);
app.use("/api/todos", todoRoutes_1.default);
app.use("/api/todos", todoRoutes_1.default);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
