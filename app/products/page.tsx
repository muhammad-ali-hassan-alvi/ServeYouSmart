// app/products/page.js or similar
import React from "react";
import Products from "../components/Products";
import Navbar from "../components/Navbar";

async function getProductData() {
  try {
    const res = await fetch("https://serveyousmartbe-production.up.railway.app/api/products");

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();
    return data.products || [];
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
        <Products products={products} />
      </div>
    </>
  );
};

export default Page;
