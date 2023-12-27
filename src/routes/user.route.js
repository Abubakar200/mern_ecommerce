import { Router } from "express";
import {
  forgotPassword,
  resetPassword,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/user.controller.js";
// import { IsAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").get(userLogout);
router.route("/password/forget").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

export default router;
