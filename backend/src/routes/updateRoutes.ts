// backend/src/routes/updateRoutes.ts
import { Router } from "express";
import { updateControllers } from '../controllers/updateController';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.put("/:id", verifyToken, updateControllers);
export default router;