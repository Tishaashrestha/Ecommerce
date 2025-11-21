import { useState } from "react";

const AddReview = ({ productId }) => {
  const [rating, setRating] = useState(0); // selected stars
  const [hover, setHover] = useState(0); // hover effect
  const [review, setReview] = useState(""); // text review

  const handleSubmit = () => {
    console.log({
      productId,
      rating,
      review,
    });

    setRating(0);
    setReview("");
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-lg font-semibold mb-2">Add a Review</h3>

      {/* ⭐ Star Rating */}
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer text-3xl ${
              (hover || rating) >= star ? "text-yellow-400" : "text-gray-400"
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        ))}
      </div>

      {/* Review Textarea */}
      <textarea
        className="w-full border p-2 rounded"
        rows={3}
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review..."
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-black text-white cursor-pointer border-2 border-black hover:bg-white hover:text-black transition-colors duration-100 px-4 py-2 rounded mt-3"
      >
        Submit Review
      </button>
    </div>
  );
};

export default AddReview;
