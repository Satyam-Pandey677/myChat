import { Router } from "express"
import { getAllUsers, getAUser, loginUser, myProfile, updateName, verifyUser } from "../controllers/userController.js";
import { isAuth } from "../middleware/isAuth.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/verify").post(verifyUser);
router.route("/update/user").post(isAuth, updateName);
router.route("/me").get(isAuth, myProfile);
router.route("/user/all").get(isAuth, getAllUsers);
router.route("/user/:id").get(isAuth, getAUser)


export default router;

