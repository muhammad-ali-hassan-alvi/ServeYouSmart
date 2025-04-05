import Banner from "./components/Banner";
import Choose from "./components/Choose";
import Navbar from "./components/Navbar";
import ProductGrid from "./components/ProductGrid";
import GadgetGrid from "./components/GadgetGrid";
import CustomerTestimonials from "./components/CustomerTestimonials";
import FragnanceGrid from "./components/FragnanceGrid";

async function getProducts() {
  try {
    const API_BASE = "http://localhost:5000/api";

    const [productRes, gadgetRes, fragnanceRes] = await Promise.all([
      fetch(`${API_BASE}/products`),
      fetch(`${API_BASE}/gadgets`),
      fetch(`${API_BASE}/fragnance`),
    ]);

    // First check response statuses
    if (!productRes.ok || !gadgetRes.ok || !fragnanceRes.ok) {
      throw new Error("Failed to fetch one or more resources");
    }

    // Then parse the responses
    const [productData, gadgetData, fragnanceData] = await Promise.all([
      productRes.json(),
      gadgetRes.json(),
      fragnanceRes.json(),
    ]);

    return {
      products: productData.products || [],
      gadgets: gadgetData.gadgets || [],
      fragnance: fragnanceData.fragrances || fragnanceData.fragnance || [],
    };
  } catch (error) {
    console.error("Error in getProducts:", error);
    return { products: [], gadgets: [], fragnance: [] };
  }
}

export default async function Home() {
  const { products = [], gadgets = [], fragnance = [] } = await getProducts();

  return (
    <main className="min-h-screen">
      <div className="relative">
        <Navbar />
      </div>

      <div className="mt-28">
        <Banner />
      </div>

      <div className="mt-98 mx-4 sm:mx-6 lg:mx-10">
        <ProductGrid products={products} />
      </div>

      <div className="lg:mt-32">
        <Choose />
      </div>

      <div className="mt-14 mx-4 sm:mx-6 lg:mx-10">
        <GadgetGrid products={gadgets} />
      </div>

      <div className="mt-14 mx-4 sm:mx-6 lg:mx-10">
        <CustomerTestimonials />
      </div>

      <div className="mt-14 mx-4 sm:mx-6 lg:mx-10">
        <FragnanceGrid products={fragnance} />
      </div>
    </main>
  );
}
