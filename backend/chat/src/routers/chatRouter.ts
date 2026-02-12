import { Router } from "express";
import { createNewChat } from "../controllers/chatController.js";
import { isAuth } from "../middleware/isAuth.js";

const router = Router();

router.route("/chat/new").post(isAuth,createNewChat)

export default router;