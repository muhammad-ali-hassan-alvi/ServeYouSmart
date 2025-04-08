"use client"
import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useRouter } from "next/navigation";

const Footer = () => {

    const router = useRouter()
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 mt-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Why Serve You Smart</h3>
            <p className="text-gray-300">
              Your ultimate destination for premium car care products. We specialize in high-quality 
              car fragrances, polishes, and innovative gadgets to keep your vehicle smelling fresh, 
              looking pristine, and performing at its best.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Site Map Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Shop</h3>
              <ul className="space-y-2">
                <li><Link href="fragrances" className="text-gray-400 hover:text-white transition">Fragrances</Link></li>
                <li><Link href="/products" className="text-gray-400 hover:text-white transition">Polishes</Link></li>
                <li><Link href="/gadgets" className="text-gray-400 hover:text-white transition">Gadgets</Link></li>
                <li><Link href="/products/new-arrivals" className="text-gray-400 hover:text-white transition">New Arrivals</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
                {/* <li><Link href="/blog" className="text-gray-400 hover:text-white transition">Blog</Link></li> */}
                {/* <li><Link href="/careers" className="text-gray-400 hover:text-white transition">Careers</Link></li> */}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition">FAQs</Link></li>
                <li><Link href="/shipping" className="text-gray-400 hover:text-white transition">Shipping</Link></li>
                <li><Link href="/returns" className="text-gray-400 hover:text-white transition">Returns</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
              </ul>
            </div>
            {/* <div>
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li><Link href="/account" className="text-gray-400 hover:text-white transition">My Account</Link></li>
                <li><Link href="/orders" className="text-gray-400 hover:text-white transition">Order History</Link></li>
                <li><Link href="/wishlist" className="text-gray-400 hover:text-white transition">Wishlist</Link></li>
                <li><Link href="/newsletter" className="text-gray-400 hover:text-white transition">Newsletter</Link></li>
              </ul>
            </div> */}
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Stay Updated</h3>
            <p className="text-gray-300">
              Subscribe to our newsletter for the latest products and car care tips.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 w-full rounded-l-md focus:outline-none text-gray-900 bg-white"
                required
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md transition"
                onClick={() => router.push("/register")}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright and Branding */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Serve You Smart. All rights reserved.
          </div>
          <div className="text-gray-400 text-sm mt-2 md:mt-0">
            A Product of the ServiSmart Group
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;