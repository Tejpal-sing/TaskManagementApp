import express, { Router } from 'express';
import { retrieveController } from '../controllers/retrieveController';

const router = Router();

router.get("/retrieve/:id", retrieveController);

export default router;