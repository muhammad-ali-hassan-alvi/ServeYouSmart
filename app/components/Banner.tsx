import React from "react";

const Banner = () => {
  return (
    <div className="w-full text-center h-[500px]">
      <div className="lg:flex w-full">
        <div className="h-fit lg:w-[65%]  mt-auto">
          <h1 className="md:text-6xl text-3xl font-bold lg:pt-10 lg:pl-28 lg:text-left pl-5 pt-10">
            Welcome to Serves you Smart
          </h1>
          <p className="lg:text-left lg:pl-28 pt-10 lg:pr-28 pl-5 text-center text-xl pb-10">
            Discover a new way to care for your car with our innovative smart
            car wash solutions. Shop top-quality car products and enjoy seamless
            service at your fingertips. Your car deserves the best—experience
            the future of vehicle care today!
          </p>
        </div>
        <div className="h-[500px] lg:w-[35%] bg-red-300 object-cover pb-10">
          <img src="/heroImage.png" alt="Hero Image" className="h-[500px] object-cover"/>
        </div>
      </div>
    </div>
  );
};

export default Banner;
