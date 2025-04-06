// app/products/page.js or similar
import React from "react";
import Navbar from "../components/Navbar";
import Gadgets from "../components/Gadgets";

async function getProductData() {
    try {
      const res = await fetch("http://localhost:5000/api/gadgets"); // Remove trailing slash for consistency
  
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
  
      const data = await res.json();
      return data.gadgets || []; // Change from data.products to data.gadgets
    } catch (error) {
      console.error("Error fetching product data:", error);
      return [];
    }
  }

const Page = async () => {
  const products = await getProductData();

  return (
    <>
      <div>
        <Navbar />
      </div>

      <div className="mt-28 mx-4 sm:mx-6 lg:mx-10">
        <Gadgets products={products} />
      </div>
    </>
  );
};

export default Page;
