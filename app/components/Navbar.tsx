"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming Button is from shadcn/ui
import Link from "next/link";
import { jwtDecode, JwtPayload } from "jwt-decode"; // Make sure to install: npm install jwt-decode

// Optional: Define your specific JWT payload structure for better type safety
interface MyTokenPayload extends JwtPayload {
  id: string; // Or number, ensure this matches your token's user ID claim
  // Add other claims if they exist, e.g., isAdmin: boolean;
}

// Define a type for cart items for better safety within reduce
type CartItem = {
    // Make quantity optional and allow string/number as it's cast later
    quantity?: number | string | null;
    // Add other properties if needed for typing 'item' more accurately
    // productId?: string;
    // name?: string;
};

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false); // To track admin check status

  // Effect to check auth, admin status, and fetch cart items on mount & cart updates
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);

    // --- Function to check admin status ---
    const checkAdmin = async (token: string) => {
      if (isCheckingAdmin) return;
      setIsCheckingAdmin(true);
      try {
        const decoded = jwtDecode<MyTokenPayload>(token);
        const userId = decoded?.id;
        if (!userId) {
          console.error("User ID not found in token payload.");
          setIsAdmin(false);
          return;
        }
        const response = await fetch(
          `http://localhost:5000/api/users/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.ok) {
          const userData = await response.json();
          setIsAdmin(userData && userData.isAdmin === true);
        } else {
          console.error("Failed to fetch user data for admin check:", response.status, response.statusText);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error decoding token or checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    // --- Function to fetch cart data ---
    const fetchCartData = async () => {
      const currentToken = sessionStorage.getItem("token");
      if (!currentToken) {
        setCartItemCount(0);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          // Safely calculate item count: check if 'items' is an array
          const itemCount = Array.isArray(data?.items)
            ? data.items.reduce(
                // ***** FIX HERE *****
                // Add ': number' to sum and type 'item' using CartItem type
                (sum: number, item: CartItem) => sum + (Number(item?.quantity) || 0),
                0 // Initial value for sum
              )
            : 0;
          setCartItemCount(itemCount);
        } else {
          console.error("Failed to fetch cart:", res.status, res.statusText);
          setCartItemCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCartItemCount(0);
      }
    };

    // --- Initial Execution ---
    if (token) {
      checkAdmin(token);
      fetchCartData();
    } else {
      setIsAdmin(false);
      setCartItemCount(0);
    }

    // --- Event Listener for Cart Updates ---
    window.addEventListener("cartUpdated", fetchCartData);

    // --- Cleanup Function ---
    return () => {
      window.removeEventListener("cartUpdated", fetchCartData);
    };
  }, []); // Empty dependency array: Run on mount only

  // --- Handler Functions ---
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCartItemCount(0);
    setIsOpen(false);
    router.push("/login");
  };

  const handleAdminClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isCheckingAdmin) {
      console.log("Still verifying admin status...");
      return;
    }
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (isAdmin) {
      router.push("/admin");
    } else {
      alert("You are not authorized to access the admin panel.");
    }
  };

  // --- Component JSX ---
  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Brand/Logo */}
        <Link
          href="/"
          className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap"
        >
          Serves you Smart
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-150 ease-in-out">Home</Link>
          <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-150 ease-in-out">About</Link>
          <Link href="/products" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-150 ease-in-out">Products</Link>
          <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-150 ease-in-out">Contact</Link>
          <Link href="http://localhost:3001/appointment" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-150 ease-in-out py-2 px-2">Book an Appointment</Link>

          {/* Admin Link */}
          {isLoggedIn && isAdmin && (
            <button onClick={handleAdminClick} disabled={isCheckingAdmin} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
              Admin
            </button>
          )}

          {/* Auth Button */}
          {isLoggedIn ? (
            <Button variant="destructive" onClick={handleLogout} size="sm" className="px-4 py-2">Logout</Button>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">Login</Button>
            </Link>
          )}

          {/* Cart Icon */}
          <Link href="/cart" className="relative ml-2" aria-label="Shopping Cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Button>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button & Cart */}
        <div className="flex md:hidden items-center space-x-2">
          <Link href="/cart" className="relative" aria-label="Shopping Cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Button>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                {cartItemCount}
              </span>
            )}
          </Link>

          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="w-6 h-6 text-gray-700 dark:text-gray-300" /> : <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg pb-4">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link href="/" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/about" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsOpen(false)}>About</Link>
            <Link href="/products" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsOpen(false)}>Products</Link>
            <Link href="/contact" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsOpen(false)}>Contact</Link>

            {/* Admin Link in Mobile */}
            {isLoggedIn && isAdmin && (
              <button onClick={(e) => { handleAdminClick(e); setIsOpen(false); }} disabled={isCheckingAdmin} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">
                Admin
              </button>
            )}
          </div>
          {/* Auth Button in Mobile Menu */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 pt-4 pb-2">
            {isLoggedIn ? (
              <Button variant="destructive" onClick={handleLogout} className="w-full" size="sm">Logout</Button>
            ) : (
              <Link href="/login" className="block w-full" onClick={() => setIsOpen(false)}>
                <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;