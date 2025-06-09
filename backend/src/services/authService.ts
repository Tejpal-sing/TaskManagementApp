import type { Request } from "express";
import bcrypt from "bcryptjs";
import * as authRepository from "../repository/authRepository";
import jwt from "jsonwebtoken";
export const checkExistingUser = async (req: Request) => {
	const existingUser = await authRepository.findExistingUser(req);
	return existingUser;
};

export const createNewUser = async (req: Request) => {
	const newUser = await authRepository.createUser(req);
	return newUser;
};

export const loginService = async (req: Request) => {
	const { password } = req.body;
	const existingUser = await authRepository.findExistingUser(req);
	const matchPassword = await bcrypt.compare(password, existingUser!.password);
	const accessToken = jwt.sign(
		{ id: existingUser?.id, email: existingUser?.email },
		process.env.JWT_SECRET!, // Hardcoded secret
		{ expiresIn: "1h" },
	);
	return { matchPassword, accessToken };
};
