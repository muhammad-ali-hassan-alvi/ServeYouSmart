"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
  } | null;
  name: string;
  price: number;
  quantity: number;
}

interface ShippingInfo {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

interface OrderDetails {
  _id: string;
  createdAt: string;
  items: OrderItem[];
  paymentMethod?: string;
  shippingInfo?: ShippingInfo;
  status?: string;
  totalPrice: number;
  updatedAt: string;
  user: string;
  __v: number;
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("token");

        const response = await fetch(`https://serveyousmartbe-production.up.railway.app/api/orders/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Order not found");
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error("Fetch order error:", err);
        setError(err instanceof Error ? err.message : "Failed to load order");
        toast.error(
          err instanceof Error ? err.message : "Failed to load order details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => router.push("/orders")}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Notice: </strong>
          <span className="block sm:inline">Order not found</span>
          <button
            onClick={() => router.push("/orders")}
            className="mt-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <Link
            href="/orders"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            &larr; Back to Orders
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Order #{order._id.slice(-6).toUpperCase()}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Shipping Information
                </h4>
                <div className="space-y-2">
                  {order.shippingInfo ? (
                    <>
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {order.shippingInfo.firstName || "N/A"}{" "}
                        {order.shippingInfo.lastName || ""}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {order.shippingInfo.phone || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span>{" "}
                        {order.shippingInfo.address || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">City:</span>{" "}
                        {order.shippingInfo.city || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Country:</span>{" "}
                        {order.shippingInfo.country || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Postal Code:</span>{" "}
                        {order.shippingInfo.postalCode || "N/A"}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500">No shipping information available</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Order Summary
                </h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status || "Unknown"}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Payment Method:</span>{" "}
                    {order.paymentMethod || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Total:</span> $
                    {order.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Order Items
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            {item.product && (
                              <div className="text-sm text-gray-500">
                                SKU: {item.product._id.slice(-6).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900"
                    >
                      Subtotal
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900"
                    >
                      Shipping
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      $0.00
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900"
                    >
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm"
          >
            Print Order
          </button>
        </div>
      </div>
    </div>
  );
}