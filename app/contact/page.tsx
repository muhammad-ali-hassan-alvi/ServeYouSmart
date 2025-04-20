import React from "react";
import ContactUs from "../components/ContactUs";
import Navbar from "../components/Navbar";

const page = () => {
  return (
    <>
      <div className="mb-16">
        <Navbar />
      </div>
      <div className="">
        <ContactUs />
      </div>
    </>
  );
};

export default page;
