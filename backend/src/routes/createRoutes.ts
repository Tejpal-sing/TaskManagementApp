import express from 'express';
import { Router } from 'express';
import * as createControllers from '../controllers/createController';
const router=express.Router();

router.post("/create",createControllers.createController);

export default router;