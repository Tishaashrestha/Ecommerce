import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createReview,
  deleteReview,
  getReview,
  getReviewsForProduct,
  updateReview,
} from "../controller/review.controller.js";

const router = express.Router();

// Public: list reviews for product
router.get("/product/:productId", getReviewsForProduct);
router.get("/:id", getReview);

// Protected: create, update, delete
router.post("/", protectRoute, createReview);
router.patch("/:id", protectRoute, updateReview);
router.delete("/:id", protectRoute, deleteReview);

export const reviewRoutes = router;
