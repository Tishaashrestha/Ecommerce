// ...existing code...
import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import Confetti from "react-confetti";
import axiosInstance from "../lib/axios";

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const { clearCart, cart } = useCartStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const data = params.get("data"); // may be present; optional
      try {
        const paymentData = data ? { provider: "esewa", raw: data } : undefined;
        const res = await axiosInstance.post("/payments/checkout-success", {
          cart,
          paymentData,
        });
        const orderId =
          res?.data?.order?._id ||
          res?.data?.orderId ||
          res?.data?.order?.id ||
          null;
        clearCart();
        if (orderId) {
          return;
        }
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.status ||
            "Checkout finalization failed"
        );
      } finally {
        setIsProcessing(false);
      }
    })();
  }, [cart, clearCart, navigate]);

  if (isProcessing)
    return (
      <div className="h-screen flex items-center justify-center px-4">
        <div className="text-center">Processing payment result...</div>
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#8B4513] rounded-lg shadow-xl overflow-hidden relative z-10 p-6">
          <h1 className="text-2xl font-bold text-center text-black mb-4">
            Payment Result
          </h1>
          <p className="text-black text-center mb-4">
            There was an issue processing your payment:
          </p>
          <p className="text-red-600 text-center mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/cart"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-white hover:text-black transition"
            >
              Back to Cart
            </Link>
            <Link
              to="/"
              className="px-4 py-2 border rounded-lg hover:bg-black hover:text-white transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={300}
        recycle={false}
      />

      <div className="max-w-md w-full bg-[#8B4513] rounded-lg shadow-xl overflow-hidden relative z-10">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <CheckCircle className="text-gray-500 w-16 h-16 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-black mb-2">
            Purchase Successful!
          </h1>

          <p className="text-black text-center mb-2">
            Thank you for your order. We're processing it now.
          </p>
          <p className="text-black text-center text-sm mb-6">
            Check your email for order details and updates.
          </p>

          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-black">Order number</span>
              <span className="text-sm font-semibold text-black">#—</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-black">Estimated delivery</span>
              <span className="text-sm font-semibold text-black">
                3-5 business days
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/")}
              className="w-full text-white bg-black hover:bg-white hover:text-black font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <HandHeart className="mr-2" size={18} />
              Thanks for trusting us!
            </button>
            <Link
              to={"/"}
              className="w-full text-white bg-black hover:bg-white hover:text-black font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            >
              Continue Shopping
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PurchaseSuccessPage;
// ...existing code...
