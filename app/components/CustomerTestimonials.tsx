"use client";
import React, { useState } from 'react';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  comment: string;
}

const CustomerTestimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Shamroz Naveed',
      rating: 5,
      comment: 'I ordered Sun Screen from Serve You Better and I received my order in just 2 days to Model Colony Malir... 💡 The order was taken on Website and communication with the seller was quite efficient.'
    },
    {
      id: 2,
      name: 'Dr. Muhammad Irfan Ehsan',
      rating: 5,
      comment: 'It was an impressive experience products are very good and management is highly cooperative I bought one product and complained there is a issue of assembling and they send me new one within days . I hope they will continue to provide dedicated services.'
    },
    {
      id: 3,
      name: 'Muhammad Sarfaraz Abbasi',
      rating: 5,
      comment: 'One of the best service facility in Kaeachi. From Keychain to Airpresers, fragrances to inferior products everything is conveniently available along with a great cup of coffee. Loved being here every time.'
    },
    {
      id: 4,
      name: 'Awais Ranjha',
      rating: 5,
      comment: 'One of the best service facility in Kaeachi. From Keychain to Airpresers, fragrances to inferior products everything is conveniently available along with a great cup of coffee. Loved being here every time.'
    },
    {
      id: 5,
      name: 'Zahab Arshad',
      rating: 4,
      comment: 'One of the best service facility in Kaeachi. From Keychain to Airpresers, fragrances to inferior products everything is conveniently available along with a great cup of coffee. Loved being here every time.'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 3 >= testimonials.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 3 : prevIndex - 1
    );
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3);

  // If we're at the end and there aren't 3 testimonials left, 
  // we'll wrap around by adding from the beginning
  const displayTestimonials = 
    visibleTestimonials.length < 3 && currentIndex + 3 > testimonials.length
      ? [...visibleTestimonials, ...testimonials.slice(0, 3 - visibleTestimonials.length)]
      : visibleTestimonials;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto relative">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Our Customers Are Saying</h2>
        
        <div className="relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 transition-transform duration-300">
            {displayTestimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{testimonial.name}</h3>
                <div className="mb-4 text-lg">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-600 flex-grow">{testimonial.comment}</p>
              </div>
            ))}
          </div>
          
          {/* Navigation arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
            aria-label="Previous testimonials"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
            aria-label="Next testimonials"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * 3)}
              className={`w-3 h-3 rounded-full ${currentIndex >= index * 3 && currentIndex < (index + 1) * 3 ? 'bg-gray-800' : 'bg-gray-300'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;