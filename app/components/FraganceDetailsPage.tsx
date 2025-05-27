"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

type ProductCategory = "Test" | "Interior" | "Exterior" | "Product" | "Gadget" | "Fragnance";

interface Fragrance {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: ProductCategory;
  stock: number;
  features?: string[];
  scentNotes?: string[];
  intensity?: string;
  sizeOptions?: string[];
  discountPrice?: number;
  rating?: number;
  reviews?: number;
  // Fragrance-specific fields
  brand?: string;
  fragranceType?: string; // e.g., Eau de Parfum, Eau de Toilette
  gender?: string; // e.g., Men, Women, Unisex
  createdAt?: string;
  updatedAt?: string;
}

export default function FragranceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Fragrance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/fragnance/${id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Product not found");
        }

        const data = await response.json();

        // Verify it's a fragrance
        if (data.category !== "Fragrance") {
          throw new Error("This is not a fragrance product");
        }

        setProduct(data);

        // Set default selections
        if (data.sizeOptions?.length) setSelectedSize(data.sizeOptions[0]);
      } catch (err) {
        console.error("Fetch product error:", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
        toast.error(
          err instanceof Error ? err.message : "Failed to load product details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const addToCart = async () => {
    if (!product) return;

    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setAddingToCart(true);
      setError(null);

      const response = await fetch("http://localhost:5000/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity,
          category: product.category,
          size: selectedSize,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add to cart");
      }

      // Dispatch cart update event
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: {
            productId: product._id,
            category: product.category,
            action: "add",
          },
        })
      );

      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Add to cart error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add to cart";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setAddingToCart(false);
    }
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Fragrance Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The fragrance you are looking for does not exist."}
          </p>
          <Link
            href="/fragrances"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Browse Fragrances
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">
                YourStore
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>
              <span>/</span>
            </li>
            <li>
              <Link href="/fragrances" className="hover:text-gray-700">
                Fragrances
              </Link>
            </li>
            <li>
              <span>/</span>
            </li>
            <li aria-current="page">
              <span className="text-gray-700 font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Main product section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product images */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="hidden md:flex flex-col space-y-4 mr-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-indigo-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="flex-1 bg-white rounded-lg overflow-hidden shadow">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {product.name}
            </h1>

            {/* Brand if available */}
            {product.brand && (
              <p className="text-lg text-gray-600 mt-1">By {product.brand}</p>
            )}

            {/* Fragrance type and gender */}
            <div className="mt-2 flex items-center space-x-4">
              {product.fragranceType && (
                <span className="text-sm text-gray-500">
                  {product.fragranceType}
                </span>
              )}
              {product.gender && (
                <span className="text-sm text-gray-500">{product.gender}</span>
              )}
            </div>

            {/* Rating and stock status */}
            <div className="mt-4">
              <div className="flex items-center">
                {product.rating ? (
                  <>
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((star) => (
                        <svg
                          key={star}
                          className={`h-5 w-5 ${
                            star < (product.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      {product.reviews || 0} reviews
                    </span>
                  </>
                ) : null}
                <span className="ml-4 text-sm text-gray-500">
                  {product.stock > 0 ? "In stock" : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mt-6">
              {product.discountPrice ? (
                <div className="flex items-center">
                  <p className="text-3xl font-bold text-gray-900">
                    ${product.discountPrice.toFixed(2)}
                  </p>
                  <p className="ml-2 text-lg text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-4">
                <p>{product.description}</p>

                {/* Scent notes */}
                {product.scentNotes?.length ? (
                  <>
                    <h4 className="font-semibold">Scent Notes:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {product.scentNotes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {/* Features */}
                {product.features?.length ? (
                  <>
                    <h4 className="font-semibold">Features:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {/* Intensity */}
                {product.intensity && (
                  <p>
                    <span className="font-medium">Intensity:</span>{" "}
                    {product.intensity}
                  </p>
                )}
              </div>
            </div>

            {/* Size picker */}
            {product.sizeOptions?.length ? (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-md border ${
                        selectedSize === size
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Quantity */}
            <div className="mt-6">
              <label
                htmlFor="quantity"
                className="text-sm font-medium text-gray-900"
              >
                Quantity
              </label>
              <div className="mt-2 flex">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-16 text-center border-t border-b border-gray-300 py-2"
                  min="1"
                  max={product.stock}
                />
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="px-3 border border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={addToCart}
                disabled={product.stock <= 0 || addingToCart}
                className={`flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  product.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""
                } ${addingToCart ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                {addingToCart ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                ) : product.stock > 0 ? (
                  "Add to cart"
                ) : (
                  "Out of stock"
                )}
              </button>
              <button
                type="button"
                className="p-3 rounded-md border border-gray-300 bg-white text-gray-400 hover:bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="sr-only">Add to favorites</span>
              </button>
            </div>

            {/* Additional details */}
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h3 className="text-sm font-medium text-gray-900">Details</h3>
              <div className="mt-4 prose prose-sm text-gray-500">
                <ul className="space-y-2">
                  <li>
                    <strong>Category:</strong> {product.category}
                  </li>
                  <li>
                    <strong>Stock:</strong> {product.stock} available
                  </li>
                  {product.createdAt && (
                    <li>
                      <strong>Added:</strong>{" "}
                      {new Date(product.createdAt).toLocaleDateString()}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}