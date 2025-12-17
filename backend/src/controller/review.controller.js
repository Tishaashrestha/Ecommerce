import Review from "../models/review.model.js";
import catchAsync from "../lib/catchAsync.js";
import AppError from "../lib/AppError.js";

// Create a review (protected)
export const createReview = catchAsync(async (req, res, next) => {
  const { product, rating, title, comment } = req.body;
  if (!product || typeof rating === "undefined") {
    return next(new AppError("product and rating are required", 400));
  }
  const review = await Review.create({
    product,
    user: req.user._id,
    rating,
    title,
    comment,
  });
  // populate user info for immediate frontend display
  const populated = await review.populate("user", "name email");
  res.status(201).json({ status: "success", data: populated });
});

// Get all reviews for a product (public)
export const getReviewsForProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  // newest first
  const reviews = await Review.find({ product: productId })
    .sort({ createdAt: -1 })
    .populate("user", "name email");
  res
    .status(200)
    .json({ status: "success", results: reviews.length, data: reviews });
});

// Get single review (public)
export const getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!review) return next(new AppError("Review not found", 404));
  res.status(200).json({ status: "success", data: review });
});

// Update review (owner or admin)
export const updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError("Review not found", 404));
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new AppError("Not authorized to edit this review", 403));
  }
  const updates = ["rating", "title", "comment"].reduce((acc, key) => {
    if (req.body[key] !== undefined) acc[key] = req.body[key];
    return acc;
  }, {});
  Object.assign(review, updates);
  await review.save();
  res.status(200).json({ status: "success", data: review });
});

// Delete review (owner or admin)
export const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError("Review not found", 404));
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new AppError("Not authorized to delete this review", 403));
  }
  await review.remove();
  res.status(204).json({ status: "success", data: null });
});
