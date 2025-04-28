"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
}

interface ProductGridProps {
  products: Product[];
}

const Gadgets: React.FC<ProductGridProps> = ({ products }) => {
  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const addToCart = async (productId: string, category: string) => {
    if (
      ![
        "Test",
        "Interior",
        "Exterior",
        "Product",
        "Gadget",
        "Fragnance",
      ].includes(category)
    ) {
      setError("Invalid product category");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setLoadingStates((prev) => ({ ...prev, [productId]: true }));
      setError(null);

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

      // Dispatch cart update event to notify Navbar and other components
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: {
            productId,
            category,
            action: "add",
          },
        })
      );

      toast.success("Item added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      setError(err instanceof Error ? err.message : "Failed to add to cart");
      toast.error(err instanceof Error ? err.message : "Add to cart failed");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Our Premium Collection
            </h2>
            <p className="text-gray-600 mt-2">
              Discover our curated selection of high-quality products
            </p>
          </div>
          <Link
            href="/gadgets"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Explore All Products
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {currentProducts.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
            >
              <Link href={`/gadgetdetails/${product._id}`} className="block">
                <div className="relative aspect-square w-full">
                  <Image
                    width={300} // Add width
                    height={300} // Add height
                    src={product.images[0] || "/placeholder-product.jpg"}
                    alt={product.name}
                    // fill = "true"
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {product.stock > 0 && product.stock < 10 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Only {product.stock} left
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-5 flex flex-col flex-grow">
                <Link
                  href={`/gadgetdetails/${product._id}`}
                  className="hover:underline"
                >
                  <div className="mb-2">
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {product.description}
                </p>

                <div className="mt-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.stock > 0 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product._id, product.category);
                        }}
                        disabled={loadingStates[product._id]}
                        className={`relative inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                          loadingStates[product._id]
                            ? "opacity-75 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {loadingStates[product._id] ? (
                          <>
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
                          </>
                        ) : (
                          <>
                            <svg
                              className="-ml-1 mr-2 h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Add to Cart
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {products.length > productsPerPage && (
          <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{indexOfFirstProduct + 1}</span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastProduct, products.length)}
                </span>{" "}
                of <span className="font-medium">{products.length}</span>{" "}
                products
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                      currentPage === pageNum
                        ? "z-10 bg-indigo-600 border-indigo-500 text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
              )}

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gadgets;
