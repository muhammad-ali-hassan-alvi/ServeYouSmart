// app/products/page.js or similar
import React from "react";
import Navbar from "../components/Navbar";
import ReturnsPage from "../components/Return";



const Page = async () => {

  return (
    <>
      <div>
        <Navbar />
      </div>

      <div className="mt-28 mx-4 sm:mx-6 lg:mx-10">
        <ReturnsPage />
      </div>
    </>
  );
};

export default Page;
