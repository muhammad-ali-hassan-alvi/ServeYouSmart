// app/products/page.js or similar
import React from "react";
import Navbar from "../components/Navbar";
import FAQPage from "../components/faq";



const Page = async () => {

  return (
    <>
      <div>
        <Navbar />
      </div>

      <div className="mt-28 mx-4 sm:mx-6 lg:mx-10">
        <FAQPage />
      </div>
    </>
  );
};

export default Page;
