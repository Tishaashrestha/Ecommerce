import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";

function Stars({ value }) {
  return (
    <div className="flex gap-1 text-yellow-400 leading-none">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={value >= i ? "text-yellow-400" : "text-gray-200"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewsList({ productId, refreshSignal }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`/reviews/product/${productId}`);
      setReviews(res?.data?.data || []);
    } catch (err) {
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!productId) return;
    load();
  }, [productId, refreshSignal]);

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (reviews.length === 0)
    return <div className="text-sm">No reviews yet.</div>;

  const avg =
    reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-xl font-bold">{avg.toFixed(1)}</div>
          <Stars value={Math.round(avg)} />
        </div>
        <div className="text-sm text-gray-600">{reviews.length} review(s)</div>
      </div>

      {reviews.map((r) => (
        <div key={r._id} className="border rounded p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">
              {r.user?.name || "Anonymous"}
            </div>
            <div className="text-sm text-gray-600">
              {new Date(r.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="mt-1">
            <Stars value={Math.round(r.rating || 0)} />
          </div>
          {r.title && <div className="font-semibold mt-2">{r.title}</div>}
          {r.comment && <div className="text-sm mt-1">{r.comment}</div>}
        </div>
      ))}
    </div>
  );
}
