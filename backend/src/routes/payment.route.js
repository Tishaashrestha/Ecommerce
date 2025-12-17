import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  // createCheckoutSession,
  EsewaInitiator,
  esewaStatusCheck,
  checkoutSuccess,
} from "../controller/payment.controller.js";

const router = express.Router();

// router.post("/create-checkout-session", protectRoute, createCheckoutSession);
// router.post("/checkout-success", protectRoute, checkoutSuccess);

router.post("/esewa-init", protectRoute, EsewaInitiator);
router.post("/checkout-success", protectRoute, checkoutSuccess);
router.get("/esewa-status", protectRoute, esewaStatusCheck);

export default router;
