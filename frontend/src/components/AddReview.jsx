import React, { useState } from "react";
import axiosInstance from "../lib/axios";

export default function AddReview({ productId, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!productId) {
      setError("Product missing");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post("/reviews", {
        product: productId,
        rating,
        title,
        comment,
      });
      const created = res?.data?.data;
      setRating(5);
      setTitle("");
      setComment("");
      if (onSuccess) onSuccess(created);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.status ||
          "Failed to submit review"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <div className="text-sm mb-2">Your rating</div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(i)}
              className={`text-2xl transition ${
                (hover || rating) >= i ? "text-yellow-400" : "text-gray-300"
              }`}
              aria-label={`${i} star`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Review title"
        className="w-full border rounded px-2 py-1"
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review"
        className="w-full border rounded px-2 py-1"
        rows={3}
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-black text-white rounded"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
