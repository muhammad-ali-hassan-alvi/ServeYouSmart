"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
};

type CartItem = {
  product: Product;
  quantity: number;
  _id: string;
};

type Cart = {
  _id: string;
  user: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>(
    {}
  );
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token"); // Assuming the token is stored with key "token"

      if (!token) {
        throw new Error("User not authenticated. Token missing.");
      }

      const response = await fetch("http://localhost:5000/api/cart/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token here
        },
        credentials: "include", // optional: include cookies if needed
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      setCart(data);
    } catch (error: unknown) {
      console.error("Error fetching cart:", error);

      if (error instanceof Error) {
        toast.error(error.message || "Failed to load your cart");
      } else {
        toast.error("Failed to load your cart");
      }
    } finally {
      setLoading(false);
    }
  };

  console.log("Cart:", cart); // Log the cart data to check its structure

  const updateQuantity = async (
    productId: string,
    newQuantity: number,
    category: string
  ) => {
    // Prevent invalid quantity update
    if (newQuantity < 1) return toast.error("Quantity must be positive");

    const token = sessionStorage.getItem("token");
    if (!token) return toast.error("Authentication token missing");

    // Ensure that productId, category, and newQuantity are passed in the correct format
    if (!productId || !category || newQuantity < 1) {
      return toast.error("productId, category, and quantity are required");
    }

    try {
      setUpdatingItems((prev) => ({ ...prev, [productId]: true }));

      const response = await fetch(`http://localhost:5000/api/cart/items`, {
        // Ensure URL is correct
        method: "POST", // API is likely expecting POST instead of PUT
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productId, // Ensure productId is passed correctly
          quantity: newQuantity, // Ensure the quantity is positive
          category: category, // Ensure category is passed correctly
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update quantity");
      }

      await fetchCart(); // Fetch updated cart after successful update
      toast.success("Quantity updated successfully");
    } catch (error: unknown) {
      console.error("Error updating quantity:", error);

      if (error instanceof Error) {
        toast.error(error.message || "Failed to update quantity");
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const removeItem = async (productId: string) => {
    const token = sessionStorage.getItem("token");
    if (!token) return toast.error("Authentication token missing");

    try {
      setUpdatingItems((prev) => ({ ...prev, [productId]: true }));

      const response = await fetch(
        `http://localhost:5000/api/cart/items/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // You need to include the auth token
          },
          // credentials: "include" is not needed if you're using Bearer token
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove item");
      }

      await fetchCart();
      toast.success("Item removed from cart");
    } catch (error: unknown) {
      console.error("Error removing item:", error);

      if (error instanceof Error) {
        toast.error(error.message || "Failed to remove item");
      } else {
        toast.error("Failed to remove item");
      }
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const clearCart = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return toast.error("Authentication token missing");
    try {
      setLoading(true);
      const response = await fetch("/api/carts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      setCart(null);
      toast.success("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-6">
            Looks like you haven&apos;t added any items to your cart yet.
          </p>

          <Link href="/products">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Your Shopping Cart</title>
        <meta
          name="description"
          content="Review and manage your shopping cart"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Your Shopping Cart
          </h1>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {cart.items.length}{" "}
                  {cart.items.length === 1 ? "Item" : "Items"} in Cart
                </h3>
                <button
                  onClick={clearCart}
                  disabled={loading}
                  className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                >
                  {loading ? "Clearing..." : "Clear Cart"}
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <div key={item._id} className="px-4 py-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                      <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <span className="text-gray-500 text-xs">
                            No Image
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                          <h4 className="text-lg font-medium text-gray-900">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-gray-500 capitalize">
                            {item.product.category}
                          </p>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            ${item.product.price.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  item.quantity - 1,
                                  item.product.category
                                )
                              }
                              disabled={
                                item.quantity <= 1 ||
                                updatingItems[item.product._id]
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-center">
                              {updatingItems[item.product._id] ? (
                                <span className="inline-block h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  item.quantity + 1,
                                  item.product.category
                                )
                              }
                              disabled={
                                item.quantity >= item.product.stock ||
                                updatingItems[item.product._id]
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.product._id)}
                            disabled={updatingItems[item.product._id]}
                            className="ml-4 text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            {updatingItems[item.product._id] ? (
                              <span className="inline-block h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                              "Remove"
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-gray-500">
                        <p>
                          {item.product.stock > 0 ? (
                            <span className="text-green-600">
                              {item.product.stock} available in stock
                            </span>
                          ) : (
                            <span className="text-red-600">Out of stock</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Order Summary
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Shipping and taxes calculated at checkout
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${calculateTotal().toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <Link href="/products">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Continue Shopping
                  </button>
                </Link>
                <button
                  onClick={() => router.push("/checkout")}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
