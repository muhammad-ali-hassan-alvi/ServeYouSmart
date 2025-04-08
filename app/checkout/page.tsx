// app/checkout/page.tsx
import React from "react";
import Navbar from "../components/Navbar";
import CheckoutForm from "../components/CheckoutForm";

const Page = () => {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="mt-28 mx-4 sm:mx-6 lg:mx-10">
        <CheckoutForm />
      </div>
    </>
  );
};

export default Page;