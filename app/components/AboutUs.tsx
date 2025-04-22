"use client";

import { Check, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const AboutUs = () => {
  const router = useRouter()
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-96 w-full">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1583&q=80"
          alt="Premium Car Care Products"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Driven by Passion, Defined by Quality
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Revolutionizing car care with innovative products that make vehicle
              maintenance effortless and enjoyable.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80"
              alt="Our Founder"
              width={600}
              height={400}
              className="rounded-lg shadow-xl mt-98"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Story
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Serve You Smart was born from a simple idea: car care shouldn't be
              complicated. Founded in 2024 by automotive enthusiasts, we set out
              to create products that combine cutting-edge technology with
              user-friendly designs.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              What started as a small garage operation has grown into a trusted
              brand serving thousands of car owners nationwide. Our passion for
              vehicles drives us to innovate constantly, ensuring your car always
              looks and feels its best.
            </p>
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
              Meet Our Team
            </Button>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Mission & Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mr-4">
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Innovation
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                We constantly push boundaries to develop smarter car care
                solutions that save you time and deliver exceptional results.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full mr-4">
                  <Check className="w-6 h-6 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Quality
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Every product undergoes rigorous testing to meet our high
                standards before reaching your vehicle.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full mr-4">
                  <Shield className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Integrity
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                We believe in honest business practices and stand behind every
                product we create.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Our Premium Collections
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden rounded-lg shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80"
              alt="Car Fragrances"
              width={400}
              height={300}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-xl font-bold text-white">Fragrances</h3>
                <p className="text-gray-200">
                  Luxurious scents that transform your driving experience
                </p>
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-lg shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80"
              alt="Car Polishes"
              width={400}
              height={300}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-xl font-bold text-white">Polishes</h3>
                <p className="text-gray-200">
                  Professional-grade products for showroom shine
                </p>
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-lg shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1489824904134-891ab64532f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80"
              alt="Car Gadgets"
              width={400}
              height={300}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-xl font-bold text-white">Gadgets</h3>
                <p className="text-gray-200">
                  Innovative tools that make car care smarter and easier
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Elevate Your Car Care Experience?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust Serve You Smart for
            their vehicle maintenance needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
            >
              Shop Now
            </Button>
            <Button
              variant="outline"
              className="border-white text-blue-600 hover:bg-blue-700 hover:text-white px-8 py-4 text-lg"
              onClick={() => router.push("/contact")}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;