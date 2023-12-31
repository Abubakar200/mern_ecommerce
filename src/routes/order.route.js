import { Router } from "express";
const router = Router();
import { IsAuth, authRole } from "../middleware/auth.middleware.js";
import {
  deleteOrder,
  getAllOrder,
  getSingleOrder,
  myOrder,
  newOrder,
  updateOrder,
} from "../controllers/order.controller.js";

router.route("/order/new").post(IsAuth, newOrder);

router.route("/order/:id").get(IsAuth, getSingleOrder);

router.route("/orders/me").get(IsAuth, myOrder);

router.route("/admin/orders").get(IsAuth, authRole("admin"), getAllOrder);
router
  .route("/admin/order/:id")
  .put(IsAuth, authRole("admin"), updateOrder)
  .delete(IsAuth, authRole("admin"), deleteOrder);

export default router;
