"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Navbar = () => {
  const [theme, setTheme] = useState("light");
  const [isOpen, setIsOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Fetch cart items and set up event listener
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const itemCount = data.items.reduce((sum, item) => sum + item.quantity, 0);
          setCartItemCount(itemCount);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    // Initial fetch
    fetchCartData();

    // Set up event listener for cart updates
    const handleCartUpdate = () => {
      fetchCartData();
    };

    // Listen for custom events from other components
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
          Serves you Smart
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-800 dark:text-gray-300 hover:text-blue-500 transition">
            Home
          </Link>
          <Link href="/about" className="text-gray-800 dark:text-gray-300 hover:text-blue-500 transition">
            About
          </Link>
          <Link href="/services" className="text-gray-800 dark:text-gray-300 hover:text-blue-500 transition">
            Services
          </Link>
          <Link href="/contact" className="text-gray-800 dark:text-gray-300 hover:text-blue-500 transition">
            Contact
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
          
          {/* Cart Icon with Item Count */}
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

          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-md py-4">
          <Link href="/" className="block px-6 py-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Home</Link>
          <Link href="/about" className="block px-6 py-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">About</Link>
          <Link href="/services" className="block px-6 py-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Services</Link>
          <Link href="/contact" className="block px-6 py-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Contact</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;