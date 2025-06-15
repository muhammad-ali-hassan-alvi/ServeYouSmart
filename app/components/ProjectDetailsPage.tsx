"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

type ProductCategory =
  | "Test"
  | "Interior"
  | "Exterior"
  | "Product"
  | "Gadget"
  | "Fragnance";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: ProductCategory;
  stock: number;
  // Add any additional fields from your product model
  features?: string[];
  colors?: string[];
  sizes?: string[];
  discountPrice?: number;
  rating?: number; // Optional
  reviews?: number;
}

interface CartItemBody {
  productId: string;
  quantity: number;
  category: ProductCategory;
  color?: string;
  size?: string;
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      // Reset state for new fetch
      setLoading(true);
      setError(null);
      setProduct(null);
      setSelectedImage(0);
      setQuantity(1);
      setSelectedColor("");
      setSelectedSize("");

      try {
        const response = await fetch(
          `https://serveyousmartbe-production.up.railway.app/api/products/${id}`
        );

        if (!response.ok) {
          let errorMessage = "Product not found";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            console.error("Failed to parse error response:", parseError);
          }
          throw new Error(errorMessage);
        }

        const data: Product = await response.json();
        setProduct(data);

        // Set default selections if available and product loaded
        if (data.images?.length > 0) setSelectedImage(0); // Ensure image index is valid
        if (data.colors?.length) setSelectedColor(data.colors[0]);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load product";
        console.error("Fetch product error:", err);
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if id is a non-empty string
    if (id && typeof id === "string") {
      fetchProduct();
    } else if (!id) {
      // Handle case where id is missing or invalid early
      setError("Invalid product ID.");
      setLoading(false);
      toast.error("Invalid product ID.");
    }
  }, [id]); // Dependency array includes id

  const addToCart = async () => {
    if (!product) return;

    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to add items to your cart.");
      router.push("/login?redirect=/products/" + id);
      return;
    }

    // Basic validation before sending
    if (product.colors?.length && !selectedColor) {
      toast.error("Please select a color.");
      return;
    }
    if (product.sizes?.length && !selectedSize) {
      toast.error("Please select a size.");
      return;
    }
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available.`);
      setQuantity(product.stock);
      return;
    }
    if (quantity <= 0) {
      toast.error(`Quantity must be at least 1.`);
      setQuantity(1);
      return;
    }

    try {
      setAddingToCart(true);
      setError(null);

      const body: CartItemBody = {
        productId: product._id,
        quantity: quantity,
        category: product.category,
        ...(selectedColor && { color: selectedColor }),
        ...(selectedSize && { size: selectedSize }),
      };

      const response = await fetch("https://serveyousmartbe-production.up.railway.app/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add item to cart");
      }

      // Dispatch cart update event for Navbar or other components
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: {
            action: "add",
            item: data.item || { productId: product._id, quantity: quantity }, // Pass added item details if available
          },
        })
      );

      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      console.error("Add to cart error:", err);
      setError(message); // Set error state for potential display
      toast.error(message);
    } finally {
      setAddingToCart(false);
    }
  };

  // --- Render Logic ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="ml-4 text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Product
          </h1>
          <p className="text-gray-600 mb-6">
            {error ||
              "The product you are looking for could not be found or loaded."}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // --- Product Loaded - Render Details ---
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Consider using a shared Layout component for Nav/Footer */}
      {/* <nav>...</nav> */}

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
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link href="/products" className="hover:text-gray-700">
                Products
              </Link>
            </li>
            {product.category && ( // Only show category if it exists
              <>
                <li>
                  <span className="mx-2">/</span>
                </li>
                <li>
                  <Link
                    href={`/products?category=${product.category}`}
                    className="hover:text-gray-700"
                  >
                    {product.category}
                  </Link>
                </li>
              </>
            )}
            <li>
              <span className="mx-2">/</span>
            </li>
            <li aria-current="page">
              <span className="text-gray-700 font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Main product section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Product images */}
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails (Vertical for larger screens) */}
            {product.images && product.images.length > 1 && (
              <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-4 justify-center sm:justify-start mt-4 sm:mt-0 sm:mr-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-indigo-500 ring-2 ring-indigo-300 ring-offset-1" // Enhanced selection indicator
                        : "border-gray-200 hover:border-gray-400"
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
            )}

            {/* Main image */}
            <div className="flex-1 bg-white rounded-lg overflow-hidden shadow aspect-square">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  width={800} // Provide appropriate base width/height for aspect ratio
                  height={800}
                  className="w-full h-full object-cover"
                  priority // Prioritize loading the main image
                />
              ) : (
                // Placeholder if no images
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  No Image Available
                </div>
              )}
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-0 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating and stock status */}
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <div className="flex items-center justify-between">
                {/* Rating display */}
                {typeof product.rating === "number" && product.rating > 0 ? (
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((star) => (
                        <svg
                          key={star}
                          // ***** FIX APPLIED HERE *****
                          className={`h-5 w-5 flex-shrink-0 ${
                            star < product.rating! // Use non-null assertion '!'
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
                    {typeof product.reviews === "number" && (
                      <span className="ml-2 text-sm text-gray-500">
                        ({product.reviews} reviews)
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">No reviews yet</span>
                )}

                {/* Stock Status */}
                <span
                  className={`text-sm font-medium ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">
                {/* Handle discount price if available */}
                {typeof product.discountPrice === "number" &&
                product.discountPrice < product.price ? (
                  <>
                    <span className="text-red-600">
                      ${product.discountPrice.toFixed(2)}
                    </span>
                    <span className="ml-2 text-xl font-medium text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span>${product.price.toFixed(2)}</span>
                )}
              </p>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-4 prose prose-sm max-w-none">
                <p>{product.description}</p>
                {/* Only show features if they exist */}
                {product.features && product.features.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800">Features:</h4>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Product options form */}
            <form className="mt-8">
              <div className="space-y-6">
                {/* Color picker */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Color:{" "}
                      <span className="font-semibold">
                        {selectedColor || "Select a color"}
                      </span>
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`relative w-8 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            selectedColor === color
                              ? "ring-2 ring-offset-1 ring-indigo-500"
                              : ""
                          }`}
                          style={{ backgroundColor: color }} // Direct style for color background
                          aria-label={`Select color ${color}`}
                        >
                          {/* Optional: Add a checkmark for selected color */}
                          {selectedColor === color && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <svg
                                className="h-5 w-5 text-white mix-blend-difference"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size picker */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        Size:{" "}
                        <span className="font-semibold">
                          {selectedSize || "Select a size"}
                        </span>
                      </h3>
                      {/* Optional Size Guide Link */}
                      {/* <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Size guide</button> */}
                    </div>
                    <div className="mt-2 grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          disabled={product.stock <= 0} // Maybe disable if out of stock?
                          className={`py-2 px-3 rounded-md text-sm font-medium border transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${
                            selectedSize === size
                              ? "bg-indigo-600 text-white border-transparent"
                              : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                          } ${
                            product.stock <= 0
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`} // Added disabled style
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>{" "}
              {/* End options container */}
              {/* Quantity selector */}
              <div className="mt-8">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-900"
                >
                  Quantity
                </label>
                <div
                  className="mt-1 flex rounded-md shadow-sm"
                  style={{ maxWidth: "150px" }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || product.stock <= 0}
                    className="relative inline-flex items-center justify-center px-3 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-gray-500 rounded-l-md hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    {" "}
                    -{" "}
                  </button>
                  <input
                    type="number" // Use type="text" and pattern="[0-9]*" for better mobile input if needed
                    inputMode="numeric" // Helps mobile keyboards
                    id="quantity"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setQuantity(
                        isNaN(val) || val < 1 ? 1 : Math.min(val, product.stock)
                      );
                    }}
                    className="block w-full text-center border-t border-b border-gray-300 py-2 px-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    min="1"
                    max={product.stock}
                    disabled={product.stock <= 0}
                    aria-label="Current quantity"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    disabled={quantity >= product.stock || product.stock <= 0}
                    className="relative inline-flex items-center justify-center px-3 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-gray-500 rounded-r-md hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    {" "}
                    +{" "}
                  </button>
                </div>
                {product.stock > 0 && product.stock <= 5 && (
                  <p className="mt-2 text-sm text-yellow-600">
                    Only {product.stock} left in stock!
                  </p>
                )}
              </div>
              {/* Add to cart button */}
              <div className="mt-8 flex gap-4">
                <button
                  type="button" // Changed from submit as it doesn't submit a form
                  onClick={addToCart}
                  disabled={
                    product.stock <= 0 ||
                    addingToCart ||
                    quantity > product.stock
                  }
                  className={`flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150`}
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
                {/* Wishlist Button (Optional) */}
                {/* <button type="button" className="p-3 rounded-md border border-gray-300 bg-white text-gray-400 hover:bg-gray-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="sr-only">Add to favorites</span>
                </button> */}
              </div>
            </form>

            {/* Add more sections like Specifications, Reviews here if needed */}
          </div>
        </div>
      </main>

      {/* Consider using a shared Layout component for Nav/Footer */}
      {/* <footer className="bg-white border-t border-gray-200 mt-16">...</footer> */}
    </div>
  );
}
