//import React from "react";

const products = [
  {
    id: 1,
    name: "Nepali Dress",
    image: "/magardress.jpg",
    description: "Traditional handmade dress from Nepal.",
    price: "RS1500",
  },
  {
    id: 2,
    name: "Silver Tribal Necklace",
    image: "/jewelery.jpg",
    description: "Authentic silver tribal necklace.",
    price: "Rs300",
  },
  {
    id: 3,
    name: "Pashmina Shawl",
    image: "/pashminashawl.jpg",
    description: "Soft and warm Pashmina shawl.",
    price: "Rs800",
  },
];

const ProductPage = () => {
  return (
     <div className="container mx-auto p-8 bg-white" >
    <h1 className="text-3xl font-bold text-center mb-6">Our Products</h1>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow-lg">
            <img src={product.image} alt={product.name} className="w-full h-80 object-cover mb-4" />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-lg font-bold">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
