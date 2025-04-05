// app/products/page.js or similar
import React from "react";
import Navbar from "../components/Navbar";
import Fragnance from "../components/Fragnance";

async function getProductData() {
  try {
    const res = await fetch("http://localhost:5000/api/fragnance");

    if (!res.ok) {
      throw new Error("Failed to fetch fragnance");
    }

    const data = await res.json();

    // Log to confirm the data shape
    console.log("Fragnance Data:", data);

    // Return the correct key depending on how your API responds
    return data.fragnance || data.fragrances || []; // ✅ This line fixes it
  } catch (error) {
    console.error("Error fetching fragnance data:", error);
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
        <Fragnance products={products} />
      </div>
    </>
  );
};

export default Page;
