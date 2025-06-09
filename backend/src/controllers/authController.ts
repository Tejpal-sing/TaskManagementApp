import type { Request, Response } from "express";
import * as authService from "../services/authService";

export const register = async (req: Request, res: Response) => {
	try {
		const existingUser = await authService.checkExistingUser(req);
		if (existingUser !== null) {
			return res.status(400).json({ error: "Email already exists" });
		}
		const newUser = await authService.createNewUser(req);
		res.status(201).json(newUser);
	} catch (error) {
		res.status(500).json({ error: "Registration failed" });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const emailMatch = await authService.checkExistingUser(req);
		if (!emailMatch) {
			return res.status(401).json({ error: "Invalid email id" });
		}

		const matchPassword = (await authService.loginService(req)).matchPassword;
		if (!matchPassword) {
			return res.status(401).json({ error: "Invalid password" });
		}

		const accessToken = (await authService.loginService(req)).accessToken;
		res.json({ accessToken });
	} catch (error) {
		res.status(500).json({ error: "Login Failed" });
	}
};

export const logout = (req: Request, res: Response) => {
	res
		.clearCookie("accessToken", {
			secure: true,
			sameSite: "none", // adjust as needed
		})
		.status(200)
		.json("User has been logged out.");
};
