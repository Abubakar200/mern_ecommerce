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

// create review products
const createProductReview = asyncHandler(async (req, res, next) => {
  const { comment, rating, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let average = 0;
  product.reviews.forEach((rev) => {
    average += rev.rating;
  });
  product.ratings = average / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// get all reviews

const getAllReviews = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ApiError("product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let average = 0;

  reviews.forEach((rev) => {
    average += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = average / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
export {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProduct,
  createProductReview,
  deleteReview,
  getAllReviews
};
