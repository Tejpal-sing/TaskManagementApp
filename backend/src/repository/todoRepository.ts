import prisma from "../utils/prisma";
import type { AuthRequest } from "../middleware/auth";

export const createRepository = async (req: AuthRequest) => {
	const { title, body } = req.body;
	const userid = req.user?.id;

	if (!userid) {
		throw new Error("User ID is required");
	}

	const res = await prisma.todos.create({
		data: {
			title,
			body,
			userId: userid,
		},
	});
	return res;
};

export const retrieveRepository = async (req: AuthRequest) => {
	const { id } = req.params;
	const userid = req.user?.id;
	const todoId = Number(id);

	const todo = await prisma.todos.findMany({
		where: {
			id: todoId,
			userId: userid,
			deletedAt: null,
		},
	});
	return todo;
};

export const deleteRepository = async (req: AuthRequest) => {
	const todoId = Number(req.params.id);
	const userid = req.user?.id;

	await prisma.todos.update({
		where: {
			id: todoId,
			userId: userid,
		},
		data: {
			deletedAt: new Date(),
		},
	});
};

export const retrieveUserDataRepository = async (req: AuthRequest) => {
	const userid = req.user?.id;
	const page = Number.parseInt(req.query.page as string) || 0;
	const limit = Number.parseInt(req.query.limit as string) || 10;
	const total = await prisma.todos.count({
		where: { userId: userid, deletedAt: null },
	});

	const todos = await prisma.todos.findMany({
		where: {
			userId: userid,
			deletedAt: null,
		},
		skip: page * limit,
		take: limit,
		orderBy: { createdAt: "asc" }, // optional, sort by createdAt descending
	});

	return { todos, total };
};

export const updateRepository = async (req: AuthRequest) => {
	const todoId = Number.parseInt(req.params.id);
	console.log(todoId);
	const { title, body } = req.body;
	const userId = req.user?.id;

	const existingTodo = await prisma.todos.findFirst({
		where: {
			id: todoId,
			userId: userId,
		},
	});

	const updatedTodo = await prisma.todos.update({
		where: {
			id: todoId,
		},
		data: {
			title,
			body,
		},
	});

	return { existingTodo, updatedTodo };
};
