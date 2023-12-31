import { Router } from "express";
import {
  createProduct,
  createProductReview,
  deleteProduct,
  deleteReview,
  getAllProducts,
  getAllReviews,
  getProduct,
  updateProduct,
} from "../controllers/product.controller.js";
const router = Router();
import { IsAuth, authRole } from "../middleware/auth.middleware.js";

// create new product
router
  .route("/admin/product/new")
  .post(IsAuth, authRole("admin"), createProduct);

// get all products

router.route("/products").get(getAllProducts);

// update the product -- admin
router
  .route("/admin/product/:id")
  .put(IsAuth, authRole("admin"), updateProduct)
  .delete(IsAuth, authRole("admin"), deleteProduct);

router.route("/product/:id").get(getProduct);

router.route("/reviews").put(IsAuth, createProductReview);

router.route("/reviews").get(getAllReviews).delete(IsAuth, deleteReview);
export default router;
