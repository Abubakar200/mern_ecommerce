import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.controller.js";
const router = Router();

// create new product
router.route("/product/new").post(createProduct);

// get all products

router.route("/products").get(getAllProducts);

// update the product -- admin
router
  .route("/product/:id")
  .put(updateProduct)
  .delete(deleteProduct)
  .get(getProduct);

export default router;
