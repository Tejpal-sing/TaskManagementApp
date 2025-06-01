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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, body } = req.body;
    console.log("hi");
    // Basic validation
    if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Title is required and must be a string' });
    }
    if (!body || typeof body !== 'string') {
        return res.status(400).json({ error: 'Body is required and must be a string' });
    }
    try {
        // Create a new todo in the database
        const newTodo = yield prisma.todos.create({
            data: {
                title,
                body,
            },
        });
        // Respond with the created todo
        res.status(201).json(newTodo);
    }
    catch (error) {
        // Handle errors
        console.error('Error creating todo:', error);
        res.status(500).json({ error: 'Failed to create todo' });
    }
});
exports.createController = createController;
