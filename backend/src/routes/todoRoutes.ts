import express from "express";
import {
	createController,
	deleteController,
	retrieveController,
	retrieveUserDataController,
	updateControllers,
} from "../controllers/todoController";
const router = express.Router();
import { verifyToken } from "../middleware/auth";

router.post("/create", verifyToken, createController);
router.delete("/delete/:id", verifyToken, deleteController);
router.get("/retrieve/:id", verifyToken, retrieveController);
router.get("/retrieveUserData", verifyToken, retrieveUserDataController);
router.put("/update/:id", verifyToken, updateControllers);

export default router;
