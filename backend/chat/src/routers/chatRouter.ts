import { Router } from "express";
import { createNewChat, getAllChats } from "../controllers/chatController.js";
import { isAuth } from "../middleware/isAuth.js";

const router = Router();

router.route("/chat/new").post(isAuth,createNewChat)
router.route("/chat/all").get(isAuth, getAllChats)

export default router;
