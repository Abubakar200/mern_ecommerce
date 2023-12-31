import { Router } from "express";
import {
  DeleteUser,
  UpdateUser,
  forgotPassword,
  getAllUser,
  getSingleUser,
  getUserDetail,
  resetPassword,
  updatePassword,
  userLogin,
  userLogout,
  userRegister,
  userUpdateProfile,
} from "../controllers/user.controller.js";
import { IsAuth, authRole } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").get(userLogout);
router.route("/password/forget").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(IsAuth, getUserDetail);
router.route("/password/update").put(IsAuth, updatePassword);
router.route("/me/update").put(IsAuth, userUpdateProfile);
router.route("/admin/users").get(IsAuth, authRole("admin"), getAllUser);
router
  .route("/admin/user/:id")
  .get(IsAuth, authRole("admin"), getSingleUser)
  .put(IsAuth, authRole("admin"), UpdateUser)
  .delete(IsAuth, authRole("admin"), DeleteUser);

export default router;
