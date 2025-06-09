import type { Response } from "express";
import {
	createService,
	retrieveService,
	deleteService,
	retrieveUserDataService,
	updateService,
} from "../services/todoService";
import type { AuthRequest } from "../middleware/auth";

export const createController = async (req: AuthRequest, res: Response) => {
	try {
		const { title, body } = req.body;
		const userid = req.user?.id;
		if (!title || typeof title !== "string" || title.trim().length === 0) {
			return res
				.status(400)
				.json({ message: "Title is required and must be a non-empty string." });
		}

		if (!body || typeof body !== "string" || body.trim().length === 0) {
			return res
				.status(400)
				.json({ message: "Body is required and must be a non-empty string." });
		}

		if (
			typeof userid !== "number" ||
			!Number.isInteger(userid) ||
			userid <= 0
		) {
			return res.status(400).json({
				message: "User ID is required and must be a positive integer",
			});
		}
	} catch (err) {
		return res.status(400).json({ message: "Input is not in correct format " });
	}

	try {
		const newtodo = await createService(req);
		res.status(201).json(newtodo);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Todo not created successfully" });
	}
};

export const deleteController = async (req: AuthRequest, res: Response) => {
	const todoId = Number(req.params.id);
	const userid = req.user?.id;
	try {
		if (Number.isNaN(todoId) || todoId <= 0) {
			return res
				.status(400)
				.json({ message: "todoId is not a natural number" });
		}
		if (
			typeof userid !== "number" ||
			!Number.isInteger(userid) ||
			userid <= 0
		) {
			return res.status(400).json({
				message: "User ID is required and must be a positive integer",
			});
		}
	} catch (inputErr) {
		return res.status(400).json({ error: (inputErr as Error).message });
	}

	try {
		const existingTodo = await retrieveService(req);
		if (!existingTodo) {
			return res.status(404).json({
				error: "Todo not found or you don't have permission to delete it",
			});
		}
		deleteService(req);
		res.json({ message: "Todo deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: "Failed to delete todo" });
	}
};

export const retrieveController = async (req: AuthRequest, res: Response) => {
	try {
		const todoId = Number(req.params.id);
		const userId = req.user?.id;

		if (!todoId || !Number.isInteger(todoId) || todoId <= 0) {
			return res
				.status(400)
				.json({ message: "Todo ID must be a valid positive integer." });
		}

		if (
			typeof userId !== "number" ||
			!Number.isInteger(userId) ||
			userId <= 0
		) {
			return res
				.status(400)
				.json({
					message: "User ID is required and must be a positive integer.",
				});
		}
	} catch (err) {
		return res.status(400).json({ message: "Invalid request parameters." });
	}

	try {
		const todo = await retrieveService(req);
		if (!todo) {
			return res.status(404).json({ error: "Todo not found" });
		}
		res.status(200).json(todo);
	} catch (err) {
		res.status(500).json({ error: "Failed to retrieve todo" });
	}
};

export const retrieveUserDataController = async (
	req: AuthRequest,
	res: Response,
) => {
	const page = Number.parseInt(req.query.page as string) || 0;
	const limit = Number.parseInt(req.query.limit as string) || 10;
	try {
		if (!req.query) {
			return res.status(400).json({ error: "Missing query parameters" });
		}

		if (typeof req.query.page !== "string") {
			return res.status(400).json({ error: "Page parameter must be a string" });
		}

		if (typeof req.query.limit !== "string") {
			return res
				.status(400)
				.json({ error: "Limit parameter must be a string" });
		}

		// Parse and validate pagination parameters
		const page = Number.parseInt(req.query.page);
		const limit = Number.parseInt(req.query.limit);

		if (Number.isNaN(page) || page < 0) {
			return res.status(400).json({ error: "Invalid page number" });
		}

		if (Number.isNaN(limit) || limit < 1 || limit > 50) {
			return res
				.status(400)
				.json({ error: "Invalid limit. Must be between 1 and 50" });
		}
	} catch (err) {
		return res.status(400).json({ err: "Invalid input format" });
	}

	try {
		const userId = req.user?.id;
		if (!userId) return res.status(401).json({ error: "Unauthorized" });
		const todos = await retrieveUserDataService(req);
		return res.status(200).json({
			success: true,
			data: {
				items: todos.todos,
				totalCount: todos.total,
				currentPage: page,
				pageSize: limit,
				totalPages: Math.ceil(todos.total / limit),
			},
		});
	} catch (error) {
		return res.status(500).json({ error: "Something went wrong" });
	}
};

export const updateControllers = async (req: AuthRequest, res: Response) => {
	try {
		const { title, body } = req.body;
		const userid = req.user?.id;
		const todoId = Number(req.params.id);

		if (!title || typeof title !== "string" || title.trim().length === 0) {
			return res
				.status(400)
				.json({ message: "Title is required and must be a non-empty string." });
		}

		if (!body || typeof body !== "string" || body.trim().length === 0) {
			return res
				.status(400)
				.json({ message: "Body is required and must be a non-empty string." });
		}

		if (!todoId || !Number.isInteger(todoId) || todoId <= 0) {
			return res
				.status(400)
				.json({ message: "Todo ID must be a valid positive integer." });
		}

		if (
			typeof userid !== "number" ||
			!Number.isInteger(userid) ||
			userid <= 0
		) {
			return res.status(400).json({
				message: "User ID is required and must be a positive integer",
			});
		}
	} catch (err) {
		return res.status(400).json({ message: "Input is not in correct format " });
	}

	try {
		const userId = req.user?.id;

		if (!userId) {
			return res.status(401).json({ error: "User not authenticated" });
		}

		const existingTodo = (await updateService(req)).existingTodo;

		if (!existingTodo) {
			return res.status(404).json({
				error: "Todo not found or you don't have permission to update it",
			});
		}

		const updatedTodo = (await updateService(req)).updatedTodo;

		res.json(updatedTodo);
	} catch (err) {
		res.status(500).json({ error: "Failed to update todo" });
	}
};
