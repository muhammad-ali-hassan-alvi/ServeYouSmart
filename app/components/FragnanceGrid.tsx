"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';


interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: "Fragnance";
  stock: number;
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [error, setError] = useState<string | null>(null);

  const addToCart = async (productId: string, category: string) => {
    const token = sessionStorage.getItem("token");
    const userString = sessionStorage.getItem("user");

    if (!token || !userString) {
      router.push("/login");
      return;
    }

    try {
      setLoadingStates((prev) => ({ ...prev, [productId]: true }));
      setError(null);

      const user = JSON.parse(userString);
      const response = await fetch("http://localhost:5000/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
          category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add to cart");
      }

      toast.success("Item added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      setError(err instanceof Error ? err.message : "Failed to add to cart");
      toast.error(err instanceof Error ? err.message : "Add to cart failed");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Our Best Selling Fragrances
          </h2>
          <Link
            href="/fragnance"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            View all Fragnance →
          </Link>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.slice(0, 10).map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="relative aspect-square w-full">
                <img
                  src={product.images[0] || "/placeholder-product.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.stock > 0 && (
                    <button
                      onClick={() => addToCart(product._id, product.category)}
                      disabled={loadingStates[product._id]}
                      className={`bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        loadingStates[product._id]
                          ? "opacity-75 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {loadingStates[product._id] ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Adding...
                        </span>
                      ) : (
                        "Add to Cart"
                      )}
                    </button>
                  )}
                </div>
                {product.stock > 0 && product.stock < 10 && (
                  <p className="text-xs text-orange-600 mt-2">
                    Only {product.stock} left in stock!
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
