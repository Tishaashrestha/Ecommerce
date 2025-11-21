//import React from 'react'
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Search } from "lucide-react";
import ProductModal from "../components/ProductModal";
const CategoryPage = () => {
  const { fetchProductsByCategory, products } = useProductStore();
  const { category } = useParams();

  useEffect(() => {
    fetchProductsByCategory(category);
  }, [fetchProductsByCategory, category]);

  const [searchParams, setSearchParams] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchParams.toLowerCase())
  );

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-bold text-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.h1>

        <motion.div className="p-2 w-full bg-white  mx-auto relative rounded-md mb-5">
          <input
            type="text"
            placeholder="Search for products"
            className="border-2 border-gray-400 pl-6 w-full rounded-sm"
            value={searchParams}
            onChange={(e) => setSearchParams(e.target.value)}
          />
          <Search className="size-4 absolute top-[13px] left-3" />
        </motion.div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {products?.length === 0 && (
            <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
              No products found
            </h2>
          )}

          {filteredProducts?.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              openModal={openModal}
            />
          ))}
        </motion.div>
      </div>
      {isModalOpen && (
        <ProductModal product={selectedProduct} closeModal={closeModal} />
      )}
    </div>
  );
};

export default CategoryPage;
