import express, { Router } from 'express';
import { retrieveController } from '../controllers/retrieveController';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.get("/:id",verifyToken, retrieveController);

export default router;