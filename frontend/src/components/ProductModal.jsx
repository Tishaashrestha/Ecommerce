import React from "react";
import { Link } from "react-router-dom";

/*
 This file used to be a modal. It now exports a simple ProductCard that
 navigates to /product/:id (no popup). It keeps the same default export
 so existing imports don't break.
*/
const ProductCard = ({ product }) => {
  if (!product) return null;
  const productId = product._id ?? product.id;
  return (
    <Link
      to={`/product/${productId}`}
      className="block w-full max-w-xs bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border border-gray-100"
      style={{ minWidth: 250 }}
    >
      <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-48 object-contain"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="text-base text-gray-700 font-bold">
            Rs. {product.price}
          </div>
          {product.rating ? (
            <div className="text-yellow-400 text-sm font-semibold flex items-center gap-1">
              {Number(product.rating).toFixed(1)}
              <span>★</span>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
