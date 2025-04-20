import React from "react";
import { MapPin, Mail, Phone } from "lucide-react"
import ContactForm from "./contact-form";

const ContactUs = () => {
  return (
    <>
      <div className="">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-700 py-40 px-10">
          <div className="text-5xl font-bold text-white">Get in Touch</div>
          <div className="mt-6 max-w-3xl text-xl text-indigo-100">
            We'd love to hear from you! Send us a message using the form below,
            or reach out to us directly.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Contact Information
            </h2>
            <p className="text-gray-500 max-w-sm">
              Fill out the form and our team will get back to you within 24
              hours.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600">
                    <Phone className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-base font-medium text-gray-900">Phone</p>
                  <p className="mt-1 text-sm text-gray-500">
                    +92 309 7409806
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-base font-medium text-gray-900">Email</p>
                  <p className="mt-1 text-sm text-gray-500">
                    support@serveyousmart.com
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-base font-medium text-gray-900">
                    Location
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Bahria Town
                    <br />
                    Lahore,
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
