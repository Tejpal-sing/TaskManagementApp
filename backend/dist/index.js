"use strict";
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
					});
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { PrismaClient } = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const createRoutes_1 = __importDefault(require("../src/routes/createRoutes"));
const prisma = new PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Basic health check route
app.get("/", (req, res) => {
	res.json({ message: "Server is running!" });
});
// Example route using Prisma
app.get("/todos", (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		try {
			const todos = yield prisma.todos.findMany();
			res.json(todos);
		} catch (error) {
			console.error("Error fetching todos:", error);
			res.status(500).json({ error: "Error fetching todos" });
		}
	}),
);
app.use("/api", createRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
