// app/returns/page.tsx
"use client"; // This component needs state for the form

import { useState } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

// NOTE: Metadata works in Server Components. For this to work in a Client Component,
// you would typically export it from a parent `page.tsx` that imports this component.
// However, for a dedicated page route like this, you can structure it this way,
// but it's better practice to separate the component from the page if you reuse it.
/*
export const metadata: Metadata = {
  title: 'Returns Center - ServeYouSmart',
  description: 'Initiate a return for your order. Our hassle-free process for Cash on Delivery purchases.',
};
*/

// --- Icon Components ---
const FormIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75c0-.231-.035-.454-.1-.664M6.75 7.5h10.5a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25v-7.5a2.25 2.25 0 012.25-2.25z" /></svg>;
const BoxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1M14 9h4l4 4v4h-2m-4-8v8m0 0h-5.5m5.5 0v-8" /></svg>;
const RefundIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0a.75.75 0 01.75.75v.75m0 0h.75a.75.75 0 010 1.5h-.75m0 0a.75.75 0 01-.75.75v.75m0 0h.75a.75.A.75 0 010 1.5h-.75m0 0a.75.75 0 01-.75.75v.75M6 12v-1.5a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v1.5m0 0v1.5a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-1.5m6-3a.75.75 0 00-.75.75v.75h.75a.75.75 0 000-1.5h-.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5v-.75a.75.75 0 00-.75-.75h-.75a.75.75 0 00-.75.75v.75m.75 0v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75m3.75 0h.75a.75.75 0 000-1.5h-.75a.75.75 0 000 1.5z" /></svg>;


export default function ReturnsPage() {



  return (
    <div className="bg-white font-poppins">
      <div className="container mx-auto max-w-5xl px-4 py-16 sm:py-24">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Returns Center
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            We want you to be completely satisfied. Our return process is designed to be simple and straightforward.
          </p>
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our 4-Step COD Return Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <div className="bg-blue-100 rounded-full p-4 mb-4"><FormIcon /></div>
                    <p className="font-semibold text-gray-800">1. Call Our HelpLine</p>
                    <p className="text-sm text-gray-600">Fill us with the necessary details</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-blue-100 rounded-full p-4 mb-4"><BoxIcon /></div>
                    <p className="font-semibold text-gray-800">2. Pack Your Item</p>
                    <p className="text-sm text-gray-600">Securely pack the item in its original, unused condition and packaging.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-blue-100 rounded-full p-4 mb-4"><TruckIcon /></div>
                    <p className="font-semibold text-gray-800">3. Ship It Back</p>
                    <p className="text-sm text-gray-600">We'll provide the return address. You ship the package back to us.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-blue-100 rounded-full p-4 mb-4"><RefundIcon /></div>
                    <p className="font-semibold text-gray-800">4. Get Your Refund</p>
                    <p className="text-sm text-gray-600">Once we inspect the item, we'll issue your refund via store credit or bank transfer.</p>
                </div>
            </div>
        </div>


      </div>
    </div>
  );
}