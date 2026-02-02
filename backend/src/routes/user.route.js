import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllUsers, getMessage } from "../controller/user.controller.js";

const router = Router();

router.get('/', protectRoute, getAllUsers);
router.get('/messages/:userId', protectRoute, getMessage);

export default router