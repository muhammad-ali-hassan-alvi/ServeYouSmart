"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { jwtDecode } from "jwt-decode"; // Make sure to install this package

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  // const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);

  // Check auth status, admin status, and fetch cart items
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);

    const checkAdmin = async (token) => {
      try {
        // setIsCheckingAdmin(true);
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const response = await fetch(
          `http://localhost:5000/api/users/${userId}?isAdmin=True`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          setIsAdmin(userData.isAdmin === true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    const fetchCartData = async () => {
      try {
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const itemCount = data.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          setCartItemCount(itemCount);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    if (token) {
      checkAdmin(token);
      fetchCartData();
    }

    window.addEventListener("cartUpdated", fetchCartData);

    return () => {
      window.removeEventListener("cartUpdated", fetchCartData);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.dispatchEvent(new Event("cartUpdated"));
    router.push("/login");
  };

  const handleAdminClick = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (isAdmin) {
      router.push("/admin");
    } else {
      alert("You are not authorized to access the admin panel");
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          Serves you Smart
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-gray-800 dark:text-gray-300 hover:text-blue-500 transition"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-800 dark:text-gray-300 hover:text-blue-500 transition"
          >
            About
          </Link>
          <Link
            href="/products"
            className="text-gray-800 dark:text-gray-300 hover:text-blue-500 transition"
          >
            Products
          </Link>
          <Link
            href="/contact"
            className="text-gray-800 dark:text-gray-300 hover:text-blue-500 transition"
          >
            Contact
          </Link>

          {/* Admin Link - Only show if user is admin */}
          {isAdmin && (
            <button
              onClick={handleAdminClick}
              className="text-gray-800 dark:text-gray-300 hover:text-blue-500 transition"
            >
              Admin
            </button>
          )}

          {/* Auth Button */}
          {isLoggedIn ? (
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="px-4 py-2 rounded-md"
            >
              Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Login
              </Button>
            </Link>
          )}

          {/* Cart Icon */}
          <Link href="/cart" className="relative ml-4">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="w-5 h-5" />
            </Button>
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 block w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="w-5 h-5" />
            </Button>
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 block w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-md py-4">
          <Link
            href="/"
            className="block px-6 py-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block px-6 py-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            href="/products"
            className="block px-6 py-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Products
          </Link>
          <Link
            href="/contact"
            className="block px-6 py-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>

          {/* Admin Link in Mobile - Only show if user is admin */}
          {isAdmin && (
            <button
              onClick={(e) => {
                handleAdminClick(e);
                setIsOpen(false);
              }}
              className="block px-6 py-2 text-left w-full text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Admin
            </button>
          )}

          <div className="px-6 py-2">
            {isLoggedIn ? (
              <Button
                variant="destructive"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full"
              >
                Logout
              </Button>
            ) : (
              <Link
                href="/login"
                className="w-full block"
                onClick={() => setIsOpen(false)}
              >
                <Button
                  variant="default"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
