import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import AddReview from "../components/AddReview";
import ReviewsList from "../components/ReviewsList";
import { useCartStore } from "../stores/useCartStore";

// Helper to render dynamic stars with half-star support
function StarRating({ value, max = 5 }) {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    if (value >= i) {
      stars.push(
        <span key={i} className="text-yellow-400">
          ★
        </span>
      );
    } else if (value >= i - 0.5) {
      stars.push(
        <span key={i} className="text-yellow-400">
          ☆
        </span>
      );
    } else {
      stars.push(
        <span key={i} className="text-gray-200">
          ★
        </span>
      );
    }
  }
  return <span>{stars}</span>;
}

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [qty, setQty] = useState(1);
  const { addToCart, addItem, setCart } = useCartStore();

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        let foundProduct = null;
        // Use new backend endpoint: /products/:id returns { product }
        try {
          const pRes = await axiosInstance.get(`/product/${id}`);
          foundProduct = pRes?.data?.product || null;
        } catch (err) {
          console.log(err);
          foundProduct = null;
        }
        setProduct(foundProduct || null);
        // fetch reviews for the resolved product id if we have it
        if (foundProduct) {
          const productId = foundProduct._id ?? foundProduct.id;
          const rRes = await axiosInstance.get(`/reviews/product/${productId}`);
          setReviews(rRes?.data?.data || []);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.log(err);
        setProduct(null);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, refreshSignal]);

  if (loading) return <div className="p-6">Loading product...</div>;
  if (!product)
    return (
      <div className="p-6 text-center text-xl text-gray-500">
        Product not found.
      </div>
    );

  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length
      : 0;

  const handleAddToCart = () => {
    // Always send productId for backend compatibility
    const payload = {
      productId: product._id ?? product.id,
      name: product.name,
      price: Number(product.price) || 0,
      quantity: Number(qty) || 1,
      image: product.image,
      // Optionally include the whole product reference for frontend display
      product: product._id ?? product.id,
    };

    if (typeof addToCart === "function") {
      addToCart(payload, qty);
    } else if (typeof addItem === "function") {
      addItem(payload);
    } else if (typeof setCart === "function") {
      setCart((prev = []) => [...prev, payload]);
    } else {
      console.warn(
        "Cart store has no add function; implement addToCart or addItem."
      );
    }
    navigate("/cart");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-contain rounded"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <div className="mt-3 flex items-center gap-4">
            <div className="text-xl font-semibold">Rs. {product.price}</div>
            <div className="flex items-center gap-2">
              <div className="text-yellow-400 font-semibold">
                {avg.toFixed(1)}
              </div>
              <StarRating value={avg} max={5} />
              <div className="text-sm text-gray-500">
                ({reviews.length} reviews)
              </div>
            </div>
          </div>

          <p className="text-gray-700 mt-4">{product.description}</p>

          <div className="mt-6 flex items-center gap-4">
            <div>
              <label className="block text-sm text-gray-600">Quantity</label>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="mt-1 block border rounded px-2 py-1"
              >
                {[1, 2, 3, 4, 5, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddToCart}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              Add to cart
            </button>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Leave a review</h3>
            <AddReview
              productId={product._id ?? product.id}
              onSuccess={() => setRefreshSignal((s) => s + 1)}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold mb-3">Customer reviews</h3>
        <ReviewsList
          productId={product._id ?? product.id}
          refreshSignal={refreshSignal}
        />
      </div>
    </div>
  );
}
