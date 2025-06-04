import express from 'express';
import { retrieveUserDataController } from '../controllers/retrieveUserDataController';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.get("", verifyToken, retrieveUserDataController);

export default router;
