import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import { asyncHandler } from "../utils/asyncHandler.js";
//  create product controller -- admin route
const createProduct = asyncHandler(async (req, res) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// get all products
const getAllProducts = asyncHandler(async (req, res) => {
  const resultPerPage = 5;
  const productsCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
  });
});

// get single product details
const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// update the products
const updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// delete the product
const deleteProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  product = await Product.findOneAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

export {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProduct,
};
