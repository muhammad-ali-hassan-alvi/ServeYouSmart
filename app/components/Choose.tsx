import React from "react";

const Choose = () => {
  const features = [
    {
      title: "Original Products",
      text: "Only Parts from trusted Brands",
      img: "https://autojin.pk/cdn/shop/files/box_d3672fa7-54cc-473f-bbbd-7e7ab48fa73c.png?v=1722433630",
    },
    {
      title: "Fast Shipping",
      text: "Quick & reliable delivery",
      img: "https://autojin.pk/cdn/shop/files/truck_1.png?v=1722433653",
    },
    {
      title: "Customer Support",
      text: "24/7 assistance for all queries",
      img: "https://autojin.pk/cdn/shop/files/hnads.png?v=1722433706",
    },
    {
      title: "Secure Payment",
      text: "Safe transactions guaranteed",
      img: "https://autojin.pk/cdn/shop/files/arrow.png?v=1722433684",
    },
  ];

  return (
    <div className="mt-10 px-5 lg:px-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-red-300 p-4 rounded-lg shadow-md"
          >
            <img src={item.img} alt={item.title} className="w-18 h-12" />
            <div>
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-600">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Choose;
