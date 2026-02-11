import { Router } from "express"
import { createUser } from "../controllers/userController.js";

const router = Router();

router.route("/").get(createUser)

export default router;