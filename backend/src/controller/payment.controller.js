// ...existing code...
//import { model } from "mongoose";
// import Coupon from "../models/coupon.model.js";
// import { stripe } from "../lib/stripe.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";

// src/lib/esewa/verifySignature.ts
import CryptoJS from "crypto-js";

const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Removed Transaction import because there is no Transaction model
/**
 * Generates a Base64-encoded HMAC SHA256 signature using the eSewa secret key.
 *
 * @param message - The message string to be signed or verified.
 * @returns Base64-encoded HMAC-SHA256 signature.
 */
export function generateEsewaSignature(message) {
  const secretKey = process.env.ESEWA_SECRET_CODE;

  if (!secretKey) {
    throw new Error("Missing ESEWA_SECRET_CODE in environment variables.");
  }

  const hash = CryptoJS.HmacSHA256(message, secretKey);
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

  return hashInBase64;
}

export async function EsewaInitiator(req, res) {
  try {
    const { amount, name, email } = await req.body;

    // Validate inputs
    if (!amount || !name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount < 1) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const totalAmount = Number(amount);

    // Generate signature
    const transactionUuid = uuidv4();
    const message = [
      `total_amount=${totalAmount.toFixed(2)}`,
      `transaction_uuid=${transactionUuid}`,
      `product_code=${process.env.ESEWA_MERCHANT_CODE}`,
    ].join(",");

    const signature = generateEsewaSignature(message);

    return res.json({
      paymentUrl: `${process.env.ESEWA_BASE_URL}/api/epay/main/v2/form`,
      params: {
        amount: totalAmount.toFixed(2),
        tax_amount: "0.00",
        total_amount: totalAmount.toFixed(2),
        product_service_charge: "0.00",
        product_delivery_charge: "0.00",
        transaction_uuid: transactionUuid,
        product_code: process.env.ESEWA_MERCHANT_CODE,
        signature,
        success_url: `${process.env.ESEWA_SUCCESS_URL}`,
        failure_url: `${process.env.ESEWA_FAILURE_URL}`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
      },
    });
  } catch (error) {
    console.error("Payment error:", error);
    return res.status(500).json({ error: error.message || "Payment failed" });
  }
}

// Helper: extract items from a user doc (handles several common cart shapes)
async function getCartItemsFromUser(userId) {
  if (!userId) return [];
  const user = await User.findById(userId).lean();
  if (!user) return [];

  let source = null;
  if (Array.isArray(user.cart) && user.cart.length) source = user.cart;
  else if (Array.isArray(user.cartItems) && user.cartItems.length)
    source = user.cartItems;
  else if (Array.isArray(user.items) && user.items.length) source = user.items;
  else if (
    user.cart &&
    Array.isArray(user.cart.items) &&
    user.cart.items.length
  )
    source = user.cart.items;

  if (!source) return [];

  // Filter out null/undefined items and handle missing product fields safely
  return source
    .filter((i) => i && (i.product || i.productId || i._id))
    .map((i) => ({
      product: i.product || i.productId || i._id || null,
      name: i.name || (i.product && i.product.name) || "",
      price: Number(
        i.price ?? i.unitPrice ?? (i.product && i.product.price) ?? 0
      ),
      quantity: Number(i.quantity ?? i.qty ?? 1),
    }));
}

// Helper: clear cart fields on the user doc (covers common field names)
async function clearUserCart(userId) {
  if (!userId) return;
  await User.findByIdAndUpdate(userId, {
    $set: { cart: [], cartItems: [], items: [], "cart.items": [] },
  }).catch(() => {});
}

// POST /payments/checkout-success (protected) - frontend calls this when payment is known to be successful
export const checkoutSuccess = catchAsync(async (req, res) => {
  const userId = req.user?._id || null;
  const { cart: clientCart, paymentData } = req.body;

  // Debug: log incoming cart and body
  console.log("checkoutSuccess req.body:", req.body);

  // Accept cart as array, or as object with items, or fallback to user
  let items = [];
  if (Array.isArray(clientCart) && clientCart.length) {
    items = clientCart.map((i) => ({
      product: i.product || i.productId || i._id || null,
      name: i.name || "",
      price: Number(i.price) || 0,
      quantity: Number(i.quantity) || 1,
    }));
  } else if (
    clientCart &&
    Array.isArray(clientCart.items) &&
    clientCart.items.length
  ) {
    items = clientCart.items.map((i) => ({
      product: i.product || i.productId || i._id || null,
      name: i.name || "",
      price: Number(i.price) || 0,
      quantity: Number(i.quantity) || 1,
    }));
  } else {
    items = await getCartItemsFromUser(userId);
  }

  // Debug: log resolved items
  console.log("checkoutSuccess resolved items:", items);

  if (!items.length) {
    return res.status(400).json({ status: "fail", message: "Cart is empty" });
  }

  // Compute total and normalise items
  let total = 0;
  const orderItems = items.map((item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    total += price * quantity;
    return { product: item.product, name: item.name || "", price, quantity };
  });

  const order = await Order.create({
    user: userId,
    items: orderItems,
    // Order schema requires `totalAmount`
    totalAmount: total,
    // keep `total` for backward compatibility if other code expects it
    total,
    // embed payment info inside the order (no separate Payment model)
    payment: {
      provider: paymentData?.provider ?? "esewa",
      status: "success",
      amount: total,
      raw: paymentData ?? {},
    },
    paymentStatus: "paid",
    status: "processing",
  });

  // Clear user's stored cart fields
  await clearUserCart(userId);

  return res.status(200).json({ status: "success", order, orderId: order._id });
});

// GET /payments/esewa-status (protected) - queries eSewa status API
export const esewaStatusCheck = catchAsync(async (req, res) => {
  const { product_code, transaction_uuid, total_amount } = req.query;
  if (!product_code || !transaction_uuid || !total_amount) {
    return res.status(400).json({
      status: "fail",
      message: "product_code, transaction_uuid and total_amount are required",
    });
  }

  const base = process.env.ESEWA_RC
    ? "https://rc.esewa.com.np"
    : "https://esewa.com.np";
  const url = `${base}/api/epay/transaction/status/?product_code=${encodeURIComponent(
    product_code
  )}&total_amount=${encodeURIComponent(
    total_amount
  )}&transaction_uuid=${encodeURIComponent(transaction_uuid)}`;

  const resp = await fetch(url);
  if (!resp.ok) {
    return res.status(502).json({
      status: "fail",
      message: "Failed to contact eSewa",
      code: resp.status,
    });
  }

  const json = await resp.json();

  // If COMPLETE and user is authenticated, optionally create order (requires client to pass cart via POST if necessary)
  return res.status(200).json({ status: "success", data: json });
});
