import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.controller.js";
const router = Router();
import { IsAuth, authRole } from "../middleware/auth.middleware.js";

// create new product
router.route("/product/new").post(IsAuth, authRole("admin"), createProduct);

// get all products

router.route("/products").get(IsAuth, authRole("admin"), getAllProducts);

// update the product -- admin
router
  .route("/product/:id")
  .put(IsAuth, authRole("admin"), updateProduct)
  .delete(IsAuth, authRole("admin"), deleteProduct)
  .get(getProduct);

export default router;
