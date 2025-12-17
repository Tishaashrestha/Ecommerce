import { X } from "lucide-react";
import AddReview from "../components/AddReview";
import ReviewsList from "../components/ReviewsList";
import Confetti from "react-confetti";
import { useState } from "react";

const ProductModal = ({ product, closeModal }) => {
  if (!product) return null;
  const [refreshSignal, setRefreshSignal] = useState(0);
  const triggerRefresh = () => setRefreshSignal((s) => s + 1);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-200 cursor-pointer bg-red-800 hover:bg-red-500 rounded-full p-1"
        >
          <X size={20} />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          className="w-full h-64 object-contain rounded-md"
        />

        {/* Product Name */}
        <h2 className="text-2xl font-semibold mt-3">{product.name}</h2>

        {/* Price */}
        <p className="text-xl font-bold text-gray-700 mt-2">
          Rs. {product.price}
        </p>

        {/* Description */}
        <p className="text-gray-600 mt-4">{product.description}</p>

        {/* Add Review Component */}
        <div className="mt-5">
          <AddReview productId={product._id} onSuccess={triggerRefresh} />
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Reviews</h3>
            <ReviewsList
              productId={product._id}
              refreshSignal={refreshSignal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
