import express from 'express';
import { Router } from 'express';
import * as createControllers from '../controllers/createController';
const router=express.Router();
import {verifyToken} from "../middleware/auth";

router.post("",verifyToken,createControllers.createController);

export default router;