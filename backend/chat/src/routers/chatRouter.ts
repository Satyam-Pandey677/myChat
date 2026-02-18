import { Router } from "express";
import { createNewChat, getAllChats, getMessagesByChat, sendmessage } from "../controllers/chatController.js";
import { isAuth } from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.route("/chat/new").post(isAuth,createNewChat);
router.route("/chat/all").get(isAuth, getAllChats);
router.route("/message").post(isAuth, upload.single("image"), sendmessage);
router.route("/message/:chatId").get(isAuth, getMessagesByChat);

export default router;
